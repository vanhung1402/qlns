<script>
export default {
  components: {},
  props: {
    decisionCandidate: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: {
      type: Number,
      default: 1,
    },
  },
}
</script>

<template>
  <tr>
    <td class="text-center">{{ index }}</td>
    <td>{{ decisionCandidate.sHotenUngvien }}</td>
    <td>{{ decisionCandidate.dNgaysinhUngvien }}</td>
    <td>{{ decisionCandidate.sEmailUngvien }}</td>
    <td>{{ decisionCandidate.sViTriTuyenDung }}</td>
    <td>{{ decisionCandidate.ketQuaDanhGia }}</td>
  </tr>
</template>