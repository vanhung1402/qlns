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
    plan: {
      type: Object,
      default: () => {
        return {}
      },
    },
    viewcall: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      collapseAvailable: false,
      collapseMode: 1,
    }
  },
  created() {
    if (this.plan.sNoidungKehoach.replace(/<[^>]*>/g, '').length > 100) {
      this.collapseAvailable = true
    }
  },
  methods: {
    onClickApprovedPlan() {
      this.$emit('onClickApprovedPlan', this.plan._id)
    },
    onClickReturnPlan() {
      this.$emit('onClickReturnPlan', this.plan._id)
    },
    onClickEditPlan() {
      this.$emit('onClickEditPlan', this.plan._id)
    },
    onClickRemovePlan() {
      this.$emit('onClickRemovePlan', this.plan._id)
    },
    onClickResendPlan() {
      this.$emit('onClickResendPlan', this.plan._id)
    },
    getNoiDungKeHoach() {
      if (this.collapseAvailable && this.collapseMode) {
        return `${this.plan.sNoidungKehoach
          .replace(/<[^>]*>/g, '')
          .substring(0, 100)}... <span class="text-info">${
          this.collapseMode ? 'Xem thêm' : 'Ẩn bớt'
        }</span>`
      } else {
        return this.plan.sNoidungKehoach
      }
    },
    handleBtnPlanInfoClick() {
      let routeData = this.$router.resolve({
        name: 'RecruitmentPlanInfo',
        params: { planId: this.plan._id },
      })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>

<template>
  <tr>
    <td>{{ index }}</td>
    <td>{{ plan.sTieudeKehoach }}</td>
    <td
      ><div>{{ plan.FK_iNguoilapKehoachID.sHoten }}</div
      ><small>{{ plan.txtThoigianLap }}</small></td
    >
    <td>
      <span>
        <b-badge
          v-if="
            plan.FK_iTrangthaiKehoachTuyendungID
              .PK_iTrangthaiKehoachTuyendungID === 1
          "
          class="badge-soft-info ml-1"
          >{{
            plan.FK_iTrangthaiKehoachTuyendungID.sTenTrangthaiKehoachTuyendung
          }}</b-badge
        >
        <b-badge
          v-if="
            plan.FK_iTrangthaiKehoachTuyendungID
              .PK_iTrangthaiKehoachTuyendungID === 2
          "
          class="badge-soft-success ml-1"
          >{{
            plan.FK_iTrangthaiKehoachTuyendungID.sTenTrangthaiKehoachTuyendung
          }}</b-badge
        >
        <b-badge
          v-if="
            viewcall === 'lapkehoach' &&
            plan.FK_iTrangthaiKehoachTuyendungID
              .PK_iTrangthaiKehoachTuyendungID === 3
          "
          class="badge-soft-warning ml-1"
          >{{
            plan.FK_iTrangthaiKehoachTuyendungID.sTenTrangthaiKehoachTuyendung +
            ': ' +
            plan.sLydo
          }}</b-badge
        >
        <b-badge
          v-if="
            viewcall === 'lapkehoach' &&
            plan.FK_iTrangthaiKehoachTuyendungID
              .PK_iTrangthaiKehoachTuyendungID === 4
          "
          class="badge-soft-danger ml-1"
          >{{
            plan.FK_iTrangthaiKehoachTuyendungID.sTenTrangthaiKehoachTuyendung +
            ': ' +
            plan.sLydo
          }}</b-badge
        >
      </span>
    </td>
    <td class="btn-action text-right">
      <btnTooltip
        :btn-id="'btn-info-plan-' + index"
        :btn-type="'primary'"
        :btn-tooltip-text="'Chi tiết kế hoạch'"
        :btn-icon="'uil-info-circle'"
        @onBtnClick="handleBtnPlanInfoClick"
      />
      <btnTooltip
        v-if="
          viewcall === 'duyetkehoach' &&
          plan.FK_iTrangthaiKehoachTuyendungID
            .PK_iTrangthaiKehoachTuyendungID === 1
        "
        :btn-id="'btn-approved-plan-' + index"
        :btn-type="'success'"
        :btn-tooltip-text="'Duyệt kế hoạch'"
        :btn-icon="'uil uil-file-check'"
        @onBtnClick="onClickApprovedPlan"
      />
      <btnTooltip
        v-if="
          viewcall === 'duyetkehoach' &&
          plan.FK_iTrangthaiKehoachTuyendungID
            .PK_iTrangthaiKehoachTuyendungID === 1
        "
        :btn-id="'btn-return-plan-' + index"
        :btn-type="'warning'"
        :btn-tooltip-text="'Gửi trả kế hoạch'"
        :btn-icon="'uil uil-left-arrow-from-left'"
        @onBtnClick="onClickReturnPlan"
      />
      <btnTooltip
        v-if="
          viewcall === 'lapkehoach' &&
          (plan.FK_iTrangthaiKehoachTuyendungID
            .PK_iTrangthaiKehoachTuyendungID === 1 ||
            plan.FK_iTrangthaiKehoachTuyendungID
              .PK_iTrangthaiKehoachTuyendungID === 3)
        "
        :btn-id="'btn-edit-plan-' + index"
        :btn-type="'info'"
        :btn-tooltip-text="'Cập nhật kế hoạch'"
        :btn-icon="'uil uil-file-edit-alt'"
        @onBtnClick="onClickEditPlan"
      />
      <btnTooltip
        v-if="
          viewcall === 'lapkehoach' &&
          (plan.FK_iTrangthaiKehoachTuyendungID
            .PK_iTrangthaiKehoachTuyendungID === 1 ||
            plan.FK_iTrangthaiKehoachTuyendungID
              .PK_iTrangthaiKehoachTuyendungID === 3)
        "
        :btn-id="'btn-remove-plan-' + index"
        :btn-type="'danger'"
        :btn-tooltip-text="'Hủy kế hoạch'"
        :btn-icon="'uil uil-bolt-slash'"
        @onBtnClick="onClickRemovePlan"
      />
      <btnTooltip
        v-if="
          viewcall === 'lapkehoach' &&
          plan.FK_iTrangthaiKehoachTuyendungID
            .PK_iTrangthaiKehoachTuyendungID === 3
        "
        :btn-id="'btn-resend-plan-' + index"
        :btn-type="'warning'"
        :btn-tooltip-text="'Gửi lại kế hoạch'"
        :btn-icon="'uil uil-arrow-from-right'"
        @onBtnClick="onClickResendPlan"
      />
    </td>
  </tr>
</template>

<style lang="stylus" scoped>
.table tr td {
  vertical-align: middle;
}

td.btn-action {
  min-width: 120px;
}
</style>