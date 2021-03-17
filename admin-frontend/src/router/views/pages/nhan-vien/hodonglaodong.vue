<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
export default {
  page: {
    title: 'Hợp đồng lao động',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Hợp đồng lao động',
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
          text: 'Hợp đồng lao động',
          active: true,
        },
      ],
      icon: 'file-shield-alt',
      isUpdate: false,
      submitted: false,
    }
  },
  methods: {
    handleSubmit() {},
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />

    <div class="card">
      <div class="card-body">
        <h4 class="text-center text-uppercase">{{
          isUpdate ? 'Cập nhật hợp đồng' : 'Lập hợp đồng'
        }}</h4>
        <hr />
        <form @submit.prevent="handleSubmit"> </form>
      </div>
    </div>
  </Layout>
</template>