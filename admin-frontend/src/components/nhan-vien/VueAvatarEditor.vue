<template>
  <div>
    <vue-avatar
      ref="vueavatar"
      :width="width"
      :height="height"
      :rotation="Number(rotation)"
      :border-radius="borderRadius"
      :border="border"
      :color="color"
      :scale="Number(scale)"
      @vue-avatar-editor:image-ready="onImageReady"
      @select-file="onSelectFile($event)"
    >
    </vue-avatar>
    <div class="text-center">
      <label v-if="hasScale">
        Zoom: {{ scale }}x
        <br />
        <input v-model="scale" type="range" min="1" max="3" step="0.02" />
      </label>
    </div>
    <div class="text-center">
      <label v-if="hasRotation">
        Xoay : {{ rotation }}°
        <br />
        <input v-model="rotation" type="range" min="0" max="360" step="1" />
      </label>
    </div>
    <div class="form-group text-center">
      <button type="button" class="btn btn-sm btn-secondary" @click="finished"
        ><i class="uil uil-crop-alt"></i> &nbsp; {{ finishText }}</button
      >
    </div>
  </div>
</template>

<script>
import VueAvatar from './VueAvatar.vue'

export default {
  components: {
    VueAvatar,
  },
  props: {
    finishText: {
      type: String,
      default: 'Lưu Avatar',
    },
    hasRotation: {
      type: Boolean,
      default: false,
    },
    hasScale: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: '',
    },
    border: {
      type: Number,
      default: 10,
    },
    borderRadius: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    color: {
      type: Array,
      default: () => [0, 0, 0, 0.5],
    },
  },
  data() {
    return {
      rotation: 0,
      scale: 1,
    }
  },
  methods: {
    onSelectFile(files) {
      this.$emit('select-file', files)
    },
    onImageReady() {
      this.scale = 1
      this.rotation = 0
    },
    finished() {
      return this.$emit('finished', this.$refs.vueavatar.getImageScaled())
    },
  },
}
</script>
