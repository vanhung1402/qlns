<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import LaborContractList from '@components/nhan-vien/LaborContractList'
import StaffWorkProcessList from '@components/nhan-vien/StaffWorkProcessList'

export default {
  page: {
    title: 'Chi tiết hồ sơ nhân viên',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    LaborContractList,
    StaffWorkProcessList,
  },
  data() {
    return {
      title: 'Chi tiết hồ sơ nhân viên',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý nhân viên',
          href: '/',
        },
        {
          text: 'Hồ sơ nhân viên',
          active: true,
        },
      ],
      icon: 'info-circle',
      profile: {},
			profileId: '',
      listLaborContract: [],
      listWorkProcess: [],
    }
  },
	created() {
		this.profileId = this.$router.currentRoute.params.profileId
		this.loadWorkProcess()
	},
	methods: {
		async loadWorkProcess(){
			this.$staff
        .get('/nhan-vien/qua-trinh-lam-viec?nhan-vien=' + this.profileId)
        .then((res) => {
          if (res.status === 200 && res.data) {
            console.log(res.data)
            this.listWorkProcess = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
		}
	}
}
</script>  
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="card">
      <div class="card-body">
				<h5 class="text-uppercase">Thông tin cá nhân</h5>
				<hr>
			</div>
    </div>
    <StaffWorkProcessList :list-work-process="listWorkProcess" />
    <LaborContractList :list-labor-contract="listLaborContract" />
  </Layout>
</template>