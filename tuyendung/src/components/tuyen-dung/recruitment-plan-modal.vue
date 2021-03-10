<script>
import Multiselect from 'vue-multiselect'
import { required, minValue, numeric } from 'vuelidate/lib/validators'
import { dateFilter } from 'vue-date-fns'
import axios from 'axios'

export default {
  components: { Multiselect },
  filters: {
    date: dateFilter,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: () => {
        return {
          title: 'Chi tiết kế hoạch tuyển dụng',
          data: {},
        }
      },
    },
  },
  data() {
    return {
      planDetailModalTitle: this.detail.title,
      jobPositions: [],
      recruitmentPostTypes: [],
      isShowDetailPlanModal: this.show,
      formDetailPlan: {
        jobPosition: '',
        amount: 1,
        reason: '',
        recruitmentType: '',
        expectedSalary: 0,
        estimatedCost: 0,
      },
      submitDetailPlan: false,
      dateConfig: {
        mode: 'range',
      },
      isShow: true,
      thoiGianNhanHoSo: [],
      thoiGianDuyetHoSo: [],
      thoiGianPhongVan: [],
    }
  },
  watch: {
    show: function (newVal) {
      this.isShowDetailPlanModal = newVal
      if (newVal) {
        this.planDetailModalTitle = this.detail.title
        this.formDetailPlan = {
          jobPosition: this.detail.data.viTricongViec,
          amount: this.detail.data.soLuong,
          reason: this.detail.data.lyDoTuyen,
          recruitmentType: this.detail.data.hinhThucDangTuyen,
          expectedSalary: this.detail.data.mucLuongDukien,
          estimatedCost: this.detail.data.kinhPhiDuKien,
        }
        if (this.detail.data.thoiGianNhanHoSo) {
          this.thoiGianNhanHoSo = this.detail.data.thoiGianNhanHoSo.join(' to ')
          this.thoiGianDuyetHoSo = this.detail.data.thoiGianDuyetHoSo.join(' to ')
          this.thoiGianPhongVan = this.detail.data.thoiGianPhongVan.join(' to ')
        }
      }
    },
  },
  created(){
    this.loadJobPosition()
    this.loadRecruitmentPostTypes()
  },
  methods: {
    async loadJobPosition(){
      let promise = await axios
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.jobPositions = promise.data
      }
    },
    async loadRecruitmentPostTypes(){
      let promise = await axios
        .get('/api/danh-muc/list-recruitment-post-type')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.recruitmentPostTypes = promise.data
      }
    },
    handleDetailPlanSubmit(e) {
      this.submitDetailPlan = true
      this.$v.formDetailPlan.$touch()
      if (this.$v.formDetailPlan.$pending || this.$v.formDetailPlan.$error)
        return false

      this.getValueDetail()
    },
    handleResetFormDetailPlan() {
      this.formDetailPlan = {}
      this.submitDetailPlan = false
    },
    onCloseModal() {
      this.$emit('handleCloseModal')
    },
    onSubmitForm(data) {
      this.$emit('handleSubmitFormDetailPlan', data)
    },
    getValueDetail() {
      let detailPlanForm = {
        viTricongViec: this.formDetailPlan.jobPosition,
        soLuong: this.formDetailPlan.amount,
        lyDoTuyen: this.formDetailPlan.reason,
        mucLuongDukien: this.formDetailPlan.expectedSalary,
        thoiGianNhanHoSo: this.thoiGianNhanHoSo.split(' to '),
        thoiGianDuyetHoSo: this.thoiGianDuyetHoSo.split(' to '),
        thoiGianPhongVan: this.thoiGianPhongVan.split(' to '),
        hinhThucDangTuyen: this.formDetailPlan.recruitmentType,
        kinhPhiDuKien: this.formDetailPlan.estimatedCost,
      }
      this.onSubmitForm(detailPlanForm)
    },
  },
  validations: {
    formDetailPlan: {
      jobPosition: { required },
      amount: { required, minValue: minValue(1), numeric },
      recruitmentType: { required },
      expectedSalary: { required, minValue: minValue(0), numeric },
      estimatedCost: { required, minValue: minValue(0), numeric },
    },
  },
}
</script>

<template>
  <b-modal
    id="modal-detail-plan"
    v-model="isShowDetailPlanModal"
    centered
    title-class="font-18"
    hide-footer
    size="xl"
    :title="planDetailModalTitle"
    @hide="onCloseModal"
  >
    <form method="post" @submit.prevent="handleDetailPlanSubmit">
      <div class="row">
        <div class="col-md">
          <div class="form-group">
            <label for="jobPosition">
              Vị trí công việc
              <span class="text-danger">*</span>
            </label>
            <multiselect
              id="jobPosition"
              v-model="formDetailPlan.jobPosition"
              name="jobPosition"
              label="sTenVitriCongviec"
              track-by="_id"
              placeholder="Chọn vị trí công việc"
              :show-labels="false"
              :class="{
                'is-invalid':
                  submitDetailPlan && $v.formDetailPlan.jobPosition.$error,
              }"
              :options="jobPositions"
            ></multiselect>
            <div
              v-if="submitDetailPlan && !$v.formDetailPlan.jobPosition.required"
              class="invalid-feedback"
              >Vui lòng chọn vị trí công việc.</div
            >
          </div>
        </div>
        <div class="col-md-1">
          <div class="form-group">
            <label id="amount">
              S.lượng
              <span class="text-danger">*</span>
            </label>
            <input
              id="amount"
              v-model="formDetailPlan.amount"
              type="number"
              name="amount"
              class="form-control"
              autocomplete="off"
              :class="{
                'is-invalid':
                  submitDetailPlan && $v.formDetailPlan.amount.$error,
              }"
            />
            <div
              v-if="submitDetailPlan && $v.formDetailPlan.amount.$error"
              class="invalid-feedback"
            >
              <span v-if="!$v.formDetailPlan.amount.required"
                >Vui lòng nhập số lượng dự kiến.</span
              >
              <span
                v-if="
                  !$v.formDetailPlan.amount.minValue ||
                  !$v.formDetailPlan.amount.numeric
                "
                >Số lượng dự kiến cần là số nguyên dương lớn hơn 0.</span
              >
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label id="expectedSalary">
              Mức lương dự kiến
              <span class="text-danger">*</span>
            </label>
            <input
              id="expectedSalary"
              v-model="formDetailPlan.expectedSalary"
              type="number"
              name="expectedSalary"
              class="form-control"
              autocomplete="off"
              :class="{
                'is-invalid':
                  submitDetailPlan && $v.formDetailPlan.expectedSalary.$error,
              }"
            />
            <div
              v-if="submitDetailPlan && $v.formDetailPlan.expectedSalary.$error"
              class="invalid-feedback"
            >
              <span v-if="!$v.formDetailPlan.expectedSalary.required"
                >Vui lòng nhập mức lương dự kiến.</span
              >
              <span
                v-if="
                  !$v.formDetailPlan.expectedSalary.minValue ||
                  !$v.formDetailPlan.expectedSalary.numeric
                "
                >Mức lương dự kiến cần là số nguyên dương.</span
              >
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="form-group">
            <label for="recruitmentType">
              H.thức đăng tuyển
              <span class="text-danger">*</span>
            </label>
            <multiselect
              id="recruitmentType"
              v-model="formDetailPlan.recruitmentType"
              name="recruitmentType"
              label="sTenHinhthucDangtuyen"
              track-by="_id"
              placeholder="Chọn hình thức..."
              :show-labels="false"
              :class="{
                'is-invalid':
                  submitDetailPlan && $v.formDetailPlan.recruitmentType.$error,
              }"
              :options="recruitmentPostTypes"
            ></multiselect>
            <div
              v-if="
                submitDetailPlan && !$v.formDetailPlan.recruitmentType.required
              "
              class="invalid-feedback"
              >Vui lòng chọn hình thức đăng tuyển.</div
            >
          </div>
        </div>
        <div class="col-md">
          <div class="form-group">
            <label id="amount"> Lý do tuyển </label>
            <input
              id="reason"
              v-model="formDetailPlan.reason"
              type="text"
              name="reason"
              class="form-control"
              autocomplete="off"
              placeholder="VD: Thay nhân viên nghỉ..."
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md">
          <div class="form-group">
            <label id="thoiGianNhanHoSo">
              Thời gian nhận hồ sơ
              <span class="text-danger">*</span>
            </label>
            <flat-pickr
              id="thoiGianNhanHoSo"
              v-model="thoiGianNhanHoSo"
              class="form-control"
              :config="dateConfig"
              name="date"
            ></flat-pickr>
          </div>
        </div>
        <div class="col-md">
          <div class="form-group">
            <label id="thoiGianDuyetHoSo">
              Thời gian duyệt hồ sơ
              <span class="text-danger">*</span>
            </label>
            <flat-pickr
              id="thoiGianDuyetHoSo"
              v-model="thoiGianDuyetHoSo"
              class="form-control"
              :config="dateConfig"
              name="date"
            ></flat-pickr>
          </div>
        </div>
        <div class="col-md">
          <div class="form-group">
            <label id="thoiGianPhongVan">
              Thời gian phỏng vấn
              <span class="text-danger">*</span>
            </label>
            <flat-pickr
              id="thoiGianPhongVan"
              v-model="thoiGianPhongVan"
              class="form-control"
              :config="dateConfig"
              name="date"
            ></flat-pickr>
          </div>
        </div>
        <div class="col-md">
          <div class="form-group">
            <label id="estimatedCost">
              Kinh phí dự kiến
              <span class="text-danger">*</span>
            </label>
            <input
              id="estimatedCost"
              v-model="formDetailPlan.estimatedCost"
              type="number"
              name="estimatedCost"
              class="form-control"
              autocomplete="off"
              :class="{
                'is-invalid':
                  submitDetailPlan && $v.formDetailPlan.estimatedCost.$error,
              }"
            />
            <div
              v-if="submitDetailPlan && $v.formDetailPlan.estimatedCost.$error"
              class="invalid-feedback"
            >
              <span v-if="!$v.formDetailPlan.estimatedCost.required"
                >Vui lòng nhập kinh phí dự kiến.</span
              >
              <span
                v-if="
                  !$v.formDetailPlan.estimatedCost.minValue ||
                  !$v.formDetailPlan.estimatedCost.numeric
                "
                >Kinh phí dự kiến cần là số nguyên dương.</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="form-group text-center m-b-0">
        <button
          class="btn btn-primary"
          name="action"
          value="them-chi-tiet"
          type="submit"
        >
          <i class="uil uil-check"></i> Xác nhận</button
        >
        <button
          type="reset"
          class="btn btn-secondary m-l-5 ml-1"
          @click="handleResetFormDetailPlan"
        >
          <i class="uil uil-multiply"></i> Hủy</button
        >
      </div>
    </form>
  </b-modal>
</template>