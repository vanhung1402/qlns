<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import ListProfile from '@components/tuyen-dung/recruitment-profile-list'

export default {
  page: {
    title: 'Đánh giá năng lực ứng viên',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    ListProfile,
  },
  data() {
    return {
      title: 'Đánh giá năng lực ứng viên',
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
          text: 'Đánh giá ứng viên',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      submitted: false,
      form: {
        fullName: '',
        birthDay: '',
        gender: 1,
        email: '',
        phone: '',
      },
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        maxFilesize: 0.5,
        maxFiles: 1,
        headers: { content: 'header value' },
      },
      dropzoneMessageClass: '',
      listProfiles: [],
    }
  },
  created(){
    this.loadListProfiles()
  },
  methods: {
    loadListProfiles() {
      this.$recruitment
        .get('/api/tuyen-dung/list-profile-with-status', {
          params: {status: [2, 4, 5]}
        })
        .then((res) => {
        console.log(res.data)
          this.listProfiles = res.data
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
  }
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <ListProfile
      :profiles="listProfiles"
      :view-call="'danhgia'"
      @handleReloadList="loadListProfiles"
    />
  </Layout>
</template>