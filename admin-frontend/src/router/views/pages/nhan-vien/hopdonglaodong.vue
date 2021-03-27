<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import moment from 'moment'
import { dateFilter } from 'vue-date-fns'
import { required, minValue } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import LaborContractList from '@components/nhan-vien/LaborContractList'

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
    LaborContractList,
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
      isDisabledThoihan: false,
      isDisabledQuaTrinh: false,
      submitted: false,
      listJobPosition: {},
      listLaborContractType: [],
      listContractTerm: [],
      listWorkProcess: [],
      listSignedBy: [],
      listLaborContract: [],
      profile: {},
      datePicker: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
        maxDate: null,
      },
      dNgayCoHieulucConfig: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
        maxDate: null,
      },
      dNgayHethanConfig: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
        maxDate: null,
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
    this.loadListContract()
    this.loadProfile()
    this.loadWorkProcess()
    this.loadListSignedBy()
  },
  methods: {
    async loadWorkProcess() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      let listJobPosition = {}
      if (promise.status === 200 && promise.data) {
        promise.data.forEach((job) => {
          listJobPosition[job._id] = job
        })
        this.listJobPosition = listJobPosition
      }
      this.$staff
        .get(
          '/nhan-vien/qua-trinh-lam-viec?nhan-vien=' +
            this.$router.currentRoute.params.profileId
        )
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.listWorkProcess = res.data.map((work) => {
              work.viTriCongViec =
                listJobPosition[work.FK_iVitriCongviecID].sTenVitriCongviec +
                ' - ' +
                moment(String(work.dNgayBatdau)).format('DD/MM/YYYY') +
                (work.dNgayKethuc
                  ? ' - ' +
                    moment(String(work.dNgayKethuc)).format('DD/MM/YYYY')
                  : '')
              if (
                this.$router.currentRoute.params.workProcessId &&
                this.$router.currentRoute.params.workProcessId === work._id
              ) {
                this.form.FK_iQuatrinhLamviecID = work
                this.isDisabledQuaTrinh = true
                this.onChangeWorkProcess()
              }
              return work
            })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async loadProfile() {
      this.$staff
        .get(
          '/nhan-vien/ho-so?id=' + this.$router.currentRoute.params.profileId
        )
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.profile = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
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
    async loadListContract() {
      let promise = await this.$staff
        .get(
          '/nhan-vien/hop-dong?id=' + this.$router.currentRoute.params.profileId
        )
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        console.log(promise.data)
        this.listLaborContract = promise.data.filter((lb) => {
          return (
            lb.qt.FK_iNhanvienID === this.$router.currentRoute.params.profileId
          )
        })
      }
    },
    loadListSignedBy() {
      this.$recruitment
        .get('/api/nhan-vien/list-signed-by')
        .then((res) => {
          let listSignedBy = res.data.map((staff) => {
            staff.selectTitle = staff.sHoten
            return staff
          })
          this.listSignedBy = listSignedBy
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    handleSubmit() {
      this.submitted = true
      this.$v.form.$touch()
      if (
        this.$v.form.$pending ||
        this.$v.form.$error ||
        !this.form.FK_iLoaiHopdongID ||
        !this.form.FK_iQuatrinhLamviecID ||
        !this.form.FK_iNguoiKyID
      )
        return false
      if (this.isUpdate) {
        this.handleUpdate()
      } else {
        this.handleAddNew()
      }
    },
    getNewLaborContract() {
      let newLaborContract = { ...this.form }
      newLaborContract.FK_iNguoiKyID =
        newLaborContract.FK_iNguoiKyID._id
      newLaborContract.FK_iLoaiHopdongID =
        newLaborContract.FK_iLoaiHopdongID._id
      if (newLaborContract.FK_iThoihanHopdongID) {
        newLaborContract.FK_iThoihanHopdongID =
          newLaborContract.FK_iThoihanHopdongID._id
      }
      newLaborContract.FK_iQuatrinhLamviecID =
        newLaborContract.FK_iQuatrinhLamviecID._id

      if (!this.isValidDate(newLaborContract.dNgayCoHieuluc)) {
        newLaborContract.dNgayCoHieuluc = new Date(
          this.convertDate(newLaborContract.dNgayCoHieuluc)
        )
      }
      if (!this.isValidDate(newLaborContract.dNgayHetHan)) {
        newLaborContract.dNgayHetHan = new Date(
          this.convertDate(newLaborContract.dNgayHetHan)
        )
      }
      return newLaborContract
    },
    handleAddNew() {
      let newLaborContract = this.getNewLaborContract()
      newLaborContract.FK_iNguoiLapID = this.$store.state.auth.currentUser.staff
      newLaborContract.PK_iHopdongLaodongID = Date.now()

      this.$staff
        .post('/nhan-vien/hop-dong', { newLaborContract })
        .then((res) => {
          console.log(res)
          this.loadListContract()
        })
        .catch((err) => {
          console.error(err)
        })
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
    onChangeLaborContractType() {
      if (this.form.FK_iLoaiHopdongID.PK_iLoaiHopdongID === 1) {
        this.isDisabledThoihan = true
        this.form.dNgayHetHan = ''
        this.form.FK_iThoihanHopdongID = null
      } else {
        this.isDisabledThoihan = false
      }
    },
    convertDate(dateOld) {
      let date = dateOld.split('/')
      let newDate = [date[1], date[0], date[2]]
      return newDate.join('/')
    },
    isValidDate(date) {
      return date instanceof Date && !isNaN(date)
    },
    onChangeContractTerm() {
      this.dNgayHethanConfig.minDate = this.form.dNgayCoHieuluc

      if (!this.form.FK_iThoihanHopdongID) return false
      let ngayCoHieuLuc = new Date(
        this.isValidDate(this.form.dNgayCoHieuluc)
          ? this.form.dNgayCoHieuluc
          : this.convertDate(this.form.dNgayCoHieuluc)
      )
      let ngayHetHan = new Date(ngayCoHieuLuc)
      switch (this.form.FK_iThoihanHopdongID.sKieuThoihan) {
        case 'month': {
          ngayHetHan.setMonth(
            ngayHetHan.getMonth() +
              this.form.FK_iThoihanHopdongID.iGiatriThoihan
          )
          break
        }
        case 'year': {
          ngayHetHan.setFullYear(
            ngayHetHan.getFullYear() +
              this.form.FK_iThoihanHopdongID.iGiatriThoihan
          )
          break
        }
        default:
          break
      }
      ngayHetHan.setDate(ngayHetHan.getDate() - 1)
      this.form.dNgayHetHan = ngayHetHan
      this.dNgayHethanConfig.minDate = this.form.dNgayCoHieuluc
      this.dNgayHethanConfig.minDate.setDate(this.dNgayHethanConfig.minDate.getDate() + 1)
      console.log(this.dNgayHethanConfig)
    },
    onChangeWorkProcess() {
      if (this.form.FK_iQuatrinhLamviecID) {
        let ngayCoHieuLuc = new Date(
          this.form.FK_iQuatrinhLamviecID.dNgayBatdau
        )
        this.dNgayCoHieulucConfig.minDate = ngayCoHieuLuc
        this.form.dNgayCoHieuluc = ngayCoHieuLuc

        if (this.form.FK_iQuatrinhLamviecID.dNgayKethuc){
          let ngayHetHan = new Date(
            this.form.FK_iQuatrinhLamviecID.dNgayKethuc
          )
          this.dNgayCoHieulucConfig.maxDate = ngayHetHan
          this.dNgayHethanConfig.maxDate = ngayHetHan
          this.form.dNgayHetHan = ngayHetHan
        }
      }
    },
  },
  validations: {
    form: {
      sTenHopdong: { required },
      sSoHopdong: { required },
      dNgayKy: { required },
      dNgayCoHieuluc: { required },
      iLuongCoban: { required, minValue: minValue(0) },
      iLuongDongBaohiem: { required, minValue: minValue(0) },
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
            <div class="col-md-5 form-group">
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
                @input="onChangeLaborContractType"
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
            <div class="col-md-3 form-group">
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
                :disabled="isDisabledThoihan"
                :show-labels="false"
                :options="listContractTerm"
                @input="onChangeContractTerm"
              ></multiselect>
              <div
                class="invalid-feedback"
                :class="{
                  'invalid-feedback invalid-feedback-select':
                    submitted &&
                    !form.FK_iThoihanHopdongID &&
                    !isDisabledThoihan,
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
                :config="dNgayCoHieulucConfig"
                class="form-control"
                placeholder="Chọn thời gian"
                :class="{
                  'is-invalid': submitted && $v.form.dNgayCoHieuluc.$error,
                }"
                @input="onChangeContractTerm"
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
                ref="ngay_het_han"
                v-model="form.dNgayHetHan"
                :config="dNgayHethanConfig"
                :disabled="isDisabledThoihan"
                class="form-control"
                :placeholder="
                  isDisabledThoihan ? 'Không khả dụng' : 'Chọn thời gian'
                "
              ></flat-pickr>
            </div>
            <div class="col-md-4 form-group">
              <label>Họ và tên NLĐ</label>
              <div class="form-control">
                {{ profile.sHoten }}
              </div>
            </div>
            <div class="col-md-2 form-group">
              <label>Mã nhân viên</label>
              <div class="form-control">
                {{ profile.sMaNhanvien }}
              </div>
            </div>
            <div class="col-md-6 form-group">
              <label for="qua-trinh-lam-viec">
                Vị trí công việc
                <span class="text-danger">*</span>
              </label>
              <multiselect
                id="qua-trinh-lam-viec"
                v-model="form.FK_iQuatrinhLamviecID"
                name="qua-trinh-lam-viec"
                label="viTriCongViec"
                track-by="_id"
                placeholder="Chọn vị trí công việc"
                :show-labels="false"
                :options="listWorkProcess"
                :disabled="isDisabledQuaTrinh"
                @input="onChangeWorkProcess"
              ></multiselect>
              <div
                class="invalid-feedback"
                :class="{
                  'invalid-feedback invalid-feedback-select':
                    submitted && !form.FK_iQuatrinhLamviecID,
                }"
                >Vui lòng chọn Vị trí công việc.</div
              >
            </div>
            <div class="col-md-3 form-group">
              <label for="luong-co-ban"
                >Lương cơ bản <span class="text-danger">*</span></label
              >
              <input
                id="luong-co-ban"
                v-model="form.iLuongCoban"
                type="text"
                class="form-control"
                placeholder="VD: 10.000.000"
                :class="{
                  'is-invalid': submitted && $v.form.iLuongCoban.$error,
                }"
              />
              <div
                v-if="submitted && !$v.form.iLuongCoban.required"
                class="invalid-feedback"
                >Lương cơ bản không được bỏ trống</div
              >
              <div
                v-if="submitted && !$v.form.iLuongCoban.minValue"
                class="invalid-feedback"
                >Lương cơ bản không hợp lệ</div
              >
            </div>
            <div class="col-md-3 form-group">
              <label for="luong-dong-bao-hiem"
                >Lương đóng bảo hiểm <span class="text-danger">*</span></label
              >
              <input
                id="luong-dong-bao-hiem"
                v-model="form.iLuongDongBaohiem"
                type="text"
                class="form-control"
                placeholder="VD: 5.000.000"
                :class="{
                  'is-invalid': submitted && $v.form.iLuongDongBaohiem.$error,
                }"
              />
              <div
                v-if="submitted && !$v.form.iLuongDongBaohiem.required"
                class="invalid-feedback"
                >Lương đóng BH không được bỏ trống</div
              >
              <div
                v-if="submitted && !$v.form.iLuongDongBaohiem.minValue"
                class="invalid-feedback"
                >Lương đóng BH không hợp lệ</div
              >
            </div>
            <div class="col-md-6 form-group">
              <label for="nguoi-ky">
                Người ký
                <span class="text-danger">*</span>
              </label>
              <multiselect
                id="nguoi-ky"
                v-model="form.FK_iNguoiKyID"
                name="nguoi-ky"
                label="selectTitle"
                track-by="_id"
                placeholder="Chọn người ký"
                :show-labels="false"
                :options="listSignedBy"
              ></multiselect>
              <div
                class="invalid-feedback"
                :class="{
                  'invalid-feedback invalid-feedback-select':
                    submitted && !form.FK_iNguoiKyID,
                }"
                >Vui lòng chọn Người ký.</div
              >
            </div>
            <div class="col-md-6 form-group">
              <label for="ghi-chu">Ghi chú</label>
              <input
                id="ghi-chu"
                type="text"
                class="form-control"
                placeholder="..."
              />
            </div>
            <div class="col-md-6 form-group">
              <label for="tep-dinh-kem">Tệp đính kèm</label>
              <input id="tep-dinh-kem" type="file" class="form-control" />
            </div>
          </div>
          <div class="form-group text-center mt-2">
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
    <LaborContractList :list-labor-contract="listLaborContract" />
  </Layout>
</template>
<style>
.invalid-feedback.invalid-feedback-select {
  display: block;
}
</style>