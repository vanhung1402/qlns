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
		<td>{{ profile.quatrinh_lamviec.FK_iVitriCongviecID }}</td>
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
        :btn-id="'btn-change-work-process-' + index"
        :btn-type="'primary'"
        :btn-data="profile"
        :btn-tooltip-text="'Lịch sử công tác'"
        :btn-icon="'uil uil-expand-arrows-alt'"
        @onBtnClick="handleBtnEditProfileClick"
      />
      <btnTooltip
        :btn-id="'btn-hop-dong-lao-dong-' + index"
        :btn-type="'success'"
        :btn-data="profile"
        :btn-tooltip-text="'Hợp đồng lao động'"
        :btn-icon="'uil uil-notes'"
        @onBtnClick="handleBtnEditProfileClick"
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