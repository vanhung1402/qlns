<script>
import btnTooltip from '@components/button-tooltip'
import { dateFilter } from 'vue-date-fns'

export default {
  components: { btnTooltip },
  filters: {
    date: dateFilter,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    profile: {
      type: Object,
      default: () => {
        return {}
      },
    },
    viewCall: {
      type: String,
      default: '',
    },
    candidateEvaluates: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      form: {
        candidateEvaluate: {
          _id: 0,
          sTenTrangthaiHosoTuyendung: 'Chưa đánh giá',
        },
        resultCandidateEvaluate: '',
      },
    }
  },
  created() {
    if (
      this.profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID > 3
    ) {
      this.form.candidateEvaluate = this.profile.FK_iTrangthaiHosoTuyendungID
    }
  },
  methods: {
    handleBtnEditProfileClick(data) {
      this.$emit('handleBtnEditProfile', data)
    },
    handleBtnProfileInfoClick(data) {
      let routeData = this.$router.resolve({
        name: 'ProfileRecruitment',
        params: { profileId: data._id },
      })
      window.open(routeData.href, '_blank')
    },
    handleBtnRemoveProfileClick(data) {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Nếu xóa, hồ sơ này sẽ không thể khôi phục!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Đúng, xóa ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$emit('handleBtnRemoveProfile', data._id)
          }
        })
    },
    onClickApprovedProfile(data) {
      this.$emit('handleBtnChangeStatusProfile', { id: data._id, status: 2 })
    },
    onClickReturnProfile(data) {
      this.$emit('handleBtnChangeStatusProfile', { id: data._id, status: 3 })
    },
    onClickChangeCandidateEvaluate() {
      this.$emit('handleChangeEvaluateProfile', this.profile)
    },
  },
}
</script>

<template>
  <tr>
    <td class="text-center">{{ index }}</td>
    <td>{{ profile.sHotenUngvien }}</td>
    <td class="text-center">{{
      new Date(profile.dNgaysinhUngvien) | date('dd/MM/yyyy')
    }}</td>
    <td class="text-center">{{ profile.bGioitinhUngvien ? 'Nam' : 'Nữ' }}</td>
    <td>
      {{
        profile.FK_iChitietKehoachTuyendungID.FK_iVitriCongviecID
          .sTenVitriCongviec
      }}
      -
      {{
        profile.FK_iChitietKehoachTuyendungID.FK_iKehoachTuyendungID
          .sTieudeKehoach
      }}
    </td>
    <td v-if="viewCall === 'themhoso'" class="text-center">
      <span>
        <b-badge
          v-if="
            profile.FK_iTrangthaiHosoTuyendungID
              .PK_iTrangthaiHosoTuyendungID === 1
          "
          class="badge-soft-info ml-1"
          >{{
            profile.FK_iTrangthaiHosoTuyendungID.sTenTrangthaiHosoTuyendung
          }}</b-badge
        >
        <b-badge
          v-if="
            profile.FK_iTrangthaiHosoTuyendungID
              .PK_iTrangthaiHosoTuyendungID === 2
          "
          class="badge-soft-success ml-1"
          >{{
            profile.FK_iTrangthaiHosoTuyendungID.sTenTrangthaiHosoTuyendung
          }}</b-badge
        >
        <b-badge
          v-if="
            profile.FK_iTrangthaiHosoTuyendungID
              .PK_iTrangthaiHosoTuyendungID === 3
          "
          class="badge-soft-warning ml-1"
          >{{
            profile.FK_iTrangthaiHosoTuyendungID.sTenTrangthaiHosoTuyendung
          }}</b-badge
        >
      </span>
    </td>
    <td v-if="viewCall === 'danhgia'">
      <span>
        <b-badge
          v-if="
            profile.FK_iTrangthaiHosoTuyendungID
              .PK_iTrangthaiHosoTuyendungID === 4
          "
          class="badge-soft-success ml-1"
          >{{
            profile.FK_iTrangthaiHosoTuyendungID.sTenTrangthaiHosoTuyendung
          }}: {{ profile.sDanhgiaHoso }}</b-badge
        >
        <b-badge
          v-if="
            profile.FK_iTrangthaiHosoTuyendungID
              .PK_iTrangthaiHosoTuyendungID === 5
          "
          class="badge-soft-danger ml-1"
          >{{
            profile.FK_iTrangthaiHosoTuyendungID.sTenTrangthaiHosoTuyendung
          }}: {{ profile.sDanhgiaHoso }}</b-badge
        >
      </span>
    </td>
    <td class="text-right btn-action">
      <btnTooltip
        v-if="
          viewCall === 'themhoso' &&
          profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID ===
            1
        "
        :btn-id="'btn-profile-check-' + index"
        :btn-type="'success'"
        :btn-data="profile"
        :btn-tooltip-text="'Duyệt hồ sơ'"
        :btn-icon="'uil-check'"
        @onBtnClick="onClickApprovedProfile"
      />
      <btnTooltip
        v-if="
          viewCall === 'themhoso' &&
          profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID ===
            1
        "
        :btn-id="'btn-profile-uncheck-' + index"
        :btn-type="'warning'"
        :btn-data="profile"
        :btn-tooltip-text="'Loại hồ sơ'"
        :btn-icon="'uil-times'"
        @onBtnClick="onClickReturnProfile"
      />
      <btnTooltip
        v-if="
          viewCall === 'danhgia' &&
          profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID ===
            2
        "
        :btn-id="'btn-evaluate-profile-' + index"
        :btn-type="'success'"
        :btn-data="profile"
        :btn-tooltip-text="'Đánh giá hồ sơ'"
        :btn-icon="'uil-check-circle'"
        @onBtnClick="onClickChangeCandidateEvaluate"
      />
      <btnTooltip
        :btn-id="'btn-profile-info-' + index"
        :btn-type="'primary'"
        :btn-data="profile"
        :btn-tooltip-text="'Chi tiết hồ sơ'"
        :btn-icon="'uil-info-circle'"
        @onBtnClick="handleBtnProfileInfoClick"
      />
      <btnTooltip
        v-if="
          viewCall === 'themhoso' &&
          profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID ===
            1
        "
        :btn-id="'btn-edit-profile-' + index"
        :btn-type="'info'"
        :btn-data="profile"
        :btn-tooltip-text="'Cập nhật hồ sơ'"
        :btn-icon="'uil uil-edit'"
        @onBtnClick="handleBtnEditProfileClick"
      />
      <btnTooltip
        v-if="
          viewCall === 'themhoso' &&
          (profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID ===
            3 ||
            profile.FK_iTrangthaiHosoTuyendungID
              .PK_iTrangthaiHosoTuyendungID === 1)
        "
        :btn-id="'btn-remove-profile-' + index"
        :btn-type="'danger'"
        :btn-data="profile"
        :btn-tooltip-text="'Xóa hồ sơ'"
        :btn-icon="'uil uil-trash'"
        @onBtnClick="handleBtnRemoveProfileClick"
      />
    </td>
  </tr>
</template>

<style scoped>
.table tr td {
  vertical-align: middle;
}
td.btn-action {
  min-width: 120px;
}
</style>