<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  page: {
    title: 'Quản lý danh mục Hình thức đăng tuyển',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Hình thức đăng tuyển',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý danh mục',
          href: '/',
        },
        {
          text: 'Hình thức đăng tuyển',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      isUpdate: false,
      form: {
        tenHinhthucDangtuyen: '',
      },
      submitted: false,
      listRecruitmentPostType: [],
    }
  },
  validations: {
    form: {
      tenHinhthucDangtuyen: { required },
    },
  },
  created() {
    this.loadlistRecruitmentPostType()
  },
  methods: {
    async loadlistRecruitmentPostType() {
      let promise = await axios
        .get('/api/danh-muc/list-recruitment-post-type')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listRecruitmentPostType = promise.data
      }
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
      this.handleSave()
    },
    handleSave() {
      let newViTriCongViec = {
        PK_iHinhthucDangtuyenID: Date.now(),
        sTenHinhthucDangtuyen: this.form.tenHinhthucDangtuyen,
      }

      axios
        .post('/api/danh-muc/recruitment-post-type', newViTriCongViec)
        .then((res) => {
          if (res.status === 200) {
            this.$toastr.success(
              'Thêm Hình thức đăng tuyển thành công.',
              'Thành công'
            )
            this.loadlistRecruitmentPostType()
						this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi Hình thức đăng tuyển.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error('Không thể thêm Hình thức đăng tuyển.', 'Thất bại')
        })
    },
    handleResetForm() {
      this.form = {
        tenHinhthucDangtuyen: '',
      }
      this.submitted = false
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body">
            <form method="post" @submit.prevent="handleSubmit">
              <h4 class="card-title text-center text-uppercase">{{
                isUpdate ? 'Cập nhật Hình thức đăng tuyển' : 'Thêm Hình thức đăng tuyển'
              }}</h4>
              <div class="form-group">
                <label for="ten-vi-tri-cong-viec">
                  Tên Hình thức đăng tuyển
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ten-vi-tri-cong-viec"
                  v-model="form.tenHinhthucDangtuyen"
                  name="ten-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid': submitted && $v.form.tenHinhthucDangtuyen.$error,
                  }"
                  type="text"
                  placeholder="Tên Hình thức đăng tuyển"
                />
                <div
                  v-if="submitted && !$v.form.tenHinhthucDangtuyen.required"
                  class="invalid-feedback"
                  >Vui lòng nhập tên Hình thức đăng tuyển.</div
                >
              </div>
              <div class="form-group text-center m-b-0">
                <button
                  class="btn btn-primary"
                  name="action"
                  value="then-vi-tri-cong-viec"
                  type="submit"
                >
                  <i class="uil uil-plus"></i> Thêm Hình thức đăng tuyển</button
                >
                <button
                  type="reset"
                  class="btn btn-secondary m-l-5 ml-1"
                  @click="handleResetForm"
                >
                  <i class="uil uil-multiply"></i> Hủy</button
                >
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-center text-uppercase"
              >Danh sách Hình thức đăng tuyển</h4
            >
            <table class="table table-border">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Hình thức đăng tuyển</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(recruitmentPostType, index) in listRecruitmentPostType"
                  :key="recruitmentPostType._id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ recruitmentPostType.sTenHinhthucDangtuyen }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>