<script>
import btnTooltip from '@components/button-tooltip'
import aTooltip from '@components/a-tooltip'
import moment from 'moment'

export default {
  components: { btnTooltip, aTooltip },
  filters: {
    momentVNDate: function (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    momentENDate: function (date) {
      return moment(date).format('YYYY/MM/DD')
    },
  },
  props: {
    staffWorkFlowList: {
      type: Array,
      default: () => [],
    },
    isShowBtnAdd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mapBadgeType: {
        1: 'info',
        2: 'success',
        3: 'danger',
      },
    }
  },
  created() {},
  methods: {
    onClickleBtnChangeStatusWorkFlowAssignment(phanCongId, trangThaiId) {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Chuyển trạng thái công việc',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Đúng, chuyển ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.handleChangeStatusWorkFlowAssignment(phanCongId, trangThaiId)
          }
        })
    },
    handleChangeStatusWorkFlowAssignment(phanCongId, trangThaiId) {
      this.$workflow
        .post('/cong-viec?action=thay-doi-trang-thai-phan-cong-cong-viec', {
          phanCongId,
          trangThaiId,
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$emit('handleChangeStatusWorkFlowAssignment')
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4 class="text-center text-uppercase">Danh sách công việc</h4>
      <hr />
      <div class="table-responsive">
        <table class="table table-border">
          <thead>
            <tr>
              <th>STT</th>
              <th>Công việc</th>
              <th>Phân công</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Đánh giá</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(workFlowAssignment, index) in staffWorkFlowList"
              :key="index"
            >
              <td>{{ index + 1 }}</td>
              <td
                >{{ workFlowAssignment.sTenCongviec
                }}<span
                  v-if="
                    Number(workFlowAssignment.PK_iTrangthaiCongviecID) === 3
                  "
                  :class="
                    'badge badge-soft-' +
                    mapBadgeType[workFlowAssignment.PK_iTrangthaiCongviecID]
                  "
                  >{{ workFlowAssignment.sTenTrangthaiCongviec }}</span
                ></td
              >
              <td
                >{{ workFlowAssignment.sMaNhanvien }} |
                {{ workFlowAssignment.sHoten }}</td
              >
              <td>{{ workFlowAssignment.sTenTrangthaiPhancongCongviec }}</td>
              <td>
                <small v-if="workFlowAssignment.dNgayBatdauCongviec">{{
                  new Date(workFlowAssignment.dNgayBatdauCongviec)
                    | momentVNDate
                }}</small>
                <small
                  v-if="
                    workFlowAssignment.dNgayKethucCongviec &&
                    workFlowAssignment.dNgayKethucCongviec !==
                      workFlowAssignment.dNgayBatdauCongviec
                  "
                  ><br v-if="workFlowAssignment.dNgayBatdauCongviec" />{{
                    new Date(workFlowAssignment.dNgayKethucCongviec)
                      | momentVNDate
                  }}</small
                ></td
              >
              <td>{{ workFlowAssignment.sTenDanhgiaCongviec }}</td>
              <td class="text-right">
                <btnTooltip
                  v-if="
                    [1, 3].includes(
                      Number(workFlowAssignment.FK_iTrangthaiPhancongCongviecID)
                    )
                  "
                  :btn-id="'btn-change-status-work-assignment-2-' + index"
                  :btn-type="'primary'"
                  :btn-tooltip-text="'Bắt đầu công việc'"
                  :btn-icon="'uil uil-play-circle'"
                  @onBtnClick="
                    onClickleBtnChangeStatusWorkFlowAssignment(
                      workFlowAssignment.PK_iPhancongCongviecID,
                      2
                    )
                  "
                />
                <btnTooltip
                  v-if="
                    [2].includes(
                      Number(workFlowAssignment.FK_iTrangthaiPhancongCongviecID)
                    )
                  "
                  :btn-id="'btn-change-status-work-assignment-3-' + index"
                  :btn-type="'warning'"
                  :btn-tooltip-text="'Tạm dừng công việc'"
                  :btn-icon="'uil uil-pause-circle'"
                  @onBtnClick="
                    onClickleBtnChangeStatusWorkFlowAssignment(
                      workFlowAssignment.PK_iPhancongCongviecID,
                      3
                    )
                  "
                />
                <btnTooltip
                  v-if="
                    [2, 3].includes(
                      Number(workFlowAssignment.FK_iTrangthaiPhancongCongviecID)
                    )
                  "
                  :btn-id="'btn-change-status-work-assignment-5-' + index"
                  :btn-type="'success'"
                  :btn-tooltip-text="'Hoàn thành công việc'"
                  :btn-icon="'uil uil-check-circle'"
                  @onBtnClick="
                    onClickleBtnChangeStatusWorkFlowAssignment(
                      workFlowAssignment.PK_iPhancongCongviecID,
                      5
                    )
                  "
                />
                <btnTooltip
                  v-if="
                    [1, 2, 3].includes(
                      Number(workFlowAssignment.FK_iTrangthaiPhancongCongviecID)
                    )
                  "
                  :btn-id="'btn-change-status-work-assignment-4-' + index"
                  :btn-type="'danger'"
                  :btn-tooltip-text="'Hủy công việc'"
                  :btn-icon="'uil uil-times-circle'"
                  @onBtnClick="
                    onClickleBtnChangeStatusWorkFlowAssignment(
                      workFlowAssignment.PK_iPhancongCongviecID,
                      4
                    )
                  "
                />
                <aTooltip
                  :href="'chi-tiet/' + workFlowAssignment.FK_iCongviecID"
                  :target="'_blank'"
                  :btn-id="'btn-work-flow-info-' + index"
                  :btn-type="'btn-info'"
                  :btn-tooltip-text="'Chi tiết công việc'"
                  :btn-icon="'uil uil-info-circle'"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
thead th {
  vertical-align: middle;
}
table.table tr td {
  vertical-align: middle;
}
td.btn-action {
  min-width: 120px;
}
</style>