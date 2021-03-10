<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  page: {
    title: 'Quản lý danh mục Bộ phận',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Danh mục Bộ phận',
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
          text: 'Bộ phận',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      isUpdate: false,
      listDepartment: [],
      form: {
        tenBoPhan: '',
      },
      submitted: false,
    }
  },
  created(){
    this.loadlistDepartment()
  },
  methods: {
    async loadlistDepartment() {
      let promise = await axios
        .get('/api/cau-hinh/list-department')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listDepartment = promise.data
      }
    },
    handleResetForm() {
      this.form = {
        tenBoPhan: '',
      }
      this.submitted = false
    },
  },
  validations: {
    form: {
      tenBoPhan: { required },
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <form method="post" @submit.prevent="handleSubmit">
              <h4 class="card-title text-center text-uppercase">{{
                isUpdate ? 'Cập nhật Bộ phận' : 'Thêm Bộ phận'
              }}</h4>
              <div class="form-group">
                <label for="ten-vi-tri-cong-viec">
                  Tên Bộ phận
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ten-vi-tri-cong-viec"
                  v-model="form.tenBoPhan"
                  name="ten-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitted && $v.form.tenBoPhan.$error,
                  }"
                  type="text"
                  placeholder="Tên Bộ phận"
                />
                <div
                  v-if="submitted && !$v.form.tenBoPhan.required"
                  class="invalid-feedback"
                  >Vui lòng nhập tên Bộ phận.</div
                >
              </div>
              <div class="form-group text-center m-b-0">
                <button
                  class="btn btn-primary"
                  name="action"
                  value="then-vi-tri-cong-viec"
                  type="submit"
                >
                  <i class="uil uil-plus"></i> Thêm Bộ phận</button
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
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title text-center text-uppercase"
              >Danh sách Bộ phận</h4
            >
            <table class="table table-border">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Bộ phận</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(department, index) in listDepartment"
                  :key="department._id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ department.sTenBophan }}</td>
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
