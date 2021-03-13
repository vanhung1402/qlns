<script>
import btnTooltip from '@components/button-tooltip'

export default {
  components: {
    btnTooltip,
  },
  props: {
    listDecision: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    onClickApprovedDecision(decision) {
      this.$swal({
        title: 'Bạn có chắc chắn muốn duyệt?',
        text: 'Quyết định tuyển dụng này sẽ được phê duyệt',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý, duyệt ngay!',
        cancelButtonText: 'Bỏ qua',
      }).then((result) => {
        if (result.isConfirmed && decision._id) {
          this.handleChangeDecisionStatus(decision._id, 2)
        }
      })
    },
    onClickReapprovedDecision(decision) {
      this.$swal({
        title: 'Bạn có chắc chắn muốn gửi lại để duyệt?',
        text: 'Quyết định tuyển dụng này sẽ được chờ phê duyệt',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý, chuyển ngay!',
        cancelButtonText: 'Bỏ qua',
      }).then((result) => {
        if (result.isConfirmed && decision._id) {
          this.handleChangeDecisionStatus(decision._id, 1)
        }
      })
    },
    async onClickRemoveDecision(decision){
      const btnRemoveDecision = await this.$swal.fire({
        input: 'textarea',
        inputLabel: 'Lý do hủy',
        inputPlaceholder: 'Nhập lý do hủy quyết định...',
        inputAttributes: {
          'aria-label': 'Nhập lý do hủy quyết định',
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Hủy',
        cancelButtonText: 'Giữ lại!',
      })

      if (btnRemoveDecision.isConfirmed) {
        if (btnRemoveDecision.value) {
          this.handleChangeDecisionStatus(
            decision._id,
            4,
            btnRemoveDecision.value
          )
        } else {
          this.$toastr.warning(
            'Chưa nhập lý do hủy quyết định tuyển dụng.',
            'Cảnh báo'
          )
        }
      }
    },
    async onClickReturnDecision(decision) {
      const btnReturnDecision = await this.$swal.fire({
        input: 'textarea',
        inputLabel: 'Lý do gửi trả',
        inputPlaceholder: 'Nhập lý do gửi trả quyết định...',
        inputAttributes: {
          'aria-label': 'Nhập lý do gửi trả quyết định',
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Gửi trả',
        cancelButtonText: 'Hủy!',
      })

      if (btnReturnDecision.isConfirmed) {
        if (btnReturnDecision.value) {
          this.handleChangeDecisionStatus(
            decision._id,
            3,
            btnReturnDecision.value
          )
        } else {
          this.$toastr.warning(
            'Chưa nhập lý do gửi trả quyết định tuyển dụng.',
            'Cảnh báo'
          )
        }
      }
    },
    handleChangeDecisionStatus(decisionUpdateId, status, reason = null) {
      this.$recruitment
        .put('/api/tuyen-dung/recruitment-decisions', {
          updateBy: this.$store.state.auth.currentUser.staff,
          decisionUpdateId,
          status,
          action: 'updateStatus',
          reason,
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$toastr.success(
              'Đã cập nhật trạng thái quyết định tuyển dụng.',
              'Thành công'
            )
            this.$emit('handleUpdateDecision')
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cập nhật trạng thái quyết định tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error(
            'Không thể cập nhật trạng thái quyết định tuyển dụng.',
            'Thất bại'
          )
        })
    },
    onClickEditDecision(decision) {
      this.$emit('onClickEditDecision', decision)
    },
    onBtnDecisionInfoClick(decision) {
      let routeData = this.$router.resolve({
        name: 'DecisionRecruitment',
        params: { decisionId: decision._id },
      })
      console.log(routeData)
      window.open(routeData.href, '_blank')
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title text-center text-uppercase"
        >Danh sách quyết định tuyển dụng</h4
      >
      <table class="table table-border">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ứng viên</th>
            <th>Vị trí tuyển dụng</th>
            <th>Người lập/Ngày lập</th>
            <th>Trạng thái</th>
            <th class="text-right">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(decision, index) in listDecision" :key="index">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ decision.FK_iHosoTuyendungID.sHotenUngvien }}</td>
            <td
              >{{
                decision.FK_iHosoTuyendungID.FK_iChitietKehoachTuyendungID
                  .FK_iVitriCongviecID.sTenVitriCongviec
              }}
              -
              {{
                decision.FK_iHosoTuyendungID.FK_iChitietKehoachTuyendungID
                  .FK_iKehoachTuyendungID.sTieudeKehoach
              }}</td
            >
            <td
              ><div>{{ decision.FK_iNguoiLapQuyetdinhTuyendungID.sHoten }}</div
              ><small>{{
                decision.txtThoigianLapQuyetdinhTuyendung
              }}</small></td
            >
            <td>
              <span>
                <b-badge
                  v-if="
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .PK_iTrangthaiQuyetdinhTuyendungID === 1
                  "
                  class="badge-soft-info ml-1"
                  >{{
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .sTenTrangThaiQuyetDinhTuyenDung
                  }}</b-badge
                >
                <b-badge
                  v-if="
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .PK_iTrangthaiQuyetdinhTuyendungID === 2
                  "
                  class="badge-soft-success ml-1"
                  >{{
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .sTenTrangThaiQuyetDinhTuyenDung
                  }}</b-badge
                >
                <b-badge
                  v-if="
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .PK_iTrangthaiQuyetdinhTuyendungID === 3
                  "
                  class="badge-soft-warning ml-1"
                  >{{
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .sTenTrangThaiQuyetDinhTuyenDung
                  }}: {{
                    decision.sLydo
                  }}</b-badge
                >
                <b-badge
                  v-if="
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .PK_iTrangthaiQuyetdinhTuyendungID === 4
                  "
                  class="badge-soft-danger ml-1"
                  >{{
                    decision.FK_iTrangthaiQuyetdinhTuyendungID
                      .sTenTrangThaiQuyetDinhTuyenDung
                  }}: {{
                    decision.sLydo
                  }}</b-badge
                >
              </span>
            </td>
            <td class="text-right">
              <btnTooltip
                v-if="
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 1 ||
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 3
                "
                :btn-id="'btn-decision-edit-' + index"
                :btn-type="'info'"
                :btn-data="decision"
                :btn-tooltip-text="'Sửa quyết định'"
                :btn-icon="'uil-edit'"
                @onBtnClick="onClickEditDecision"
              />
              <btnTooltip
                v-if="
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 1
                "
                :btn-id="'btn-decision-check-' + index"
                :btn-type="'success'"
                :btn-data="decision"
                :btn-tooltip-text="'Duyệt quyết định'"
                :btn-icon="'uil-check'"
                @onBtnClick="onClickApprovedDecision"
              />
              <btnTooltip
                v-if="
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 3
                "
                :btn-id="'btn-decision-reapproved-' + index"
                :btn-type="'warning'"
                :btn-data="decision"
                :btn-tooltip-text="'Gửi lại quyết định'"
                :btn-icon="'uil-arrow-to-right'"
                @onBtnClick="onClickReapprovedDecision"
              />
              <btnTooltip
                v-if="
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 1
                "
                :btn-id="'btn-decision-return-' + index"
                :btn-type="'warning'"
                :btn-data="decision"
                :btn-tooltip-text="'Gửi trả quyết định'"
                :btn-icon="'uil-left-arrow-to-left'"
                @onBtnClick="onClickReturnDecision"
              />
              <btnTooltip
                v-if="
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 1 || 
                  decision.FK_iTrangthaiQuyetdinhTuyendungID
                    .PK_iTrangthaiQuyetdinhTuyendungID === 3
                "
                :btn-id="'btn-decision-remove-' + index"
                :btn-type="'danger'"
                :btn-data="decision"
                :btn-tooltip-text="'Hủy quyết định'"
                :btn-icon="'uil-bolt-slash'"
                @onBtnClick="onClickRemoveDecision"
              />
              <btnTooltip
                :btn-id="'btn-info-decision-' + index"
                :btn-type="'primary'"
                :btn-data="decision"
                :btn-tooltip-text="'Chi tiết quyết định'"
                :btn-icon="'uil-info-circle'"
                @onBtnClick="onBtnDecisionInfoClick"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
thead th {
  vertical-align: middle;
  text-align: center;
}

tbody td {
  vertical-align: middle;
}
</style>