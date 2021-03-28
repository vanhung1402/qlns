<script>
export default {
  props: {
    href: {
      type: String,
      default: 'id-' + Date.now(),
    },
    btnId: {
      type: String,
      default: 'id-' + Date.now(),
    },
    btnClass: {
      type: String,
      default: 'btn btn-sm m-1',
    },
    btnType: {
      type: String,
      default: 'default',
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
    target: {
      type: String,
      default: '',
    }
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
    <a
      :id="btnId"
      :target="target"
      :href="href"
      :class="btnType + ' ' + btnClass"
      @click="onBtnClick"
      ><i :class="btnIcon"></i>{{ btnText ? ` &nbsp; ${btnText}` : '' }}
    </a>
    <b-tooltip :target="btnId" placement="bottom">{{
      btnTooltipText
    }}</b-tooltip>
  </span>
</template>

<style scoped>
a{
  color: white !important;
}
</style>