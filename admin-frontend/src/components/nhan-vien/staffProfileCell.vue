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
  },
	methods: {
		handleBtnEditProfileClick(){
      this.$emit('handleBtnEditProfileClick', this.profile)
    },
    handleBtnInfoProfileClick(data){
      let routeData = this.$router.resolve({
        name: 'StaffProfile',
        params: { profileId: data._id },
      })
      window.open(routeData.href, '_blank')
    },
    handleBtnLaborContractClick(data){
      let routeData = this.$router.resolve({
        name: 'LaborContract',
        params: { profileId: data._id },
      })
      window.open(routeData.href, '_blank')
    }
	}
}
</script>

<template>
  <tr>
    <td class="text-center">{{ index }}</td>
    <td>{{ profile.sMaNhanvien }} | {{ profile.sHoten }}</td>
    <td class="text-center">{{
      new Date(profile.dNgaysinh) | date('dd/MM/yyyy')
    }}</td>
		<td>{{ profile.vitri ? profile.vitri.sTenVitriCongviec : '' }}</td>
		<td class="text-right">
      <btnTooltip
        :btn-id="'btn-edit-profile-' + index"
        :btn-type="'info'"
        :btn-data="profile"
        :btn-tooltip-text="'Cập nhật thông tin'"
        :btn-icon="'uil uil-edit'"
        @onBtnClick="handleBtnEditProfileClick"
      />
      <btnTooltip
        :btn-id="'btn-hop-dong-lao-dong-' + index"
        :btn-type="'success'"
        :btn-data="profile"
        :btn-tooltip-text="'Hợp đồng lao động'"
        :btn-icon="'uil uil-notes'"
        @onBtnClick="handleBtnLaborContractClick"
      />
      <btnTooltip
        :btn-id="'btn-profile-info-' + index"
        :btn-type="'primary'"
        :btn-data="profile"
        :btn-tooltip-text="'Chi tiết hồ sơ'"
        :btn-icon="'uil uil-info-circle'"
        @onBtnClick="handleBtnInfoProfileClick"
      />
		</td>
  </tr>
</template>
<style>
table.table tr td {
  vertical-align: middle;
}
td.btn-action {
  min-width: 120px;
}
</style>