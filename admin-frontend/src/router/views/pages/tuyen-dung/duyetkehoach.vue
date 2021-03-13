<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import PlanReviewCell from '@components/tuyen-dung/recruitment-review-cell'

export default {
  page: {
    title: 'Duyệt kế hoạch tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    PlanReviewCell,
  },
  data() {
    return {
      title: 'Duyệt kế hoạch tuyển dụng',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý tuyển dụng',
          href: '/',
        },
        {
          text: 'Duyệt kế hoạch',
          active: true,
        },
      ],
      icon: 'file-check-alt',
      plans: [],
    }
  },
  created() {
    this.loadListRecruitmentPlan()
  },
  methods: {
    async loadListRecruitmentPlan() {
      let promise = await this.$recruitment.get(
        '/api/tuyen-dung/list-recruitment-plan/status',
        {
          params: { statusId: [1, 2] },
        }
      )
      if (promise.status === 200) {
        this.plans = promise.data
      }
    },
    async handleReturnPlan(planReturnID) {
      const btnReturnPlan = await this.$swal.fire({
        input: 'textarea',
        inputLabel: 'Lý do gửi trả',
        inputPlaceholder: 'Nhập lý do gửi trả kế hoạch...',
        inputAttributes: {
          'aria-label': 'Nhập lý do gửi trả kế hoạch',
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Gửi trả',
        cancelButtonText: 'Hủy!',
      })

      if (btnReturnPlan.isConfirmed) {
        if (btnReturnPlan.value) {
          this.$recruitment
            .put('/api/tuyen-dung/recruitment-plan/' + planReturnID, {
              action: 'change-status',
              params: {
                status: 3,
                reason: btnReturnPlan.value,
                updateBy: this.$store.state.auth.currentUser.staff,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                this.$toastr.success(
                  'Đã gửi trả kế hoạch tuyển dụng.',
                  'Thành công'
                )
                this.loadListRecruitmentPlan()
              } else {
                this.$toastr.error(
                  'Không thể gửi trả kế hoạch tuyển dụng.',
                  'Thất bại'
                )
              }
            })
            .catch((err) => {
              console.error(err)
              this.$toastr.error(
                'Đã có lỗi xảy ra khi gửi trả kế hoạch tuyển dụng.',
                'Lỗi'
              )
            })
        } else {
          this.$toastr.warning(
            'Chưa nhập lý do gửi trả kế hoạch tuyển dụng.',
            'Cảnh báo'
          )
        }
      }
    },
    handleApprovedPlan(planApprovedID) {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Kế hoạch tuyển dụng này sẽ được duyệt!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đúng, duyệt ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$recruitment
              .put('/api/tuyen-dung/recruitment-plan/' + planApprovedID, {
                action: 'change-status',
                params: {
                  status: 2,
                  updateBy: this.$store.state.auth.currentUser.staff,
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  console.log(res)
                  this.$toastr.success(
                    'Đã duyệt kế hoạch tuyển dụng.',
                    'Thành công'
                  )
                  this.loadListRecruitmentPlan()
                } else {
                  this.$toastr.error(
                    'Không thể duyệt kế hoạch tuyển dụng.',
                    'Thất bại'
                  )
                }
              })
              .catch((err) => {
                console.error(err)
                this.$toastr.error(
                  'Đã có lỗi xảy ra khi duyệt kế hoạch tuyển dụng.',
                  'Lỗi'
                )
              })
          }
        })
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="card">
      <div class="card-body">
        <h4 class="card-title text-center text-uppercase"
          >Danh sách kế hoạch chờ duyệt</h4
        >
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Kế hoạch</th>
              <th>Nội dung</th>
              <th>Người lập</th>
              <th>Thời gian lập</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <PlanReviewCell
              v-for="(plan, index) in plans"
              :key="plan._id"
              :plan="plan"
              :index="index + 1"
              :viewcall="'duyetkehoach'"
              @onClickReturnPlan="handleReturnPlan"
              @onClickApprovedPlan="handleApprovedPlan"
            />
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
</template>

<style lang="stylus" scoped>
thead th {
  vertical-align: middle;
  text-align: center;
}
</style>