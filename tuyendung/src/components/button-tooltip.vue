<script>
export default {
  props: {
    btnId: {
      type: String,
      default: 'id-' + Date.now(),
    },
    btnClass: {
      type: String,
      default: 'btn-sm m-1',
    },
    btnType: {
      type: String,
      default: 'default',
    },
    btnData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    btnIcon: {
      type: String,
      default: 'uil uil-plus',
    },
    btnTooltipText: {
      type: String,
      default: 'Click vào đây',
    },
    btnText: {
      type: String,
      default: '',
    },
  },
  methods: {
    onBtnClick() {
      let data = this.btnData
      this.$emit('onBtnClick', data)
    },
  },
}
</script>
<template>
  <span>
    <b-button
      :id="btnId"
      :variant="btnType + ' ' + btnClass"
      @click="onBtnClick"
      ><i :class="btnIcon"></i>{{ btnText ? ` &nbsp; ${btnText}` : '' }}
    </b-button>
    <b-tooltip :target="btnId" placement="bottom">{{
      btnTooltipText
    }}</b-tooltip>
  </span>
</template>