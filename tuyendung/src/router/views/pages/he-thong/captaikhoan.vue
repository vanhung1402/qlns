
<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import {
  required,
  minLength,
  sameAs,
  maxLength,
} from 'vuelidate/lib/validators'

import Multiselect from 'vue-multiselect'
import StatProgress from '@components/widget-stat-progress'

export default {
  page: {
    title: 'Cấp tài khoản',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Multiselect, StatProgress },
  data() {
    return {
      title: 'Cấp tài khoản',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý hệ thống',
          href: '/',
        },
        {
          text: 'Cấp tài khoản',
          active: true,
        },
      ],
      icon: 'user-plus',
      form: {
        employee: '',
        username: '',
        permission: '',
        password: '',
        confirmPassword: '',
      },
      submitted: false,
      listPermission: [
        { sTenQuyen: 'Nhân viên', PK_iQuyenID: '1' },
        { sTenQuyen: 'Kế toán', PK_iQuyenID: '2' },
        { sTenQuyen: 'Hành chính', PK_iQuyenID: '3' },
      ],
      listAccountStatus: [],
      listStaff: [],
      statProgress: [
        {
          title: 'Số tài khoản đã cấp',
          value: 115,
          progress: 90,
          text: 'Số nhân viên đã được cấp tài khoản',
          color: 'success',
        },
        {
          title: 'Số tài khoản bị khóa',
          value: 10,
          progress: 10,
          text: 'Số tài khoản đang bị khóa',
          color: 'warning',
        },
      ],
    }
  },
  validations: {
    form: {
      username: { required, maxLength: maxLength(255) },
      employee: { required },
      permission: { required },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') },
    },
  },
  created() {
    this.loadListStaff()
    this.loadListPermission()
    this.loadListAccountStatus()
  },
  methods: {
    loadListAccountStatus(){
      this.$recruitment
        .get('/api/danh-muc/list-account-status', {})
        .then((res) => {
          this.listAccountStatus = res.data
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    loadListPermission() {
      this.$recruitment
        .get('/api/danh-muc/list-permission', {})
        .then((res) => {
          this.listPermission = res.data
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    loadListStaff() {
      this.$recruitment
        .get('/api/nhan-vien/list-staff', {})
        .then((res) => {
          let listStaffFormat = res.data.map((staff) => {
            staff.selectTitle = staff.sHoten + ' - ' + staff.tNgaysinh
            return staff
          })
          this.listStaff = listStaffFormat
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
      this.handleCreateAccount()
    },
    handleCreateAccount() {
      let newAccount = this.form
      newAccount.id = Date.now()
      newAccount.createBy = this.listStaff[0]
      newAccount.status = this.listAccountStatus[0]
      this.$recruitment
        .post('/api/he-thong/account', newAccount)
        .then((res) => {
          if (res.data.PK_iTaikhoanID) {
            this.$toastr.success('Cấp tài khoản thành công.', 'Thành công')
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cấp tài khoản.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          this.$toastr.error('Đã có lỗi xảy ra khi cấp tài khoản.', 'Thất bại')
          console.error('Error: ', err)
        })
    },
    handleResetForm() {
      this.form = {
        employee: '',
        username: '',
        permission: '',
        password: '',
        confirmPassword: '',
      }
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="row">
      <div class="col-md-7">
        <div class="card">
          <div class="card-body">
            <form method="post" @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="employee">
                      Nhân viên
                      <span class="text-danger">*</span>
                    </label>
                    <multiselect
                      id="employee"
                      v-model="form.employee"
                      name="employee"
                      label="selectTitle"
                      track-by="PK_iNhanvienID"
                      placeholder="Chọn nhân viên"
                      :show-labels="false"
                      :class="{
                        'is-invalid': submitted && $v.form.employee.$error,
                      }"
                      :options="listStaff"
                    ></multiselect>
                    <div
                      v-if="submitted && !$v.form.employee.required"
                      class="invalid-feedback"
                      >Vui lòng chọn nhân viên.</div
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="username">
                      Tên đăng nhập
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      id="username"
                      v-model="form.username"
                      name="username"
                      class="form-control"
                      autocomplete="off"
                      :class="{
                        'is-invalid': submitted && $v.form.username.$error,
                      }"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                    />
                    <div
                      v-if="submitted && !$v.form.username.required"
                      class="invalid-feedback"
                      >Vui lòng nhập tên đăng nhập.</div
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="permission">
                      Quyền tài khoản
                      <span class="text-danger">*</span>
                    </label>
                    <multiselect
                      id="permission"
                      v-model="form.permission"
                      name="permission"
                      label="sTenQuyen"
                      track-by="PK_iQuyenID"
                      placeholder="Chọn quyền"
                      :show-labels="false"
                      :class="{
                        'is-invalid': submitted && $v.form.permission.$error,
                      }"
                      :options="listPermission"
                    ></multiselect>
                    <div
                      v-if="submitted && !$v.form.permission.required"
                      class="invalid-feedback"
                      >Vui lòng chọn quyền cho tài khoản.</div
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="password">
                      Mật khẩu
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      id="password"
                      v-model="form.password"
                      type="password"
                      name="password"
                      class="form-control"
                      autocomplete="off"
                      :class="{
                        'is-invalid': submitted && $v.form.password.$error,
                      }"
                      placeholder="Mật khẩu"
                    />
                    <div
                      v-if="submitted && $v.form.password.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.password.required"
                        >Vui lòng nhập mật khẩu.</span
                      >
                      <span v-if="!$v.form.password.minLength"
                        >Mật khẩu cần có ít nhất 6 ký tự.</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="passWord2">
                      Xác nhận mật khẩu
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      id="passWord2"
                      v-model="form.confirmPassword"
                      type="password"
                      name="confirmPassword"
                      class="form-control"
                      autocomplete="off"
                      :class="{
                        'is-invalid':
                          submitted && $v.form.confirmPassword.$error,
                      }"
                      placeholder="Xác nhận mật khẩu"
                    />
                    <div
                      v-if="submitted && $v.form.confirmPassword.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.confirmPassword.required"
                        >Vui lòng nhập lại mật khẩu.</span
                      >
                      <span v-else-if="!$v.form.confirmPassword.sameAsPassword"
                        >Mật khẩu không khớp.</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group text-center m-b-0">
                    <button
                      class="btn btn-primary"
                      name="action"
                      value="cap-tai-khoan"
                      type="submit"
                    >
                      <i class="uil uil-plus"></i> Cấp tài khoản</button
                    >
                    <button
                      type="reset"
                      class="btn btn-secondary m-l-5 ml-1"
                      @click="handleResetForm"
                    >
                      <i class="uil uil-multiply"></i> Hủy</button
                    >
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-5">
        <div class="row">
          <div v-for="item of statProgress" :key="item.title" class="col-md-12">
            <StatProgress
              class="account-report"
              :title="item.title"
              :value="item.value"
              :progress="item.progress"
              :text="item.text"
              :color="item.color"
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="stylus" scoped>
.account-report {
  padding-bottom: 21.5px;
}
</style>