<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Multiselect from 'vue-multiselect'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

import AccountCell from '@components/account-cell'

export default {
  page: {
    title: 'Cập nhật tài khoản',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, AccountCell, Multiselect },
  data() {
    return {
      title: 'Cập nhật tài khoản',
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
          text: 'Cập nhật tài khoản',
          active: true,
        },
      ],
      icon: 'user-check',
      listAccount: [],
      isShowChangePasswordModal: false,
      isShowChangePermissionModal: false,
      accountChange: {},
      formChangePassword: {
        password: '',
        confirmPassword: '',
      },
      formChangePermission: {
        permission: '',
      },
      submitChangePassword: false,
      submitChangePermission: false,
      listPermission: [],
    }
  },
  created() {
    this.loadListAccount()
    this.loadListPermission()
  },
  methods: {
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
    loadListAccount() {
      this.$recruitment
        .get('/api/he-thong/list-account')
        .then((res) => {
          this.listAccount = res.data
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    openChangePasswordModal(account) {
      this.accountChange = account
      this.isShowChangePasswordModal = true
    },
    openChangePermissionModal(account) {
      this.accountChange = account
      this.formChangePermission.permission = account.FK_iQuyenID
      this.isShowChangePermissionModal = true
    },
    handleChangePasswordSubmit(e) {
      this.submitChangePassword = true
      this.$v.formChangePassword.$touch()
      if (
        this.$v.formChangePassword.$pending ||
        this.$v.formChangePassword.$error
      )
        return false
      this.$recruitment
        .put('/api/he-thong/doi-mat-khau/' + this.accountChange.PK_iTaikhoanID, {
          newPassword: this.formChangePassword.password,
        })
        .then((res) => {
          if (res.statusText === 'OK') {
            this.$toastr.success('Đổi mật khẩu khoản thành công.', 'Thành công')
          } else {
            this.$toastr.error('Đã có lỗi xảy ra khi đổi mật khẩu.', 'Thất bại')
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
          this.$toastr.error('Đã có lỗi xảy ra khi đổi mật khẩu.', 'Thất bại')
        })

      this.isShowChangePasswordModal = false
    },
    handleChangePermissionSubmit(e) {
      this.submitChangePassword = true
      this.$v.formChangePermission.$touch()
      if (
        this.$v.formChangePermission.$pending ||
        this.$v.formChangePermission.$error
      )
        return false
      this.$recruitment
        .put('/api/he-thong/doi-quyen-tai-khoan/' + this.accountChange._id, {
          newPermission: this.formChangePermission.permission,
        })
        .then((res) => {
          if (res.statusText === 'OK') {
            this.$toastr.success('Đổi quyền khoản thành công.', 'Thành công')

            this.accountChange.FK_iQuyenID = this.formChangePermission.permission
            let newListAccount = this.listAccount.map((account) => {
              return account._id === this.accountChange._id
                ? this.accountChange
                : account
            })

            this.listAccount = newListAccount
            this.isShowChangePermissionModal = false
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi đổi quyền tài khoản.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
          this.$toastr.error(
            'Đã có lỗi xảy ra khi đổi quyền tài khoản.',
            'Thất bại'
          )
        })
    },
    handleChangeAccountStatus(acc, status){
      this.$recruitment
        .put('/api/he-thong/doi-trang-thai-tai-khoan/' + acc._id, {
          newStatus: status,
        })
        .then((res) => {
          if (res.statusText === 'OK') {
            this.$toastr.success('Đổi trạng thái khoản thành công.', 'Thành công')
            this.loadListAccount()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi đổi trạng thái tài khoản.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
          this.$toastr.error('Đã có lỗi xảy ra khi thay đổi tài khoản.', 'Thất bại')
        })

    },
    handleResetFormChangePassword() {
      this.isShowChangePasswordModal = false
      this.formChangePassword = {
        password: '',
        confirmPassword: '',
      }
    },
    handleResetFormChangePermission() {
      this.isShowChangePermissionModal = false
      this.formChangePassword = {
        permission: '',
      }
    },
  },
  validations: {
    formChangePassword: {
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') },
    },
    formChangePermission: {
      permission: { required },
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table m-0">
            <thead>
              <tr>
                <th class="text-center">STT</th>
                <th>Tên đăng nhập</th>
                <th>Nhân viên</th>
                <th>Quyền tài khoản</th>
                <th>Trạng thái tài khoản</th>
                <th class="text-center">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              <AccountCell
                v-for="(acc, index) in listAccount"
                :key="acc.PK_iNhanvienID"
                :account="acc"
                :index="index + 1"
                @onClickBtnChangePassword="openChangePasswordModal"
                @onClickBtnChangePermission="openChangePermissionModal"
                @onClickBtnChangeAccountStatus="handleChangeAccountStatus"
              />
            </tbody>
          </table>
        </div>
        <b-modal
          id="modal-change-password"
          v-model="isShowChangePasswordModal"
          centered
          title-class="font-18"
          hide-footer
          :title="`Đổi mật khẩu cho tài khoản: ${
            accountChange.FK_iNhanvienID
              ? accountChange.FK_iNhanvienID.sHoten
              : ''
          }`"
          @close="handleResetFormChangePassword"
        >
          <form method="post" @submit.prevent="handleChangePasswordSubmit">
            <div class="form-group">
              <label id="password">
                Mật khẩu
                <span class="text-danger">*</span>
              </label>
              <input
                id="password"
                v-model="formChangePassword.password"
                type="password"
                name="password"
                class="form-control"
                autocomplete="off"
                :class="{
                  'is-invalid':
                    submitChangePassword &&
                    $v.formChangePassword.password.$error,
                }"
                placeholder="Mật khẩu"
              />
              <div
                v-if="
                  submitChangePassword && $v.formChangePassword.password.$error
                "
                class="invalid-feedback"
              >
                <span v-if="!$v.formChangePassword.password.required"
                  >Vui lòng nhập mật khẩu.</span
                >
                <span v-if="!$v.formChangePassword.password.minLength"
                  >Mật khẩu cần có ít nhất 6 ký tự.</span
                >
              </div>
            </div>
            <div class="form-group">
              <label for="passWord2">
                Xác nhận mật khẩu
                <span class="text-danger">*</span>
              </label>
              <input
                id="passWord2"
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
                placeholder="Xác nhận mật khẩu"
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
            <div class="form-group text-center m-b-0">
              <button
                class="btn btn-primary"
                name="action"
                value="doi-mat-khau"
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
          </form>
        </b-modal>
        <b-modal
          id="modal-change-permisson"
          v-model="isShowChangePermissionModal"
          centered
          title-class="font-18"
          hide-footer
          :title="`Đổi quyền cho tài khoản: ${
            accountChange.FK_iNhanvienID
              ? accountChange.FK_iNhanvienID.sHoten
              : ''
          }`"
          @close="handleResetFormChangePermission"
        >
          <form method="post" @submit.prevent="handleChangePermissionSubmit">
            <div class="form-group">
              <label for="permission">
                Quyền tài khoản
                <span class="text-danger">*</span>
              </label>
              <multiselect
                id="permission"
                v-model="formChangePermission.permission"
                name="permission"
                label="sTenQuyen"
                track-by="PK_iQuyenID"
                placeholder="Chọn quyền"
                :show-labels="false"
                :class="{
                  'is-invalid':
                    submitChangePermission &&
                    $v.formChangePermission.permission.$error,
                }"
                :options="listPermission"
                :value="'2'"
              ></multiselect>
              <div
                v-if="
                  submitChangePermission &&
                  !$v.formChangePermission.permission.required
                "
                class="invalid-feedback"
                >Vui lòng chọn quyền cho tài khoản.</div
              >
            </div>
            <div class="form-group text-center m-b-0">
              <button
                class="btn btn-primary"
                name="action"
                value="cap-nhap-quyen"
                type="submit"
              >
                <i class="uil uil-check"></i> Xác nhận</button
              >
              <button
                type="reset"
                class="btn btn-secondary m-l-5 ml-1"
                @click="handleResetFormChangePermission"
              >
                <i class="uil uil-multiply"></i> Hủy</button
              >
            </div>
          </form>
        </b-modal>
      </div>
    </div>
  </Layout>
</template>