<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required } from 'vuelidate/lib/validators'
import axios from 'axios'

export default {
  page: {
    title: 'Quản lý danh mục Trạng thái hồ sơ tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Trạng thái hồ sơ tuyển dụng',
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
          text: 'Trạng thái hồ sơ tuyển dụng',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      isUpdate: false,
      form: {
        maTrangThaiHoSoTuyenDung: '',
        tenTrangThaiHoSoTuyenDung: '',
      },
      submitted: false,
      listRecruitmentProfileStatus: [],
    }
  },
  validations: {
    form: {
      maTrangThaiHoSoTuyenDung: { required },
      tenTrangThaiHoSoTuyenDung: { required },
    },
  },
  created() {
    this.loadListRecruitmentProfileStatus()
  },
  methods: {
    async loadListRecruitmentProfileStatus() {
      let promise = await axios
        .get('/api/danh-muc/list-recruitment-profile-status')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listRecruitmentProfileStatus = promise.data
      }
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
      this.handleSave()
    },
    handleSave() {
      let newTrangThaiHoSoTuyenDung = {
        PK_iTrangthaiHosoTuyendungID: this.form.maTrangThaiHoSoTuyenDung || Date.now(),
        sTenTrangthaiHosoTuyendung: this.form.tenTrangThaiHoSoTuyenDung,
      }

      axios
        .post('/api/danh-muc/recruitment-profile-status', newTrangThaiHoSoTuyenDung)
        .then((res) => {
          if (res.status === 200) {
            this.$toastr.success(
              'Thêm Trạng thái hồ sơ tuyển dụng thành công.',
              'Thành công'
            )
						this.listRecruitmentProfileStatus.push(res.data)
            this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi Trạng thái hồ sơ tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error(
            'Không thể thêm Trạng thái hồ sơ tuyển dụng.',
            'Thất bại'
          )
        })
    },
    handleResetForm() {
      this.form = {
        tenTrangThaiHoSoTuyenDung: '',
        maTrangThaiHoSoTuyenDung: '',
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
                isUpdate
                  ? 'Cập nhật Trạng thái hồ sơ tuyển dụng'
                  : 'Thêm Trạng thái hồ sơ tuyển dụng'
              }}</h4>
              <div class="form-group">
                <label for="ma-vi-tri-cong-viec">
                  Mã Trạng thái hồ sơ tuyển dụng
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ma-vi-tri-cong-viec"
                  v-model="form.maTrangThaiHoSoTuyenDung"
                  name="ma-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitted && $v.form.maTrangThaiHoSoTuyenDung.$error,
                  }"
                  type="number"
                  placeholder="Mã Trạng thái hồ sơ tuyển dụng"
                />
                <div
                  v-if="
                    submitted && !$v.form.maTrangThaiHoSoTuyenDung.required
                  "
                  class="invalid-feedback"
                  >Vui lòng nhập mã Trạng thái hồ sơ tuyển dụng.</div
                >
              </div>

              <div class="form-group">
                <label for="ten-vi-tri-cong-viec">
                  Tên Trạng thái hồ sơ tuyển dụng
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ten-vi-tri-cong-viec"
                  v-model="form.tenTrangThaiHoSoTuyenDung"
                  name="ten-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitted && $v.form.tenTrangThaiHoSoTuyenDung.$error,
                  }"
                  type="text"
                  placeholder="Tên Trạng thái hồ sơ tuyển dụng"
                />
                <div
                  v-if="
                    submitted && !$v.form.tenTrangThaiHoSoTuyenDung.required
                  "
                  class="invalid-feedback"
                  >Vui lòng nhập tên Trạng thái hồ sơ tuyển dụng.</div
                >
              </div>
              <div class="form-group text-center m-b-0">
                <button
                  class="btn btn-primary"
                  name="action"
                  value="then-vi-tri-cong-viec"
                  type="submit"
                >
                  <i class="uil uil-plus"></i> Thêm Trạng thái</button
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
              >Danh sách Trạng thái hồ sơ tuyển dụng</h4
            >
            <table class="table table-border">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã trạng thái</th>
                  <th>Tên Trạng thái hồ sơ tuyển dụng</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(
                    recruitmentProfileStatus, index
                  ) in listRecruitmentProfileStatus"
                  :key="recruitmentProfileStatus._id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ recruitmentProfileStatus.PK_iTrangthaiHosoTuyendungID }}</td>
                  <td>{{
                    recruitmentProfileStatus.sTenTrangthaiHosoTuyendung
                  }}</td>
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