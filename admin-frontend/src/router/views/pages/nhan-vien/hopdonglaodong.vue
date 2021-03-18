<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
// import moment from 'moment'
import { dateFilter } from 'vue-date-fns'
import { required, minValue } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'

export default {
  page: {
    title: 'Hợp đồng lao động',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  filters: {
    date: dateFilter,
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
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
      btnSubmitTitle: 'Lập hợp đồng',
      iconBtnSubmit: 'plus',
      isUpdate: false,
      submitted: false,
      listLaborContractType: [],
      listContractTerm: [],
      datePicker: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
      },
      form: {
        sTenHopdong: '',
        sSoHopdong: '',
        FK_iLoaiHopdongID: null,
        FK_iThoihanHopdongID: null,
        dNgayKy: new Date(),
        dNgayCoHieuluc: new Date(),
        dNgayHetHan: '',
        FK_iQuatrinhLamviecID: null,
        iLuongCoban: 0,
        iLuongDongBaohiem: 0,
        FK_iNguoiKyID: null,
        sGhichu: '',
        sTepDinhkem: '',
      },
    }
  },
  created() {
    this.loadListLaborContractType()
    this.loadListContractTerm()
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
    async loadListContractTerm() {
      let promise = await this.$recruitment
        .get('/api/danh-muc/list-contract-term')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listContractTerm = promise.data
      }
    },
    handleSubmit() {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error) return false
    },
    handleResetForm() {
      this.form = {
        sTenHopdong: '',
        sSoHopdong: '',
        FK_iLoaiHopdongID: null,
        FK_iThoihanHopdongID: null,
        dNgayKy: new Date(),
        dNgayCoHieuluc: new Date(),
        dNgayHetHan: '',
        FK_iQuatrinhLamviecID: null,
        iLuongCoban: 0,
        iLuongDongBaohiem: 0,
        FK_iNguoiKyID: null,
        sGhichu: '',
        sTepDinhkem: '',
      }

      this.submitted = false
      this.isUpdate = false
    },
  },
  validations: {
    form: {
      sTenHopdong: { required },
      sSoHopdong: { required },
      dNgayKy: { required },
      dNgayCoHieuluc: { required },
      iLuongCoban: { minValue: minValue(0) },
      iLuongDongBaohiem: { minValue: minValue(0) },
    },
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
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-8 form-group">
              <label for="ten-hop-dong"
                >Tên hợp đồng <span class="text-danger">*</span></label
              >
              <input
                id="ten-hop-dong"
                ref="ten_hop_dong"
                v-model="form.sTenHopdong"
                type="text"
                class="form-control"
                placeholder="VD: Hợp đồng lao động"
                :class="{
                  'is-invalid': submitted && $v.form.sTenHopdong.$error,
                }"
              />
              <div
                v-if="submitted && !$v.form.sTenHopdong.required"
                class="invalid-feedback"
                >Chưa nhập Tên hợp đồng</div
              >
            </div>
            <div class="col-md-2 form-group">
              <label for="so-hop-dong"
                >Số hợp đồng <span class="text-danger">*</span></label
              >
              <input
                id="so-hop-dong"
                ref="ten_hop_dong"
                v-model="form.sSoHopdong"
                type="text"
                class="form-control"
                placeholder="VD: HĐ3006"
                :class="{
                  'is-invalid': submitted && $v.form.sSoHopdong.$error,
                }"
              />
              <div
                v-if="submitted && !$v.form.sSoHopdong.required"
                class="invalid-feedback"
                >Chưa nhập Số hợp đồng</div
              >
            </div>
            <div class="col-md-2 form-group">
              <label for="ngay-ky">
                Ngày ký <span class="text-danger">*</span>
              </label>
              <flat-pickr
                id="ngay-ky"
                v-model="form.dNgayKy"
                :config="datePicker"
                class="form-control"
                placeholder="Chọn thời gian"
                :class="{
                  'is-invalid': submitted && $v.form.dNgayKy.$error,
                }"
              ></flat-pickr>
              <div
                v-if="submitted && !$v.form.dNgayKy.required"
                class="invalid-feedback"
                >Vui lòng chọn ngày ký hợp đồng</div
              >
            </div>
            <div class="col-md-4 form-group">
              <label for="loai-hop-dong">
                Loại hợp đồng
                <span class="text-danger">*</span>
              </label>
              <multiselect
                id="loai-hop-dong"
                v-model="form.FK_iLoaiHopdongID"
                name="loai-hop-dong"
                label="sTenLoaiHopdong"
                track-by="_id"
                placeholder="Chọn loại hợp đồng"
                :show-labels="false"
                :options="listLaborContractType"
              ></multiselect>
              <div
                class="invalid-feedback"
                :class="{
                  'invalid-feedback invalid-feedback-select':
                    submitted && !form.FK_iLoaiHopdongID,
                }"
                >Vui lòng chọn Loại hợp đồng.</div
              >
            </div>
            <div class="col-md-4 form-group">
              <label for="thoi-han-hop-dong">
                Thời hạn hợp đồng
                <span class="text-danger">*</span>
              </label>
              <multiselect
                id="thoi-han-hop-dong"
                v-model="form.FK_iThoihanHopdongID"
                name="thoi-han-hop-dong"
                label="sTenThoihanHopdong"
                track-by="_id"
                placeholder="Chọn Thời hạn hợp đồng"
                :show-labels="false"
                :options="listContractTerm"
              ></multiselect>
              <div
                class="invalid-feedback"
                :class="{
                  'invalid-feedback invalid-feedback-select':
                    submitted && !form.FK_iThoihanHopdongID,
                }"
                >Vui lòng chọn Thời hạn hợp đồng.</div
              >
            </div>
            <div class="col-md-2 form-group">
              <label for="ngay-co-hieu-luc">
                Ngày có hiệu lực <span class="text-danger">*</span>
              </label>
              <flat-pickr
                id="ngay-co-hieu-luc"
                v-model="form.dNgayCoHieuluc"
                :config="datePicker"
                class="form-control"
                placeholder="Chọn thời gian"
                :class="{
                  'is-invalid': submitted && $v.form.dNgayCoHieuluc.$error,
                }"
              ></flat-pickr>
              <div
                v-if="submitted && !$v.form.dNgayCoHieuluc.required"
                class="invalid-feedback"
                >Vui lòng chọn Ngày có hiệu lực</div
              >
            </div>
            <div class="col-md-2 form-group">
              <label for="ngay-het-han">Ngày hết hạn</label>
              <flat-pickr
                id="ngay-het-han"
                v-model="form.dNgayHetHan"
                :config="datePicker"
                class="form-control"
                placeholder="Chọn thời gian"
              ></flat-pickr>
            </div>
          </div>
          <div class="form-group text-center m-b-0">
            <button class="btn btn-primary" name="action" type="submit">
              <i :class="'uil uil-' + iconBtnSubmit"></i>
              {{ btnSubmitTitle }}</button
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
  </Layout>
</template>
<style>
.invalid-feedback.invalid-feedback-select {
  display: block;
}
</style>