<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import StaffWorkFlowList from '@components/cong-viec/StaffWorkFlowList'

export default {
  page: {
    title: 'Quản lý Công việc cá nhân',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    StaffWorkFlowList,
  },
  data() {
    return {
      title: 'Công việc cá nhân',
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
          text: 'Công việc cá nhân',
          active: true,
        },
      ],
      icon: 'grid',
      StaffWorkFlowList: [],
    }
  },
  created() {
    this.loadStaffListWorkFlow()
  },
  methods: {
    loadStaffListWorkFlow() {
      this.$workflow
        .get(
          '/cong-viec?action=cong-viec-nhan-vien&nhan-vien=' +
            this.$store.state.auth.currentUser.staff
        )
        .then((res) => {
          console.log(res)
          if (res.status === 200 && res.data) {
            this.StaffWorkFlowList = res.data
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
    <StaffWorkFlowList
      :staff-work-flow-list="StaffWorkFlowList"
      @handleChangeStatusWorkFlowAssignment="loadStaffListWorkFlow"
    />
  </Layout>
</template>