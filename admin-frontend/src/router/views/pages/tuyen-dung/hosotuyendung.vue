<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import pdf from 'vue-pdf'


export default {
  page: {
    title: 'Chi tiết hồ sơ ứng viên',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
		pdf
  },
  data() {
    return {
      title: 'Chi tiết hồ sơ ứng viên',
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
          text: 'Hồ sơ ứng viên',
          active: true,
        },
      ],
      icon: 'info-circle',
      profile: {
        _id: 1,
        fullName: 'Nguyen Thi Hoai',
        birthDay: '16/11/1999',
        gender: 'Nu',
        phone: '0396338034',
        email: 'nguyenhoai161199@gmail.com',
      },
    }
  },
}
</script>  
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="row">
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="text-center mt-3">
              <img
                src="@assets/images/users/avatar-7.jpg"
                alt
                class="avatar-lg rounded-circle"
              />
              <h5 class="mt-2 mb-0">{{ profile.fullName }}</h5>
              <div class="mt-5 pt-2 border-top">
                <h4 class="mb-3 font-size-15">Giới thiệu</h4>
                <div class="table-responsive">
                  <table class="table table-borderless mb-0 text-muted">
                    <thead>
                      <tr>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ profile.gender }}</td>
                        <td>{{ profile.birthDay }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="mt-3 pt-2 border-top">
              <h4 class="mb-3 font-size-15">Thông tin liên hệ</h4>
              <div class="table-responsive">
								<h6>Email:</h6>
								<p>{{ profile.email }}</p>
								<h6>Phone:</h6>
								<p>{{ profile.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <div class="card">
          <div class="card-body">
						  <pdf src="../../static/ho-so-ung-vien/relativity.pdf"></pdf>
					</div>
        </div>
      </div>
    </div>
  </Layout>
</template>