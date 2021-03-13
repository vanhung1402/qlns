<script>
import btnTooltip from '@components/button-tooltip'
export default {
  components: {btnTooltip},
  props: {
    post: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  created() {},
  methods: {
    onBtnPostInfoClick(){},
    onClickEditPost(){
      this.$emit('handleClickEditPost', this.post)
    },
  },
}
</script>

<template>
  <tr>
    <td class="text-center">{{index}}</td>
    <td>{{ post.sTieudeTinTuyendung }}</td>
    <td>
      {{post.FK_iChitietKehoachTuyendungID.FK_iVitriCongviecID.sTenVitriCongviec}} - 
      {{post.FK_iChitietKehoachTuyendungID.FK_iKehoachTuyendungID.sTieudeKehoach}}
    </td>
    <td>
      <div><small>{{post.txtThoigianDang}}</small></div>
      <div><small>{{post.txtThoigianHethan}}</small></div>
    </td>
    <td>{{post.FK_iNguoiDangID.sHoten}}</td>
    <td class="text-right">
      <btnTooltip
        :btn-id="'btn-edit-post-' + index"
        :btn-type="'info'"
        :btn-tooltip-text="'Cập nhật tin'"
        :btn-icon="'uil uil-file-edit-alt'"
        @onBtnClick="onClickEditPost"
      />
      <btnTooltip
        :btn-id="'btn-info-post-' + index"
        :btn-type="'primary'"
        :btn-tooltip-text="'Chi tiết tin'"
        :btn-icon="'uil-info-circle'"
        @onBtnClick="onBtnPostInfoClick"
      />
    </td>
  </tr>
</template>

<style scoped>
tbody td {
  vertical-align: middle;
}
</style>