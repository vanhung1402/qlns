<script>
import btnTooltip from '@components/button-tooltip'
// import aTooltip from '@components/a-tooltip'
import Multiselect from 'vue-multiselect'
import moment from 'moment'

export default {
  components: { btnTooltip, Multiselect },
  filters: {
    momentVNDate: function (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    momentENDate: function (date) {
      return moment(date).format('YYYY/MM/DD')
    },
  },
  props: {
    listWorkFlowAssignment: {
      type: Array,
      default: () => [],
    },
    isShowBtnAdd: {
      type: Boolean,
      default: false,
    },
    isShowActionGroup: {
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
      phanCongThem: [],
      listStaff: [],
      listDanhMucDanhGia: [],
    }
  },
  created() {
    this.loadListStaff()
    this.loadListDanhMucDanhGia()
  },
  methods: {
    loadListDanhMucDanhGia() {
      this.$workflow
        .get('/?action=danh-muc-danh-gia-cong-viec')
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.listDanhMucDanhGia = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    loadListStaff() {
      this.$workflow
        .get('/?action=danh-sach-nhan-vien')
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.listStaff = res.data
              .sort((a, b) => {
                if (a.sTen > b.sTen) {
                  return 1
                } else if (a.sTen < b.sTen) {
                  return -1
                } else {
                  return 0
                }
              })
              .map((staff) => {
                staff.sTieudeNhanvien = `${staff.sMaNhanvien} | ${staff.sHoten}`
                return staff
              })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getNewId() {
      return Date.now().toString() + Math.floor(Math.random() * 1000) + 1
    },
    getWorkAssignment(congViecId) {
      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      let workAssignment = this.phanCongThem.map((staff) => {
        let pc = {
          PK_iPhancongCongviecID: `${congViecId}${this.getNewId()}`,
          FK_iNhanvienID: staff._id,
          FK_iCongviecID: congViecId,
          FK_iNguoiPhancongID: this.$store.state.auth.currentUser.staff,
          tThoigianPhancong: now,
          FK_iTrangthaiPhancongCongviecID: 1,
        }
        return pc
      })
      return workAssignment
    },
    handleBtnAddWorkFlowAssignmentClick() {
      let workAssignment = this.getWorkAssignment(
        this.$router.currentRoute.params.workFlowId
      )
      console.log(workAssignment)
      if (workAssignment.length > 0) {
        this.$workflow
          .post('/cong-viec?action=them-phan-cong-cong-viec', {
            assignment: workAssignment,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$emit('loadListWorkFlowAssignment')
              this.handleResetForm()
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
    handleBtnRemoveWorkFlowAssignmentClick(data) {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Nhân viên này sẽ bị hủy khỏi phân công công việc',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Đúng, hủy ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.handleAddWorkFlowAssignment()
          }
        })
    },
    cancelWorkFlow(workFlowAssignmentId) {
      this.$workflow
        .post('/cong-viec?action=xoa-phan-cong-cong-viec', {
          id: workFlowAssignmentId,
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$emit('loadListWorkFlowAssignment')
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleResetForm() {
      this.phanCongThem = []
    },
    handleBtnCheckWorkFlowAssignmentClick(phanCongId, danhGiaId) {
      this.$workflow
        .post('/cong-viec?action=danh-gia-phan-cong-cong-viec', {
          phanCongId,
          danhGiaId,
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$emit('loadListWorkFlowAssignment')
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
      <h4 class="text-center text-uppercase">Tình trạng công việc</h4>
      <hr />
      <div class="table-responsive">
        <table class="table table-border">
          <thead>
            <tr>
              <th class="text-center">STT</th>
              <th>Phân công</th>
              <th>Trạng thái</th>
              <th>Bắt đầu/Kết thúc</th>
              <th>Đánh giá</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(workFlowAssignment, index) in listWorkFlowAssignment"
              :key="index"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                {{ workFlowAssignment.sMaNhanvien }} |
                {{ workFlowAssignment.sHoten }}
                <small class="thoi-gian-phan-cong"
                  >(lúc:
                  {{
                    new Date(workFlowAssignment.tThoigianPhancong)
                      | momentVNDate
                  }})</small
                >
              </td>
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
                >
              </td>
              <td>{{ workFlowAssignment.sTenDanhgiaCongviec }}</td>
              <td class="text-right">
                <div v-if="isShowActionGroup">
                  <b-dropdown
                    v-if="
                      Number(
                        workFlowAssignment.FK_iTrangthaiPhancongCongviecID
                      ) !== 4 && !workFlowAssignment.FK_iDanhgiaCongviecID
                    "
                    dropleft
                    variant="success btn-sm"
                    class="ml-1"
                  >
                    <template slot="button-content">
                      Đánh giá
                      <i class="uil uil-angle-down"></i>
                    </template>
                    <b-dropdown-item
                      v-for="(danhGia, id) in listDanhMucDanhGia"
                      :key="id"
                      @click="
                        handleBtnCheckWorkFlowAssignmentClick(
                          workFlowAssignment.PK_iPhancongCongviecID,
                          danhGia.PK_iDanhgiaCongviecID
                        )
                      "
                      >{{ danhGia.sTenDanhgiaCongviec }}</b-dropdown-item
                    >
                  </b-dropdown>
                  <btnTooltip
                    v-if="
                      Number(
                        workFlowAssignment.FK_iTrangthaiPhancongCongviecID
                      ) === 1 && !workFlowAssignment.FK_iDanhgiaCongviecID
                    "
                    :btn-id="'btn-work-flow-assignment-remove-' + index"
                    :btn-type="'danger'"
                    :btn-data="workFlowAssignment"
                    :btn-tooltip-text="'Bỏ phân công'"
                    :btn-icon="'uil uil-times-square'"
                    @onBtnClick="
                      handleB
                      tnRemoveWorkFlowAssignmentClick
                    "
                  />
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot v-if="isShowBtnAdd">
            <tr>
              <th colspan="5">
                <div class="form-group">
                  <multiselect
                    id="phan-cong-nhan-vien"
                    v-model="phanCongThem"
                    label="sTieudeNhanvien"
                    track-by="_id"
                    placeholder="Thêm phân công..."
                    :multiple="true"
                    :show-labels="false"
                    :options="listStaff"
                  ></multiselect>
                </div>
              </th>
              <th class="text-right">
                <btnTooltip
                  :btn-id="'btn-save-add-work-assignment-'"
                  :btn-type="'primary'"
                  :btn-tooltip-text="'Lưu phân công'"
                  :btn-icon="'uil uil-arrow-to-bottom'"
                  @onBtnClick="handleBtnAddWorkFlowAssignmentClick"
                />
              </th>
            </tr>
          </tfoot>
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
.thoi-gian-phan-cong {
  font-size: 0.65rem;
}
</style>