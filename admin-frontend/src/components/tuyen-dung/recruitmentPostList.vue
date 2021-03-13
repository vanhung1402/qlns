<script>
import RecruitmentPostCell from '@components/tuyen-dung/recruitmentPostCell'

export default {
  components: { RecruitmentPostCell },
  props: {
    lists: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      listRecruitmentPosts: [],
    }
  },
  created() {},
  methods: {
		handleClickEditPost(post){
			this.$emit('handleClickEditPost', post)
		}
	},
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h4 class="text-center text-uppercase">Danh sách tin tuyển dụng</h4>
      <table class="table table-border table-hover">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tiêu đề tin</th>
            <th>Vị trí công việc</th>
            <th>Thời gian hiển thị</th>
            <th>Người đăng/Cập nhật</th>
            <th class="text-right">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <RecruitmentPostCell
            v-for="(post, index) in lists"
            :key="index"
            :index="index + 1"
            :post="post"
						@handleClickEditPost="handleClickEditPost"
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
}
</style>