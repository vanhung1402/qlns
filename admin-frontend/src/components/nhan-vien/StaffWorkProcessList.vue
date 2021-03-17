<script>
import btnTooltip from '@components/button-tooltip'
import moment from 'moment'

export default {
  components: { btnTooltip },
  filters: {
    momentVNDate: function (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    momentENDate: function (date) {
      return moment(date).format('YYYY/MM/DD')
    },
  },
  props: {
    listWorkProcess: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      listJobPosition: [],
    }
  },
  created() {
    this.loadJobPosition()
  },
  methods: {
    loadJobPosition() {
      this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .then((res) => {
          if (res.status === 200) {
            let listJobPosition = {}
            res.data.forEach((job) => {
              listJobPosition[job._id] = job
            })
            this.listJobPosition = listJobPosition
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleBtnAddLaborContractClick() {},
    handleBtnEndLaborContractClick() {},
		handleBtnAddWorkProcessClick() {},
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="text-uppercase">Lịch sử làm việc</h5>
      <hr />
      <div class="table-responsive">
        <table class="table table-border">
          <thead>
            <tr>
              <th>Vị trí công việc</th>
              <th>Bộ phận</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Ghi chú</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(workProcess, index) in listWorkProcess" :key="index">
              <td>{{
                listJobPosition[workProcess.FK_iVitriCongviecID]
                  ? listJobPosition[workProcess.FK_iVitriCongviecID]
                      .sTenVitriCongviec
                  : ''
              }}</td>
              <td>{{
                listJobPosition[workProcess.FK_iVitriCongviecID]
                  ? listJobPosition[workProcess.FK_iVitriCongviecID]
                      .FK_iBophanID.sTenBophan
                  : ''
              }}</td>
              <td>{{ workProcess.dNgayBatdau | momentVNDate }}</td>
              <td>
                <span v-if="workProcess.dNgayKethuc">{{
                  workProcess.dNgayKethuc | momentVNDate
                }}</span>
              </td>
              <td>{{ workProcess.sGhichu }}</td>
              <td class="text-right">
                <btnTooltip
                  v-if="
                    workProcess.dNgayKethuc === '' ||
                    new Date() < new Date(workProcess.dNgayKethuc)
                  "
                  :btn-id="'btn-labor-contract-info-' + index"
                  :btn-type="'success'"
                  :btn-data="workProcess"
                  :btn-tooltip-text="'Tạo mới / gia hạn hợp đồng'"
                  :btn-icon="'uil uil-file-plus-alt'"
                  @onBtnClick="handleBtnAddLaborContractClick"
                />
                <btnTooltip
                  v-if="workProcess.dNgayKethuc === ''"
                  :btn-id="'btn-labor-contract-end-' + index"
                  :btn-type="'warning'"
                  :btn-data="workProcess"
                  :btn-tooltip-text="'Kết thúc vị trí'"
                  :btn-icon="'uil uil-check-square'"
                  @onBtnClick="handleBtnEndLaborContractClick"
                />
              </td>
            </tr>
          </tbody>
					<tfoot>
						<tr>
							<th colspan="6" class="text-right">
                <btnTooltip
                  :btn-id="'btn-add-work-process-'"
                  :btn-type="'primary'"
                  :btn-tooltip-text="'Thuyên chuyển vị trí công việc'"
                  :btn-icon="'uil uil-plus'"
                  @onBtnClick="handleBtnAddWorkProcessClick"
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
</style>