<script>
import btnTooltip from '@components/button-tooltip'

export default {
  components: { btnTooltip },
  props: {
    account: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      acc: this.account,
    }
  },
  watch: {
    account: function(newAccount) {
      this.acc = newAccount
    }
  },
  methods: {
    onClickChangePassword(event) {
      this.$emit('onClickBtnChangePassword', this.acc)
    },
    onClickChangePermission(event) {
      this.$emit('onClickBtnChangePermission', this.acc)
    },
    onClickLockAccount() {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Tài khoản này sẽ bị khóa và không thể truy cập hệ thống!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Đúng, khóa ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$emit('onClickBtnChangeAccountStatus', this.acc, 2)
          }
        })
    },
    onClickUnlockAccount() {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Tài khoản này sẽ được mở và có thể truy cập hệ thống.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đúng, mở ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$emit('onClickBtnChangeAccountStatus', this.acc, 1)
          }
        })
    },
  },
}
</script>

<template>
  <tr>
    <td class="text-center">{{ index }}</td>
    <td>{{ acc.sTenTaikhoan }}</td>
    <td>{{ acc.FK_iNhanvienID.sHoten }}</td>
    <td>{{ acc.FK_iQuyenID.sTenQuyen }}</td>
    <td>
      <i
        v-if="acc.FK_iTrangthaiTaikhoan.PK_iTrangthaiTaikhoanID === 1"
        class="uil uil-minus-circle text-success"
      ></i>
      <i
        v-if="acc.FK_iTrangthaiTaikhoan.PK_iTrangthaiTaikhoanID === 2"
        class="uil uil-times-circle text-warning"
      ></i>
      {{ acc.FK_iTrangthaiTaikhoan.sTenTrangthaiTaikhoan }}
    </td>
    <td class="text-center">
      <btnTooltip
        v-if="acc.FK_iTrangthaiTaikhoan.PK_iTrangthaiTaikhoanID === 2"
        :btn-id="'btn-unlock-account-' + index"
        :btn-type="'success'"
        :btn-tooltip-text="'Mở khóa tài khoản'"
        :btn-icon="'uil uil-lock-open-alt'"
        @onBtnClick="onClickUnlockAccount"
      />
      <btnTooltip
        v-if="acc.FK_iTrangthaiTaikhoan.PK_iTrangthaiTaikhoanID === 1"
        :btn-id="'btn-lock-account-' + index"
        :btn-type="'warning'"
        :btn-tooltip-text="'Khóa tài khoản'"
        :btn-icon="'uil uil-lock-alt'"
        @onBtnClick="onClickLockAccount"
      />
      <btnTooltip
        :btn-id="'btn-change-password-' + index"
        :btn-type="'info'"
        :btn-tooltip-text="'Đổi mật khẩu'"
        :btn-icon="'uil uil-key-skeleton-alt'"
        @onBtnClick="onClickChangePassword"
      />
      <btnTooltip
        :btn-id="'btn-change-permission-' + index"
        :btn-type="'primary'"
        :btn-tooltip-text="'Đổi quyền cho tài khoản'"
        :btn-icon="'uil uil-cog'"
        @onBtnClick="onClickChangePermission"
      />
    </td>
  </tr>
</template>