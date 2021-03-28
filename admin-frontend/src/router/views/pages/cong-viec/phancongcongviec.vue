<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import { VueEditor } from 'vue2-editor'
import { required } from 'vuelidate/lib/validators'
import WorkFlowList from '@components/cong-viec/WorkFlowList'

export default {
  page: {
    title: 'Quản lý Phân công công việc',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    VueEditor,
    Multiselect,
    WorkFlowList,
  },
  data() {
    return {
      title: 'Phân công công việc',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý công việc',
          href: '/',
        },
        {
          text: 'Phân công công việc',
          active: true,
        },
      ],
      icon: 'cell',
      isUpdate: false,
      submitted: false,
      btnSubmitTitle: 'Thêm công việc',
      iconBtnSubmit: 'plus',
      form: {
        sTenCongviec: '',
        sNoidungCongviec: '',
      },
      phanCong: null,
      listStaff: [],
      listWorkFlow: [],
      congViecUpdateId: 0,
    }
  },
  created() {
    this.loadListStaff()
    this.loadListWorkFlow()
  },
  methods: {
    loadListWorkFlow() {
      this.$workflow
        .get('/cong-viec?action=danh-sach')
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.listWorkFlow = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    loadListStaff() {
      this.$workflow
        .get('/?action=danh-sach-nhan-vien')
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.listStaff = res.data
              .sort((a, b) => {
                if (a.sTen > b.sTen) {
                  return 1
                } else if (a.sTen < b.sTen) {
                  return -1
                } else {
                  return 0
                }
              })
              .map((staff) => {
                staff.sTieudeNhanvien = `${staff.sMaNhanvien} | ${staff.sHoten}`
                return staff
              })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSubmit() {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false

      if (this.isUpdate) this.handleUpdateWorlFlow()
      else this.handleAddNewWorlFlow()
    },
    getNewWorlFlow() {
      let newWorlFlow = { ...this.form }
      return newWorlFlow
    },
    getWorkAssignment(congViecId) {
      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      let workAssignment = this.phanCong.map((staff) => {
        let pc = {
          PK_iPhancongCongviecID: `${congViecId}${this.getNewId()}`,
          FK_iNhanvienID: staff._id,
          FK_iCongviecID: congViecId,
          FK_iNguoiPhancongID: this.$store.state.auth.currentUser.staff,
          tThoigianPhancong: now,
          FK_iTrangthaiPhancongCongviecID: 1,
        }
        return pc
      })
      return workAssignment
    },
    getNewId() {
      return Date.now().toString() + Math.floor(Math.random() * 1000) + 1
    },
    handleAddNewWorlFlow() {
      let newWorlFlow = this.getNewWorlFlow()
      newWorlFlow.PK_iCongviecID = this.getNewId()
      newWorlFlow.FK_iNguoiThemCongviecID = this.$store.state.auth.currentUser.staff
      newWorlFlow.tThoigianThemCongviec = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      let workAssignment = this.getWorkAssignment(newWorlFlow.PK_iCongviecID)
      newWorlFlow.FK_iTrangthaiCongviecID = workAssignment.length ? 2 : 1

      this.$workflow
        .post('/cong-viec?action=them-cong-viec', {
          work: newWorlFlow,
          assignment: workAssignment,
        })
        .then((res) => {
          if (res.status === 200) {
            this.loadListWorkFlow()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleUpdateWorlFlow() {
      let newWorlFlow = this.getNewWorlFlow()
      newWorlFlow.FK_iNguoiThemCongviecID = this.$store.state.auth.currentUser.staff
      newWorlFlow.tThoigianThemCongviec = moment(new Date()).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      let workAssignment = this.getWorkAssignment(this.congViecUpdateId)
      newWorlFlow.FK_iTrangthaiCongviecID = workAssignment.length ? 2 : 1

      this.$workflow
        .post(
          '/cong-viec?action=cap-nhat-cong-viec&cong-viec=' +
            this.congViecUpdateId,
          {
            work: newWorlFlow,
            assignment: workAssignment,
          }
        )
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.loadListWorkFlow()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleEditNewWorlFlow() {},
    handleResetForm() {
      this.form = {
        sTenCongviec: '',
        sNoidungCongviec: '',
      }
      this.phanCong = null
    },
    async handleClickEditWorkFlow(data) {
      this.isUpdate = true
      this.btnSubmitTitle = 'Sửa công việc'
      this.iconBtnSubmit = 'arrow-to-bottom'
      this.$refs.tencongviec.focus()
      this.form.sTenCongviec = data.sTenCongviec
      this.form.sNoidungCongviec = data.sNoidungCongviec
      let assignment = await this.getWorkAssignmentOfWork(data.PK_iCongviecID)
      let phanCongId = assignment.map((pc) => pc._id)

      this.phanCong = this.listStaff.filter((staff) => {
        return phanCongId.indexOf(staff._id) !== -1
      })
      this.congViecUpdateId = data.PK_iCongviecID
    },
    async getWorkAssignmentOfWork(workFlowId) {
      const promise = await this.$workflow
        .get('/cong-viec?action=phan-cong&cong-viec=' + workFlowId)
        .catch((err) => {
          console.error(err)
        })
      return promise && promise.status === 200 ? promise.data : []
    },
  },
  validations: {
    form: {
      sTenCongviec: { required },
      sNoidungCongviec: { required },
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="card">
      <div class="card-body">
        <h4 class="text-center text-uppercase">{{
          isUpdate ? 'Cập nhật công việc' : 'Thêm công việc'
        }}</h4>
        <hr />
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="ten-cong-viec"
              >Tên công việc <span class="text-danger">*</span></label
            >
            <input
              id="ten-cong-viec"
              ref="tencongviec"
              v-model="form.sTenCongviec"
              type="text"
              class="form-control"
              name="ten-cong-viec"
              placeholder="VD: Giới thiệu sản phẩm cho khách hàng"
              :class="{
                'is-invalid': submitted && $v.form.sTenCongviec.$error,
              }"
            />
            <div
              v-if="submitted && !$v.form.sTenCongviec.required"
              class="invalid-feedback"
              >Chưa nhập Tên công việc</div
            >
          </div>
          <div class="form-group">
            <label>Nội dung công việc <span class="text-danger">*</span></label>
            <vue-editor v-model="form.sNoidungCongviec"></vue-editor>
            <div
              class="invalid-feedback"
              :class="{
                'invalid-feedback invalid-feedback-select':
                  submitted && !form.sNoidungCongviec,
              }"
              >Chưa nhập Nội dung công việc.</div
            >
          </div>
          <div class="form-group">
            <label for="phan-cong-nhan-vien"> Phân công </label>
            <multiselect
              id="phan-cong-nhan-vien"
              v-model="phanCong"
              label="sTieudeNhanvien"
              track-by="_id"
              placeholder="Chọn nhân viên..."
              :multiple="true"
              :show-labels="false"
              :options="listStaff"
            ></multiselect>
          </div>
          <div class="form-group text-center m-b-0">
            <button
              class="btn btn-primary"
              name="action"
              value="them-ke-hoach"
              type="submit"
            >
              <i :class="'uil uil-' + iconBtnSubmit"></i>
              {{ btnSubmitTitle }}</button
            >
            <button
              type="reset"
              class="btn btn-secondary m-l-5 ml-1"
              @click="handleResetForm"
            >
              <i class="uil uil-multiply"></i> Hủy</button
            >
          </div>
        </form>
      </div>
    </div>
    <WorkFlowList
      :list-work-flow="listWorkFlow"
      @onClickEditWorkFlow="handleClickEditWorkFlow"
      @handleCancelWorkFlow="loadListWorkFlow"
    />
  </Layout>
</template>
<style>
.invalid-feedback.invalid-feedback-select {
  display: block;
}
</style>