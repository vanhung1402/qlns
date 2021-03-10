<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  page: {
    title: 'Đổi mật khẩu',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: 'Đổi mật khẩu',
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
          text: 'Đổi mật khẩu',
          active: true,
        },
      ],
      icon: 'keyhole-circle',
      submitChangePassword: false,
      formChangePassword: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      currentUsername: this.$store.state.auth.currentUser.username,
    }
  },
  methods: {
    async changePassword() {
      const promise = await axios
        .post('/api/he-thong/authenticate', {
          username: this.currentUsername,
          password: this.formChangePassword.currentPassword,
        })
        .catch((err) => {
          console.error(err)
        })

      if (promise.data) {
        axios
          .put('/api/he-thong/doi-mat-khau/' + promise.data.id, {
            newPassword: this.formChangePassword.newPassword,
          })
          .then((res) => {
            if (res.statusText === 'OK') {
              this.$toastr.success(
                'Đổi mật khẩu khoản thành công.',
                'Thành công'
              )
            } else {
              this.$toastr.error(
                'Đã có lỗi xảy ra khi đổi mật khẩu.',
                'Thất bại'
              )
            }
          })
          .catch((err) => {
            console.error('Error: ', err)
            this.$toastr.error('Đã có lỗi xảy ra khi đổi mật khẩu.', 'Thất bại')
          })
          this.handleResetFormChangePassword()
      } else {
        this.$toastr.error(
          'Mật khẩu hiện tại không đúng, vui lòng kiểm tra lại',
          'Thất bại'
        )
      }
    },
    handleChangePasswordSubmit(e) {
      this.submitChangePassword = true
      this.$v.formChangePassword.$touch()
      if (
        this.$v.formChangePassword.$pending ||
        this.$v.formChangePassword.$error
      )
        return false

      this.changePassword()
    },
    handleResetFormChangePassword() {
      this.isShowChangePermissionModal = false
      this.formChangePassword = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    },
  },
  validations: {
    formChangePassword: {
      currentPassword: { required, minLength: minLength(6) },
      newPassword: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('newPassword') },
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="card">
      <div class="card-body">
        <form method="post" @submit.prevent="handleChangePasswordSubmit">
          <div class="row">
            <div class="col-md-4">
              <div class="form-group">
                <label id="currentPassword">
                  Mật khẩu hiện tại
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="currentPassword"
                  v-model="formChangePassword.currentPassword"
                  type="password"
                  name="currentPassword"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitChangePassword &&
                      $v.formChangePassword.currentPassword.$error,
                  }"
                  placeholder="Mật khẩu hiện tại..."
                />
                <div
                  v-if="
                    submitChangePassword &&
                    $v.formChangePassword.currentPassword.$error
                  "
                  class="invalid-feedback"
                >
                  <span v-if="!$v.formChangePassword.currentPassword.required"
                    >Vui lòng nhập mật khẩu hiện tại.</span
                  >
                  <span v-if="!$v.formChangePassword.currentPassword.minLength"
                    >Mật khẩu hiện tại cần có ít nhất 6 ký tự.</span
                  >
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label id="newPassword">
                  Mật khẩu mới
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="newPassword"
                  v-model="formChangePassword.newPassword"
                  type="password"
                  name="newPassword"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitChangePassword &&
                      $v.formChangePassword.newPassword.$error,
                  }"
                  placeholder="Mật khẩu mới..."
                />
                <div
                  v-if="
                    submitChangePassword &&
                    $v.formChangePassword.newPassword.$error
                  "
                  class="invalid-feedback"
                >
                  <span v-if="!$v.formChangePassword.newPassword.required"
                    >Vui lòng nhập mật khẩu mới.</span
                  >
                  <span v-if="!$v.formChangePassword.newPassword.minLength"
                    >Mật khẩu mới cần có ít nhất 6 ký tự.</span
                  >
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="form-group">
                <label id="confirmPassword">
                  Xác nhận mật khẩu
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="confirmPassword"
                  v-model="formChangePassword.confirmPassword"
                  type="password"
                  name="confirmPassword"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitChangePassword &&
                      $v.formChangePassword.confirmPassword.$error,
                  }"
                  placeholder="Nhập lại mật khẩu mới..."
                />
                <div
                  v-if="
                    submitChangePassword &&
                    $v.formChangePassword.confirmPassword.$error
                  "
                  class="invalid-feedback"
                >
                  <span v-if="!$v.formChangePassword.confirmPassword.required"
                    >Vui lòng nhập lại mật khẩu.</span
                  >
                  <span
                    v-else-if="
                      !$v.formChangePassword.confirmPassword.sameAsPassword
                    "
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
                  <i class="uil uil-check"></i> Xác nhận</button
                >
                <button
                  type="reset"
                  class="btn btn-secondary m-l-5 ml-1"
                  @click="handleResetFormChangePassword"
                >
                  <i class="uil uil-multiply"></i> Hủy</button
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>
