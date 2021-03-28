<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import WorkFlowAssignmentList from '@components/cong-viec/WorkFlowAssignmentList'

export default {
  page: {
    title: 'Chi tiết Công việc',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    WorkFlowAssignmentList,
  },
  data() {
    return {
      title: 'Chi tiết Công việc',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý công việc',
          href: '/',
        },
        {
          text: 'Công việc',
          active: true,
        },
      ],
      icon: 'object-ungroup',
      workFlow: {},
      listWorkFlowAssignment: [],
      isShowActionGroup: false
    }
  },
  created() {
    this.loadWorkFlow()
    this.getWorkAssignmentOfWork()
  },
  methods: {
    getWorkAssignmentOfWork() {
      this.$workflow
        .get(
          '/cong-viec?action=phan-cong&cong-viec=' +
            this.$router.currentRoute.params.workFlowId
        )
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.listWorkFlowAssignment = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    loadWorkFlow() {
      this.$workflow
        .get(
          '/cong-viec?action=chi-tiet&cong-viec=' +
            this.$router.currentRoute.params.workFlowId
        )
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.workFlow = res.data
            this.isShowActionGroup = Number(res.data.FK_iTrangthaiCongviecID) !== 3
          }
        })
        .catch((err) => {
          console.error(err)
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
        <h4 class="text-center">{{ workFlow.sTenCongviec }}</h4>
        <hr />
        <!-- eslint-disable vue/no-v-html -->
        <div v-html="workFlow.sNoidungCongviec"></div>
        <!--eslint-enable-->
      </div>
    </div>
    <WorkFlowAssignmentList
      :list-work-flow-assignment="listWorkFlowAssignment"
      :is-show-btn-add="Number(workFlow.FK_iTrangthaiCongviecID) !== 3"
      :is-show-action-group="isShowActionGroup"
      @loadListWorkFlowAssignment="getWorkAssignmentOfWork"
    />
  </Layout>
</template>