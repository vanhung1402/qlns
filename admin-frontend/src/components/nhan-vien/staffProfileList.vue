<script>
import StaffProfileCell from '@components/nhan-vien/staffProfileCell'

export default {
  components: { StaffProfileCell },
  props: {
    listStaffProfile: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleBtnEditProfileClick(profile){
      this.$emit('handleBtnEditProfileClick', profile)
    }
  }
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4 class="text-center text-uppercase">Danh sách nhân viên</h4>
      <table class="table table-border table-hover">
        <thead>
          <tr>
            <th>STT</th>
            <th>Nhân viên</th>
            <th>Ngày sinh</th>
            <th>Vị trí công việc hiện tại</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <StaffProfileCell
            v-for="(profile, index) in listStaffProfile"
            :key="profile._id"
            :index="index + 1"
            :profile="profile"
            @handleBtnEditProfileClick="handleBtnEditProfileClick"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
thead th {
  vertical-align: middle;
  text-align: center;
}
thead th:last-child {
  min-width: 150px;
  text-align: right;
}
</style>