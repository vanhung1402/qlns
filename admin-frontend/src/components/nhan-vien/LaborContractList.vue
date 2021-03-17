<script>
import btnTooltip from '@components/button-tooltip'
import { dateFilter } from 'vue-date-fns'

export default {
  components: { btnTooltip },
  filters: {
    date: dateFilter,
  },
  props: {
    listLaborContract: {
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
    async loadJobPosition() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listJobPosition = promise.data
      }
    },
    handleBtnInfoLaborContractClick() {},
    handleBtnAddLaborContractClick(data) {
      let routeData = this.$router.resolve({
        name: 'LaborContract',
        params: { profileId: this.$router.currentRoute.params.profileId },
      })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="text-uppercase">Hợp đồng lao động</h5>
      <hr />
      <div class="table-responsive">
        <table class="table table-border">
          <thead>
            <tr>
              <th>Số hợp đồng</th>
              <th>Loại hợp đồng</th>
              <th>Tên hợp đồng</th>
              <th>Vị trí công việc</th>
              <th>Ngày có hiệu lực</th>
              <th>Ngày hết hiệu lực</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(laborContract, index) in listLaborContract"
              :key="index"
            >
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <btnTooltip
                  :btn-id="'btn-labor-contract-info-' + index"
                  :btn-type="'info'"
                  :btn-data="laborContract"
                  :btn-tooltip-text="'Nội dung hợp đồng'"
                  :btn-icon="'uil uil-info-circle'"
                  @onBtnClick="handleBtnInfoLaborContractClick"
                />
              </td>
            </tr>
          </tbody>
					<tfoot>
						<tr>
							<th colspan="7" class="text-right">
                <btnTooltip
                  :btn-id="'btn-add-labor-contract-'"
                  :btn-type="'primary'"
                  :btn-tooltip-text="'Lập hợp đồng lao động'"
                  :btn-icon="'uil uil-plus'"
                  @onBtnClick="handleBtnAddLaborContractClick"
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