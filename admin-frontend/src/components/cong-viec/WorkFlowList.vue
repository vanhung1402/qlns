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
    listWorkFlow: {
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
			}
		}
	},
  created() {},
  methods: {
    handleBtnInfoWorkFlowClick() {},
    handleBtnAddWorkFlowClick(data) {
      let routeData = this.$router.resolve({
        name: 'WorkFlow',
        params: { profileId: this.$router.currentRoute.params.profileId },
      })
      window.open(routeData.href, '_blank')
    },
		handleBtnEditWorkFlowClick(data) {
			this.$emit('onClickEditWorkFlow', data)
		},
		handleBtnCancelWorkFlowClick(data){
			this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Công việc này sẽ bị hủy và không thể khôi phục!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Đúng, hủy ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.cancelWorkFlow(data.PK_iCongviecID)
          }
        })
		},
		cancelWorkFlow(workFlowid){
			this.$workflow.post('/cong-viec?action=huy-cong-viec', {
        id: workFlowid
      })
      .then(res => {
				console.log(res)
        if (res.status === 200){
          this.$emit('handleCancelWorkFlow');
        }
      })
      .catch(err => {
        console.error(err); 
      })
		}
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
              <th class="text-center">STT</th>
              <th>Công việc</th>
              <th>Người tạo</th>
              <th>Nhân lực</th>
              <th>Trạng thái</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(workFlow, index) in listWorkFlow" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ workFlow.sTenCongviec }}</td>
              <td>{{ workFlow.sMaNhanvien }} | {{ workFlow.sHoten }}</td>
              <td><i class="uil uil-user"></i> {{ workFlow.soluong }}</td>
              <td><span :class="'badge badge-soft-' + mapBadgeType[workFlow.PK_iTrangthaiCongviecID]">{{ workFlow.sTenTrangthaiCongviec }}</span></td>
              <td class="text-right">
                <btnTooltip
									v-if="Number(workFlow.PK_iTrangthaiCongviecID) === 1"
                  :btn-id="'btn-work-flow-edit-' + index"
                  :btn-type="'primary'"
                  :btn-data="workFlow"
                  :btn-tooltip-text="'Sửa công việc'"
                  :btn-icon="'uil uil-edit'"
                  @onBtnClick="handleBtnEditWorkFlowClick"
                />
                <btnTooltip
									v-if="Number(workFlow.PK_iTrangthaiCongviecID) === 1"
                  :btn-id="'btn-work-flow-cancel-' + index"
                  :btn-type="'danger'"
                  :btn-data="workFlow"
                  :btn-tooltip-text="'Hủy công việc'"
                  :btn-icon="'uil uil-bolt-slash'"
                  @onBtnClick="handleBtnCancelWorkFlowClick"
                />
                <aTooltip
									:href="'chi-tiet/' + workFlow.PK_iCongviecID"
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