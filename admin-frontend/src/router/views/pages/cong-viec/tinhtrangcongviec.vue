<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
export default {
  page: {
    title: 'Quản lý Phân công công việc',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Phân công công việc',
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
          text: 'Phân công công việc',
          active: true,
        },
      ],
      icon: 'cell',
    }
  }    
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    s
  </Layout>
</template>