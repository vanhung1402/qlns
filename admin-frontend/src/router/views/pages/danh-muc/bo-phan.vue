<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required } from 'vuelidate/lib/validators'

export default {
  page: {
    title: 'Quản lý danh mục Bộ phận',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Danh mục Bộ phận',
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
          text: 'Bộ phận',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      isUpdate: false,
      listDepartment: [],
      form: {
        tenBoPhan: '',
      },
      submitted: false,
    }
  },
  created() {
    this.loadlistDepartment()
  },
  methods: {
    async loadlistDepartment() {
      await this.$recruitment
        .get('api/cau-hinh/list-department')
        .then((res) => {
          if (res.status === 200) {
            this.listDepartment = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleResetForm() {
      this.form = {
        tenBoPhan: '',
      }
      this.submitted = false
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
      this.handleSave()
    },
    handleSave() {
      let newBophan = {
        PK_iBophanID: Date.now(),
        sTenBophan: this.form.tenBoPhan,
      }

      this.$recruitment
        .post('/api/cau-hinh/department', newBophan)
        .then((res) => {
          if (res.status === 200) {
            this.$toastr.success(
              'Thêm Bộ phận thành công.',
              'Thành công'
            )
            this.loadlistDepartment()
						this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi Bộ phận.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error('Không thể thêm Bộ phận.', 'Thất bại')
        })
    },
  },
  validations: {
    form: {
      tenBoPhan: { required },
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <form method="post" @submit.prevent="handleSubmit">
              <h4 class="card-title text-center text-uppercase">{{
                isUpdate ? 'Cập nhật Bộ phận' : 'Thêm Bộ phận'
              }}</h4>
              <div class="form-group">
                <label for="ten-vi-tri-cong-viec">
                  Tên Bộ phận
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ten-vi-tri-cong-viec"
                  v-model="form.tenBoPhan"
                  name="ten-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid': submitted && $v.form.tenBoPhan.$error,
                  }"
                  type="text"
                  placeholder="Tên Bộ phận"
                />
                <div
                  v-if="submitted && !$v.form.tenBoPhan.required"
                  class="invalid-feedback"
                  >Vui lòng nhập tên Bộ phận.</div
                >
              </div>
              <div class="form-group text-center m-b-0">
                <button
                  class="btn btn-primary"
                  name="action"
                  value="then-vi-tri-cong-viec"
                  type="submit"
                >
                  <i class="uil uil-plus"></i> Thêm Bộ phận</button
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
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-center text-uppercase"
              >Danh sách Bộ phận</h4
            >
            <table class="table table-border">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã Bộ phận</th>
                  <th>Tên Bộ phận</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(department, index) in listDepartment"
                  :key="department._id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ department.PK_iBophanID }}</td>
                  <td>{{ department.sTenBophan }}</td>
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
