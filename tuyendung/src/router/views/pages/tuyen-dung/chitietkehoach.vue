/* eslint-disable vue/no-v-html */
<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Overview from '@components/overview'

export default {
  page: {
    title: 'Chi tiết Kế hoạch tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Overview,
  },
  data() {
    return {
      title: 'Chi tiết Kế hoạch tuyển dụng',
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
          text: 'Kế hoạch tuyển dụng',
          active: true,
        },
      ],
      icon: 'clipboard-notes',
      plan: {},
      details: [],
      overviewData: [
        {
          class: 'py-3 border-bottom',
          icon: 'user',
          value: 'Người cập nhật',
          title: 'Total Tasks Completed',
        },
        {
          class: 'py-3 border-bottom',
          icon: 'clock',
          value: '21,000',
          title: 'Total Hours Worked',
        },
        {
          class: 'py-3 border-bottom',
          icon: 'briefcase',
          value: '1095',
          title: 'Total Issues Fixed',
        },
        {
          class: 'py-3',
          icon: 'tag',
          value: '51,200',
          title: 'Total Commits',
        },
      ],
    }
  },
  created() {
    this.loadRecruitmentPlan()
    this.loadRecruitmentPlanDetail()
  },
  methods: {
    async loadRecruitmentPlan() {
      this.$recruitment
        .get('/api/tuyen-dung/recruitment-plan/' + this.$route.params.planId)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data)
            this.plan = res.data
            this.loadOverView()
          }
        })
    },
    loadOverView() {
      let overview = [
        {
          class: 'py-3 border-bottom',
          icon: 'user',
          value: this.plan.FK_iNguoilapKehoachID.sHoten,
          title: 'Người cập nhật',
        },
        {
          class: 'py-3 border-bottom',
          icon: 'calendar',
          value: this.plan.txtThoigianLap,
          title: 'Thời gian cập nhật',
        },
        {
          class: 'py-3 border-bottom',
          icon: 'activity',
          value: this.plan.FK_iTrangthaiKehoachTuyendungID
            .sTenTrangthaiKehoachTuyendung,
          title: 'Trạng thái',
        },
      ]
      if (
        this.plan.FK_iTrangthaiKehoachTuyendungID
          .PK_iTrangthaiKehoachTuyendungID > 2
      ) {
        overview.push({
          class: 'py-3 border-bottom',
          icon: 'edit-3',
          value: 'Lý do',
          title: this.plan.sLydo,
        })
      } else if (
        this.plan.FK_iTrangthaiKehoachTuyendungID
          .PK_iTrangthaiKehoachTuyendungID === 2
      ) {
        overview.push({
          class: 'py-3 border-bottom',
          icon: 'user-check',
          value: this.plan.FK_iNguoiduyetKehoachID.sHoten,
          title: 'Người duyệt',
        })
        overview.push({
          class: 'py-3 border-bottom',
          icon: 'check-square',
          value: this.plan.txtThoigianDuyet,
          title: 'Thời gian duyệt',
        })
      }
      this.overviewData = overview
    },
    async loadRecruitmentPlanDetail() {
      this.$recruitment
        .get(
          '/api/tuyen-dung/recruitment-plan-list-detail/' +
            this.$route.params.planId
        )
        .then((res) => {
          if (res.status === 200) {
            this.details = res.data
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
        <h2 class="text-center text-uppercase">{{ plan.sTieudeKehoach }}</h2>

        <div class="row">
          <div class="col-md-3">
            <Overview title="Thông tin" :items="overviewData" />
          </div>
          <div class="col-md-9">
            <div class="card">
              <div class="card-body">
                <!-- eslint-disable vue/no-v-html -->
                <div class="content-plan" v-html="plan.sNoidungKehoach"></div>
                <!--eslint-enable-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>