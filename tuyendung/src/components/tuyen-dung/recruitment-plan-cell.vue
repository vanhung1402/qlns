<script>
export default {
  components: {},
  props: {
    plan: {
      type: Object,
      default: () => {
        return {
          _id: 0,
          viTricongViec: {},
          soLuong: 10,
          lyDoTuyen: 'Thay thế nhân viên nghỉ việc',
          mucLuongDukien: 10000000,
          thoiGianNhanHoSo: { start: '2021-01-01', end: '2021-01-05' },
          thoiGianDuyetHoSo: { start: '2021-01-03', end: '2021-01-06' },
          thoiGianPhongVan: { start: '2021-01-07', end: '2021-01-12' },
          hinhThucDangTuyen: {},
          kinhPhiDuKien: 5000000,
        }
      },
    },
    index: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    formatMoney(money) {
      let newvalue = '0.00'
      if (money != null) {
        let value = Number(money)
        newvalue = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      }

      return newvalue.replace('.00', '')
    },
    dateToStringDate(date) {
      return date.split('-').reverse().join('/')
    },
    onClickChangeDetailPlan() {
      this.$emit('onClickBtnChangeDetailPlan', this.plan._id)
    },
    onClickRemoveDetailPlan() {
      this.$swal({
        title: 'Bạn có chắc chắn muốn xóa?',
        text: "Sau khi xóa, chi tiết kế hoạch tuyển dụng này sẽ không thể khôi phục!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đồng ý, xóa nó!',
        cancelButtonText: 'Giữ lại',
      }).then((result) => {
        if (result.isConfirmed && this.plan._id) {
          this.$emit('onClickBtnRemoveDetailPlan', this.plan._id)
        }
      }) 
    },
  },
}
</script>

<template>
  <tr>
    <td class="text-center">{{ index + 1 }}</td>
    <td>{{ plan.viTricongViec.sTenVitriCongviec }}</td>
    <td class="text-center">{{ plan.soLuong }}</td>
    <td>{{ plan.lyDoTuyen }}</td>
    <td class="text-center">{{ formatMoney(plan.mucLuongDukien) }}</td>
    <td>{{ plan.hinhThucDangTuyen.sTenHinhthucDangtuyen }}</td>
    <td class="text-center">{{ formatMoney(plan.kinhPhiDuKien) }}</td>
    <td class="text-right btn-action">
      <b-button
        :id="'btn-change-detail-plan-' + index"
        variant="info btn-sm m-1"
        @click="onClickChangeDetailPlan"
        ><i class="uil uil-edit"></i>
      </b-button>
      <b-button
        :id="'btn-remove-detail-plan-' + index"
        variant="danger btn-sm m-1"
        @click="onClickRemoveDetailPlan"
        ><i class="uil uil-trash"></i>
      </b-button>
      <b-tooltip :target="'btn-change-detail-plan-' + index" placement="bottom"
        >Cập nhật kế hoạch</b-tooltip
      >
      <b-tooltip :target="'btn-remove-detail-plan-' + index" placement="bottom"
        >Xóa kế hoạch</b-tooltip
      >
    </td>
  </tr>
</template>

<style lang="stylus" scoped>
.table tr td {
  vertical-align: middle;
}
td.btn-action{
  min-width: 120px;
}
</style>