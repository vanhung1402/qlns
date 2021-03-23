<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import moment from 'moment'
import { dateFilter } from 'vue-date-fns'
import Multiselect from 'vue-multiselect'
import StaffWorkProcessList from '@components/nhan-vien/StaffWorkProcessList'

export default {
  page: {
    title: 'Quá trình làm việc',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  filters: {
    date: dateFilter,
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    StaffWorkProcessList,
  },
  data() {
    return {
      title: 'quá trình làm việc',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý nhân viên',
          href: '/',
        },
        {
          text: 'quá trình làm việc',
          active: true,
        },
      ],
      icon: 'file-shield-alt',
      btnSubmitTitle: 'Lập quá trình làm việc',
      iconBtnSubmit: 'plus',
      isUpdate: false,
      submitted: false,
      listJobPosition: [],
      listWorkProcess: [],
      profile: {},
      dNgayBatdauConfig: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
      },
      dNgayKethucConfig: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
      },
      formWorkProcess: {
        FK_iVitriCongviecID: null,
        dNgayBatdau: new Date(),
        dNgayKethuc: '',
        sGhichu: '',
      },
    }
  },
  created() {
    this.loadProfile()
    this.loadWorkProcess()
    this.loadJobPosition()
  },
  methods: {
    async loadJobPosition() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listJobPosition = promise.data
      }
    },
    async loadWorkProcess() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      let listJobPosition = {}
      if (promise.status === 200 && promise.data) {
        promise.data.forEach((job) => {
          listJobPosition[job._id] = job
        })
      }
      this.$staff
        .get(
          '/nhan-vien/qua-trinh-lam-viec?nhan-vien=' +
            this.$router.currentRoute.params.profileId
        )
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.listWorkProcess = res.data.map((work) => {
              work.viTriCongViec =
                listJobPosition[work.FK_iVitriCongviecID].sTenVitriCongviec +
                ' - ' +
                moment(String(work.dNgayBatdau)).format('DD/MM/YYYY') +
                (work.dNgayKethuc
                  ? ' - ' +
                    moment(String(work.dNgayKethuc)).format('DD/MM/YYYY')
                  : '')

              return work
            })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async loadProfile() {
      this.$staff
        .get(
          '/nhan-vien/ho-so?id=' + this.$router.currentRoute.params.profileId
        )
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.profile = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSubmit() {
      this.submitted = true
      this.$v.form.$touch()
      if (
        !this.formWorkProcess.FK_iVitriCongviecID ||
        !this.checkAvailableDate(this.formWorkProcess.dNgayBatdau) ||
        (this.formWorkProcess.dNgayKethuc &&
          !this.checkAvailableDate(
            this.formWorkProcess.dNgayKethuc,
            new Date(),
            '>='
          ))
      )
        return false
      if (this.isUpdate) {
        this.handleUpdate()
      } else {
        this.handleAddNew()
      }
    },
    handleAddNew() {
      const staffWorkProcess = { ...this.formWorkProcess }
      staffWorkProcess.PK_iQuatrinhLamviecID = Date.now()
      staffWorkProcess.FK_iNguoiChuyenID = this.$store.state.auth.currentUser.staff
      staffWorkProcess.FK_iNhanvienID = this.$router.currentRoute.params.profileId
      staffWorkProcess.tThoigianChuyen = new Date().toISOString()
      staffWorkProcess.FK_iVitriCongviecID =
        staffWorkProcess.FK_iVitriCongviecID._id

      staffWorkProcess.dNgayBatdau = this.isValidDate(
        staffWorkProcess.dNgayBatdau
      )
        ? staffWorkProcess.dNgayBatdau
        : new Date(this.convertDate(staffWorkProcess.dNgayBatdau))
      staffWorkProcess.dNgayBatdau = staffWorkProcess.dNgayBatdau.toISOString()

      if (staffWorkProcess.dNgayKethuc) {
        staffWorkProcess.dNgayKethuc = this.isValidDate(
          staffWorkProcess.dNgayKethuc
        )
          ? staffWorkProcess.dNgayKethuc
          : new Date(this.convertDate(staffWorkProcess.dNgayKethuc))
        staffWorkProcess.dNgayKethuc = staffWorkProcess.dNgayKethuc.toISOString()
      }
      this.$staff
        .post('/nhan-vien/qua-trinh-lam-viec', staffWorkProcess)
        .then((res) => {
          if (res.status === 200) {
            this.loadWorkProcess()
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleResetForm() {
      this.form = {}

      this.submitted = false
      this.isUpdate = false
    },
    convertDate(dateOld) {
      let date = dateOld.split('/')
      let newDate = [date[1], date[0], date[2]]
      return newDate.join('/')
    },
    isValidDate(date) {
      return date instanceof Date && !isNaN(date)
    },
    checkAvailableDate(dateString, dateCompare = null, condition = null) {
      let newDate = this.isValidDate(dateString)
        ? dateString
        : this.convertDate(dateString)
      newDate = new Date(newDate)

      if (newDate instanceof Date && !isNaN(newDate)) {
        if (dateCompare !== null) {
          switch (condition) {
            case '>':
              return newDate > dateCompare
            case '>=':
              return newDate >= dateCompare
            case '=':
              return newDate === dateCompare
            case '<':
              return newDate < dateCompare
            case '<=':
              return newDate <= dateCompare
            default:
              return false
          }
        }
        return true
      }

      return false
    },
    onChangeStartDate() {
      let minDate = this.isValidDate(
        this.formWorkProcess.dNgayBatdau
      )
        ? this.formWorkProcess.dNgayBatdau
        : new Date(this.convertDate(this.formWorkProcess.dNgayBatdau))
			minDate.setDate(minDate.getDate() + 1)
			this.dNgayKethucConfig.minDate = minDate
    },
  },
  validations: {
    form: {},
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />

    <div class="card">
      <div class="card-body">
        <h4 class="text-center text-uppercase">{{
          isUpdate ? 'Cập nhật quá trình làm việc' : 'Thêm quá trình làm việc'
        }}</h4>
        <hr />
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-8 form-group">
              <label for="jobPosition">
                Vị trí công việc
                <span class="text-danger">*</span>
              </label>
              <multiselect
                id="jobPosition"
                v-model="formWorkProcess.FK_iVitriCongviecID"
                name="jobPosition"
                label="sTenVitriCongviec"
                track-by="_id"
                placeholder="Chọn vị trí công việc"
                :show-labels="false"
                :options="listJobPosition"
              ></multiselect>
              <div
                class="invalid-feedback"
                :class="{
                  'invalid-feedback invalid-feedback-select':
                    submitted && !formWorkProcess.FK_iVitriCongviecID,
                }"
                >Vui lòng chọn vị trí công việc.</div
              >
            </div>
            <div class="col-md-2 form-group">
              <label for="ngay-bat-dau-cong-viec"
                >Ngày bắt đầu <span class="text-danger">*</span></label
              >
              <flat-pickr
                id="ngay-bat-dau-cong-viec"
                v-model="formWorkProcess.dNgayBatdau"
                :config="dNgayBatdauConfig"
                class="form-control"
                placeholder="dd/mm/yyyy"
                :class="{
                  'is-invalid':
                    submitted &&
                    !checkAvailableDate(formWorkProcess.dNgayBatdau),
                }"
                @input="onChangeStartDate"
              ></flat-pickr>
              <div
                v-if="
                  submitted && !checkAvailableDate(formWorkProcess.dNgayBatdau)
                "
                class="invalid-feedback"
                >Ngày bắt đầu công việc không hợp lệ</div
              >
            </div>
            <div class="col-md-2 form-group">
              <label for="ngay-bat-dau-cong-viec">Ngày kết thúc</label>
              <flat-pickr
                id="ngay-ket-thuc-cong-viec"
                v-model="formWorkProcess.dNgayKethuc"
                :config="dNgayKethucConfig"
                class="form-control"
                placeholder="Chọn thời gian"
                :class="{
                  'is-invalid':
                    submitted &&
                    formWorkProcess.dNgayKethuc &&
                    !checkAvailableDate(
                      formWorkProcess.dNgayKethuc,
                      new Date(),
                      '>='
                    ),
                }"
              ></flat-pickr>
              <div
                v-if="
                  submitted &&
                  formWorkProcess.dNgayKethuc &&
                  !checkAvailableDate(
                    formWorkProcess.dNgayKethuc,
                    new Date(),
                    '>='
                  )
                "
                class="invalid-feedback"
                >Ngày kết thúc công việc không hợp lệ</div
              >
            </div>
            <div class="col-md-12 form-group">
              <label for="ghi-chu">Ghi chú công viêc</label>
              <input
                id="ghi-chu"
                v-model="formWorkProcess.sGhichu"
                type="text"
                class="form-control"
                placeholder="VD: Thăng cấp, chuyển bộ phận..."
              />
            </div>
          </div>
          <div class="form-group text-center mt-2">
            <button class="btn btn-primary" name="action" type="submit">
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
    <StaffWorkProcessList :list-work-process="listWorkProcess" />
  </Layout>
</template>
<style>
.invalid-feedback.invalid-feedback-select {
  display: block;
}
</style>