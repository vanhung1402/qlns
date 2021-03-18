<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required } from 'vuelidate/lib/validators'

export default {
  page: {
    title: 'Quản lý danh mục Loại hợp đồng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: 'Loại hợp đồng',
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
          text: 'Loại hợp đồng',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      isUpdate: false,
      form: {
        maLoaiHopDong: '',
        tenLoaiHopdong: '',
      },
      submitted: false,
      listLaborContractType: [],
    }
  },
  validations: {
    form: {
      maLoaiHopDong: { required },
      tenLoaiHopdong: { required },
    },
  },
  created() {
    this.loadListLaborContractType()
  },
  methods: {
    async loadListLaborContractType() {
      let promise = await this.$recruitment
        .get('/api/danh-muc/list-labor-contract-type')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listLaborContractType = promise.data
      }
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
      this.handleSave()
    },
    handleSave() {
      let newLoaiHopDong = {
        PK_iLoaiHopdongID: this.form.maLoaiHopDong || Date.now(),
        sTenLoaiHopdong: this.form.tenLoaiHopdong,
      }

      this.$recruitment
        .post('/api/danh-muc/labor-contract-type', newLoaiHopDong)
        .then((res) => {
          if (res.status === 200) {
            this.$toastr.success(
              'Thêm Loại hợp đồng thành công.',
              'Thành công'
            )
						this.listLaborContractType.push(res.data)
            this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi thêm Loại hợp đồng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error(
            'Không thể thêm Loại hợp đồng.',
            'Thất bại'
          )
        })
    },
    handleResetForm() {
      this.form = {
        tenLoaiHopdong: '',
        maLoaiHopDong: '',
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
                  ? 'Cập nhật Loại hợp đồng'
                  : 'Thêm Loại hợp đồng'
              }}</h4>
              <div class="form-group">
                <label for="ma-vi-tri-cong-viec">
                  Mã Loại hợp đồng
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ma-vi-tri-cong-viec"
                  v-model="form.maLoaiHopDong"
                  name="ma-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitted && $v.form.maLoaiHopDong.$error,
                  }"
                  type="number"
                  placeholder="Mã Loại hợp đồng"
                />
                <div
                  v-if="
                    submitted && !$v.form.maLoaiHopDong.required
                  "
                  class="invalid-feedback"
                  >Vui lòng nhập mã Loại hợp đồng.</div
                >
              </div>

              <div class="form-group">
                <label for="ten-vi-tri-cong-viec">
                  Tên Loại hợp đồng
                  <span class="text-danger">*</span>
                </label>
                <input
                  id="ten-vi-tri-cong-viec"
                  v-model="form.tenLoaiHopdong"
                  name="ten-vi-tri-cong-viec"
                  class="form-control"
                  autocomplete="off"
                  :class="{
                    'is-invalid':
                      submitted && $v.form.tenLoaiHopdong.$error,
                  }"
                  type="text"
                  placeholder="Tên Loại hợp đồng"
                />
                <div
                  v-if="
                    submitted && !$v.form.tenLoaiHopdong.required
                  "
                  class="invalid-feedback"
                  >Vui lòng nhập tên Loại hợp đồng.</div
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
              >Danh sách Loại hợp đồng</h4
            >
            <table class="table table-border">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã trạng thái</th>
                  <th>Tên Loại hợp đồng</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(
                    LaborContractType, index
                  ) in listLaborContractType"
                  :key="LaborContractType._id"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ LaborContractType.PK_iLoaiHopdongID }}</td>
                  <td>{{
                    LaborContractType.sTenLoaiHopdong
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