<template>
  <Layout>
    <div class="row page-title align-items-center">
      <div class="col-sm-12">
        <h4 class="mb-1 mt-1">Trang chủ</h4>
      </div>
    </div>

	<div class="row">
		<div class="col-md-12">
			<div class="card">
				<div class="card-body">
					<h1 class="text-center">Chào mừng bạn đến với trang web <span class="inline-block">quản lý nhân sự</span></h1>
					<h1 class="text-center">Công ty cổ phần dược phẩm LOCIFA</h1>
				</div>
			</div>
		</div>
	</div>
  </Layout>
</template>

<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: 'Welcome',
    meta: [
      {
        name: 'description',
        content: {
          title: 'Shreyu - Vue js Admin Template',
          description: 'Shreyu is a Vue js based admin template',
        },
      },
    ],
  },
  components: {
    Layout,
  },
}
</script>