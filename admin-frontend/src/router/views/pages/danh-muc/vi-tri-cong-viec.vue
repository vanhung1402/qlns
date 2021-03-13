<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Multiselect from 'vue-multiselect'
import { required } from 'vuelidate/lib/validators'

export default {
  page: {
    title: 'Quản lý danh mục Vị trí công việc',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  data() {
    return {
      title: 'Vị trí công việc',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý danh mục',
          href: '/',
        },
        {
          text: 'Vị trí công việc',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      isUpdate: false,
      form: {
        tenViTriCongViec: '',
        boPhan: null,
      },
      submitted: false,
      listDepartment: [],
      listJobPosition: [],
    }
  },
  validations: {
    form: {
      tenViTriCongViec: { required },
      boPhan: { required },
    },
  },
  created() {
    this.loadlistDepartment()
    this.loadlistJobPosition()
  },
  methods: {
    async loadlistDepartment() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-department')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listDepartment = promise.data
      }
    },
    async loadlistJobPosition() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listJobPosition = promise.data
      }
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
      this.handleSave()
    },
    handleSave() {
      let newViTriCongViec = {
        PK_iVitriCongviecID: Date.now(),
        sTenVitriCongviec: this.form.tenViTriCongViec,
        FK_iBophanID: this.form.boPhan,
        iThutuVitriCongviec: this.listJobPosition.length,
      }

      this.$recruitment
        .post('/api/cau-hinh/job-position', newViTriCongViec)
        .then((res) => {
          if (res.status === 200) {
            this.$toastr.success(
              'Thêm Vị trí công việc thành công.',
              'Thành công'
            )
            this.loadlistJobPosition()
						this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi Vị trí công việc.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error('Không thể thêm Vị trí công việc.', 'Thất bại')
        })
    },
    handleResetForm() {
      this.form = {
        tenViTriCongViec: '',
        boPhan: null,
      }
      this.submitted = false
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <form method="post" @submit.prevent="handleSubmit">
              <h4 class="card-title text-center text-uppercase">{{
                isUpdate ? 'Cập nhật Vị trí công việc' : 'Thêm Vị trí công việc'
              }}</h4>
              <div class="form-group">
                <label for="ten-vi-tri-cong-viec">
                  Tên vị trí công việc
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ten-vi-tri-cong-viec"
                  v-model="form.tenViTriCongViec"
                  name="ten-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid': submitted && $v.form.tenViTriCongViec.$error,
                  }"
                  type="text"
                  placeholder="Tên vị trí công việc"
                />
                <div
                  v-if="submitted && !$v.form.tenViTriCongViec.required"
                  class="invalid-feedback"
                  >Vui lòng nhập tên vị trí công việc.</div
                >
              </div>

              <div class="form-group">
                <label for="bo-phan">
                  Bộ phận
                  <span class="text-danger">*</span>
                </label>
                <multiselect
                  id="bo-phan"
                  v-model="form.boPhan"
                  name="permission"
                  label="sTenBophan"
                  track-by="PK_iBophanID"
                  placeholder="Chọn bộ phận"
                  :show-labels="false"
                  :options="listDepartment"
                ></multiselect>
                <div class="invalid-feedback" :class="{ 'invalid-feedback invalid-feedback-select': submitted && !form.boPhan }"
                  >Vui lòng chọn bộ phận.</div
                >
              </div>

              <div class="form-group text-center m-b-0">
                <button
                  class="btn btn-primary"
                  name="action"
                  value="then-vi-tri-cong-viec"
                  type="submit"
                >
                  <i class="uil uil-plus"></i> Thêm vị trí công việc</button
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
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-center text-uppercase"
              >Danh sách Vị trí công việc</h4
            >
            <table class="table table-border">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên vị trí công việc</th>
                  <th>Bộ phận</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(jobPosittion, index) in listJobPosition"
                  :key="jobPosittion._id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ jobPosittion.sTenVitriCongviec }}</td>
                  <td>{{ jobPosittion.FK_iBophanID.sTenBophan }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style>
.invalid-feedback.invalid-feedback-select{
	display: block;
}
</style>