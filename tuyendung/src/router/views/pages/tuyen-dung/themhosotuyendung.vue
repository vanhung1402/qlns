<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { required, email } from 'vuelidate/lib/validators'
import vue2Dropzone from 'vue2-dropzone'
import ListProfile from '@components/tuyen-dung/recruitment-profile-list'
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import { dateFilter } from 'vue-date-fns'

export default {
  page: {
    title: 'Tổng hợp hồ sơ tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  filters: {
    date: dateFilter,
  },
  components: {
    Layout,
    PageHeader,
    vueDropzone: vue2Dropzone,
    ListProfile,
    Multiselect,
  },
  data() {
    return {
      title: 'Tổng hợp hồ sơ',
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
          text: 'Tổng hợp hồ sơ',
          active: true,
        },
      ],
      icon: 'files-landscapes',
      submitted: false,
      form: {
        fullName: '',
        birthDay: '',
        gender: 1,
        email: '',
        phone: '',
        address: '',
        planDetail: null,
        file: '',
      },
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        maxFilesize: 0.5,
        maxFiles: 1,
        headers: { content: 'header value' },
      },
      dropzoneMessageClass: '',
      listProfiles: [],
      recruitmentPlanDetails: [],
      isUpdate: false,
      profileId: Date.now(),
    }
  },
  created() {
    this.loadListProfiles()
    this.loadrecruitmentPlanDetails()
  },
  methods: {
    async loadrecruitmentPlanDetails() {
      let promise = await axios
        .get('/api/tuyen-dung/list-recruitment-plan-detail-available')
        .catch((err) => {
          console.error(err)
        })

      if (promise.status === 200) {
        this.recruitmentPlanDetails = promise.data.map((detail) => {
          detail.titleSelect = `${detail.FK_iVitriCongviecID.sTenVitriCongviec} - ${detail.FK_iKehoachTuyendungID.sTieudeKehoach}`
          return detail
        })
      }
    },
    loadListProfiles() {
      axios
        .get('/api/tuyen-dung/list-profile', {})
        .then((res) => {
          if (res.status === 200) {
            this.listProfiles = res.data
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (this.$v.form.$pending || this.$v.form.$error || !this.form.planDetail)
        return false
      if (this.isUpdate) {
        this.handleUpdateProfile(this.profileId)
      } else {
        this.handleAddProfile()
      }
    },
    handleAddProfile() {
      this.profileId = Date.now()
      let newProfile = {
        profileId: this.profileId,
        fullName: this.form.fullName,
        lastName: this.getLastNameFromFullName(this.form.fullName),
        birthDay: this.convertDate(this.form.birthDay),
        gender: this.form.gender,
        phone: this.form.phone,
        email: this.form.email,
        address: this.form.address,
        planDetail: this.form.planDetail,
        createBy: this.$store.state.auth.currentUser.staff,
      }
      axios
        .post('/api/tuyen-dung/profile', newProfile)
        .then((res) => {
          console.log(res)
          if (res.data) {
            this.$toastr.success('Đã thêm hồ sơ tuyển dụng.', 'Thành công')
            this.loadListProfiles()
            this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi thêm hồ sơ tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    handleUpdateProfile(profileUpdateId) {
      let profileUpdate = {
        fullName: this.form.fullName,
        lastName: this.getLastNameFromFullName(this.form.fullName),
        birthDay: this.convertDate(this.form.birthDay),
        gender: this.form.gender,
        phone: this.form.phone,
        email: this.form.email,
        address: this.form.address,
        planDetail: this.form.planDetail,
      }
      axios
        .put('/api/tuyen-dung/profile/' + profileUpdateId, {
          params: {
            action: 'updateInfo',
            profileUpdate,
            updateBy: this.$store.state.auth.currentUser.staff,
          },
        })
        .then((res) => {
          if (res.data) {
            this.isUpdate = false
            this.$toastr.success('Đã cập nhật hồ sơ tuyển dụng.', 'Thành công')
            this.loadListProfiles()
            this.handleResetForm()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cập nhật hồ sơ tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    getLastNameFromFullName(fullName) {
      fullName = fullName.replaceAll('  ', ' ').split(' ')
      return [...fullName].pop()
    },
    convertDate(date) {
      date = date.split('/')
      let newDate = [date[1], date[0], date[2]]
      return newDate.join('/')
    },
    handleResetForm() {
      this.form = {
        fullName: '',
        birthDay: '',
        gender: 1,
        email: '',
        phone: '',
        address: '',
        planDetail: null,
      }
      this.submitted = false
    },
    afterComplete(file) {
      this.form.file = file.dataURL
      this.dropzoneMessageClass = 'has-files'
    },
    handleEditProfile(profileEdit) {
      let planDetail = {
        ...profileEdit.FK_iChitietKehoachTuyendungID,
        titleSelect:
          profileEdit.FK_iChitietKehoachTuyendungID.FK_iVitriCongviecID
            .sTenVitriCongviec +
          ' - ' +
          profileEdit.FK_iChitietKehoachTuyendungID.FK_iKehoachTuyendungID
            .sTieudeKehoach,
      }
      this.form = {
        fullName: profileEdit.sHotenUngvien,
        birthDay: dateFilter(
          new Date(profileEdit.dNgaysinhUngvien),
          'dd/MM/yyyy'
        ),
        gender: profileEdit.bGioitinhUngvien ? 1 : 0,
        email: profileEdit.sEmailUngvien,
        phone: profileEdit.sDienthoaiUngvien,
        address: profileEdit.sDiachiUngvien,
        planDetail: planDetail,
      }
      this.isUpdate = true
      this.profileId = profileEdit._id
      this.$refs.fullName.focus()
    },
    handleReloadList() {
      this.loadListProfiles()
    },
  },
  validations: {
    form: {
      fullName: { required },
      birthDay: { required },
      email: { required, email },
      phone: { required },
      address: { required },
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
          isUpdate ? 'Cập nhật hồ sơ' : 'Thêm hồ sơ'
        }}</h4>
        <br />
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-7">
              <div class="row">
                <div class="col-md-5">
                  <div class="form-group">
                    <label for="fullName"
                      >Họ và tên <span class="text-danger">*</span></label
                    >
                    <input
                      id="fullName"
                      ref="fullName"
                      v-model="form.fullName"
                      type="text"
                      name="fullName"
                      placeholder="VD: Bùi Văn Hùng"
                      :class="{
                        'is-invalid': submitted && $v.form.fullName.$error,
                      }"
                      class="form-control"
                    />
                    <div
                      v-if="submitted && !$v.form.fullName.required"
                      class="invalid-feedback"
                      >Vui lòng nhập họ tên ứng viên</div
                    >
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <label for="birthDay"
                      >Ngày sinh <span class="text-danger">*</span></label
                    >
                    <input
                      id="birthDay"
                      v-model="form.birthDay"
                      v-mask="'##/##/####'"
                      placeholder="dd/mm/yyyy"
                      type="text"
                      name="birthDay"
                      :class="{
                        'is-invalid': submitted && $v.form.birthDay.$error,
                      }"
                      class="form-control"
                    />
                    <div
                      v-if="submitted && !$v.form.birthDay.required"
                      class="invalid-feedback"
                      >Vui lòng nhập ngày sinh ứng viên</div
                    >
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <label for="gender">Giới tính: </label>
                    <div class="row">
                      <div class="col">
                        <div class="custom-control custom-radio">
                          <input
                            id="male"
                            v-model="form.gender"
                            value="1"
                            type="radio"
                            name="gender"
                            class="custom-control-input"
                          />
                          <label class="custom-control-label" for="male">
                            Nam
                          </label>
                        </div>
                      </div>
                      <div class="col">
                        <div class="custom-control custom-radio">
                          <input
                            id="female"
                            v-model="form.gender"
                            value="0"
                            type="radio"
                            name="gender"
                            class="custom-control-input"
                          />
                          <label class="custom-control-label" for="female">
                            Nữ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="form-group">
                    <label for="phone">
                      Số điện thoại
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model="form.phone"
                      v-mask="'####-###-###'"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid': submitted && $v.form.phone.$error,
                      }"
                      placeholder="VD: 0329-222-617"
                    />
                    <div
                      v-if="submitted && $v.form.phone.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.phone.required"
                        >Số điện thoại không được bỏ trống.</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-7">
                  <div class="form-group">
                    <label for="email">
                      Email
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      name="email"
                      class="form-control"
                      :class="{
                        'is-invalid': submitted && $v.form.email.$error,
                      }"
                      placeholder="VD: vanhung14.2.2017@gmail.com"
                    />
                    <div
                      v-if="submitted && $v.form.email.$error"
                      class="invalid-feedback"
                    >
                      <span v-if="!$v.form.email.required"
                        >Email không được bỏ trống.</span
                      >
                      <span v-if="!$v.form.email.email"
                        >Email không đúng định dạng.</span
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="address"
                      >Địa chỉ <span class="text-danger">*</span></label
                    >
                    <input
                      id="address"
                      ref="address"
                      v-model="form.address"
                      type="text"
                      name="address"
                      placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                      :class="{
                        'is-invalid': submitted && $v.form.address.$error,
                      }"
                      class="form-control"
                    />
                    <div
                      v-if="submitted && !$v.form.address.required"
                      class="invalid-feedback"
                      >Vui lòng nhập địa chỉ.</div
                    >
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label for="planDetail">
                      Vị trí công việc theo đợt tuyển dụng
                      <span class="text-danger">*</span>
                    </label>
                    <multiselect
                      id="planDetail"
                      v-model="form.planDetail"
                      name="planDetail"
                      label="titleSelect"
                      track-by="_id"
                      placeholder="Chọn vị trí công việc"
                      :show-labels="false"
                      :options="recruitmentPlanDetails"
                    ></multiselect>
                    <div
                      class="invalid-feedback"
                      :class="{
                        'invalid-feedback invalid-feedback-select':
                          submitted && !form.planDetail,
                      }"
                      >Vui lòng chọn vị trí công việc.</div
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-5">
              <vue-dropzone
                id="dropzone"
                ref="myVueDropzone"
                :options="dropzoneOptions"
                :use-custom-slot="true"
                :class="dropzoneMessageClass"
                @vdropzone-complete="afterComplete"
              >
                <div class="text-center">
                  <i class="h1 text-muted uil-cloud-upload"></i>
                  <h3>Kéo thả tệp hồ sơ ứng viên vào đây.</h3>
                </div>
              </vue-dropzone>
            </div>
            <div class="col-md-12">
              <div class="form-group text-center m-b-0">
                <button
                  v-if="!isUpdate"
                  class="btn btn-primary"
                  name="action"
                  value="them-ho-so"
                  type="submit"
                >
                  <i class="uil uil-plus"></i> Thêm hồ sơ</button
                >
                <button
                  v-if="isUpdate"
                  class="btn btn-primary"
                  name="action"
                  value="cap-nhat-ho-so"
                  type="submit"
                >
                  <i class="uil uil-arrow-to-bottom"></i> Cập nhật hồ sơ</button
                >
                <button
                  type="reset"
                  class="btn btn-secondary m-l-5 ml-1"
                  @click="handleResetForm"
                >
                  <i class="uil uil-multiply"></i> Hủy</button
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <ListProfile
      :profiles="listProfiles"
      :view-call="'themhoso'"
      @handleEditProfile="handleEditProfile"
      @handleReloadList="handleReloadList"
    />
  </Layout>
</template>

<style>
.vue-dropzone .dz-message {
  margin: 121px 0 !important;
}
.vue-dropzone.has-files {
  min-height: 340px;
}
.invalid-feedback.invalid-feedback-select {
  display: block;
}
.vue-dropzone.has-files .dz-message,
.vue-dropzone.has-files .dz-success-mark,
.vue-dropzone.has-files .dz-error-mark {
  display: none;
}
</style>