<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import VueAvatarEditor from '@components/nhan-vien/VueAvatarEditor'
import StaffProfileList from '@components/nhan-vien/staffProfileList'
import { required, email } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { VueEditor } from 'vue2-editor'
import moment from 'moment'

export default {
  page: {
    title: 'Quản lý sơ yêu lý lịch',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    VueAvatarEditor,
    Multiselect,
    VueEditor,
    StaffProfileList,
  },
  data() {
    return {
      title: 'Hồ sơ nhân viên',
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
          text: 'Hồ sơ nhân viên',
          active: true,
        },
      ],
      icon: 'users-alt',
      isUpdate: false,
      submitted: false,
      listNation: [],
      listReligion: [],
      listJobPosition: [],
      listStaffProfile: [],
      formStaff: {
        sMaNhanvien: '',
        sHoten: '',
        dNgaysinh: '',
        sNoisinh: '',
        bGioitinh: 1,
        sNguyenquan: '',
        sDiachi: '',
        sDienthoai: '',
        sEmail: '',
        sCMND: '',
        dNgaycapCMND: '',
        sNoicapCMND: '',
        sTrinhdoVanhoa: '',
        sMasothue: '',
        FK_iDantocID: null,
        FK_iTongiaoID: null,
        sMotaBanthan: '',
        sDuongdanSoyeuLylich: '',
        sDuongdanAnhdaidien: '',
      },
      formWorkProcess: {
        FK_iVitriCongviecID: null,
        dNgayBatdau: '',
        dNgayKethuc: '',
      },
      profileUpdateId: 0,
    }
  },
  created() {
    this.loadNation()
    this.loadResligion()
    this.loadJobPosition()
    this.loadListStaffProfile()
  },
  methods: {
    async loadListStaffProfile() {
      this.$staff
        .get('/nhan-vien/danh-sach')
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.listStaffProfile = res.data.map((profile) => {
              let pro = profile.thongtin 
              pro.vitri = this.listJobPosition.find(job => {
                return (profile.quatrinhlamviec && job._id === profile.quatrinhlamviec.FK_iVitriCongviecID)
              })
              return pro
            })
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async loadNation() {
      this.$staff
        .get('/danh-muc/list-nation')
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.listNation = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async loadResligion() {
      this.$staff
        .get('/danh-muc/list-religion')
        .then((res) => {
          if (res.status === 200 && res.data) {
            this.listReligion = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async loadJobPosition() {
      let promise = await this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .catch((err) => {
          console.error(err)
        })
      if (promise.status === 200) {
        this.listJobPosition = promise.data
      }
    },
    saveClicked(img) {
      let linkAvatar = img.toDataURL()
      this.formStaff.sDuongdanAnhdaidien = linkAvatar.split(',')[1]
    },
    changeAvatar(e) {
      console.log(e[0])
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.formStaff.$touch()
      if (
        this.$v.formStaff.$pending ||
        this.$v.formStaff.$error ||
        !this.formStaff.FK_iDantocID ||
        !this.formStaff.FK_iTongiaoID ||
        !this.checkAvailableDate(this.formStaff.dNgaysinh, new Date(), '<') ||
        !this.checkAvailableDate(this.formStaff.dNgaycapCMND, new Date(), '<')
      )
        return false
      if (
        !this.isUpdate &&
        (!this.formWorkProcess.FK_iVitriCongviecID ||
          !this.checkAvailableDate(this.formWorkProcess.dNgayBatdau) ||
          (this.formWorkProcess.dNgayKethuc &&
            !this.checkAvailableDate(
              this.formWorkProcess.dNgayKethuc,
              new Date(),
              '>='
            )))
      )
        return false
      if (this.isUpdate) {
        this.handleUpdateStaff()
      } else {
        this.handleAddNewStaff()
      }
    },
    getNewStaff() {
      let newStaff = { ...this.formStaff }
      newStaff.FK_iDantocID = this.formStaff.FK_iDantocID._id
      newStaff.FK_iTongiaoID = this.formStaff.FK_iTongiaoID._id
      newStaff.sTen = this.getLastNameFromFullName(newStaff.sHoten)
      newStaff.dNgaysinh = new Date(
        this.convertDate(newStaff.dNgaysinh)
      ).toISOString()
      newStaff.dNgaycapCMND = new Date(
        this.convertDate(newStaff.dNgaycapCMND)
      ).toISOString()
      return newStaff
    },
    handleAddNewStaff() {
      let newStaff = this.getNewStaff()
      newStaff.PK_iNhanvienID = Date.now()
      newStaff.FK_iNguoithemID = this.$store.state.auth.currentUser.staff

      const staffWorkProcess = { ...this.formWorkProcess }
      staffWorkProcess.PK_iQuatrinhLamviecID = Date.now()
      staffWorkProcess.FK_iNguoiChuyenID = this.$store.state.auth.currentUser.staff
      staffWorkProcess.tThoigianChuyen = new Date().toISOString()
      staffWorkProcess.FK_iVitriCongviecID =
        staffWorkProcess.FK_iVitriCongviecID._id
      staffWorkProcess.dNgayBatdau = new Date(
        this.convertDate(staffWorkProcess.dNgayBatdau)
      ).toISOString()
      if (staffWorkProcess.dNgayKethuc) {
        staffWorkProcess.dNgayKethuc = new Date(
          this.convertDate(staffWorkProcess.dNgayKethuc)
        ).toISOString()
      }

      this.$staff
        .post('/nhan-vien/ho-so', {
          staffData: newStaff,
          staffWorkProcess,
        })
        .then((res) => {
          console.log(res)
          this.loadListStaffProfile()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleUpdateStaff() {
      let newStaff = this.getNewStaff()
      newStaff.FK_iNguoicapnhatID = this.$store.state.auth.currentUser.staff

      this.$staff
        .put('/nhan-vien/ho-so?id=' + this.profileUpdateId, {
          staffData: newStaff,
        })
        .then((res) => {
          console.log(res)
          this.loadListStaffProfile()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    convertDate(date) {
      date = date.split('/')
      let newDate = [date[1], date[0], date[2]]
      return newDate.join('/')
    },
    getLastNameFromFullName(fullName) {
      fullName = fullName.replaceAll('  ', ' ').split(' ')
      return [...fullName].pop()
    },
    checkAvailableDate(dateString, dateCompare = null, condition = null) {
      let newDate = this.convertDate(dateString)
      newDate = new Date(newDate)

      if (newDate instanceof Date && !isNaN(newDate)) {
        if (dateCompare !== null) {
          switch (condition) {
            case '>':
              return newDate > dateCompare
            case '>=':
              return newDate >= dateCompare
            case '=':
              return newDate === dateCompare
            case '<':
              return newDate < dateCompare
            case '<=':
              return newDate <= dateCompare
            default:
              return false
          }
        }
        return true
      }

      return false
    },
    handleResetForm() {
      this.formStaff = {
        sMaNhanvien: '',
        sHoten: '',
        dNgaysinh: '',
        sNoisinh: '',
        bGioitinh: 1,
        sNguyenquan: '',
        sDiachi: '',
        sDienthoai: '',
        sEmail: '',
        sCMND: '',
        dNgaycapCMND: '',
        sNoicapCMND: '',
        sTrinhdoVanhoa: '',
        sMasothue: '',
        FK_iDantocID: '',
        FK_iTongiaoID: '',
        sMotaBanthan: '',
        sDuongdanSoyeuLylich: '',
        sDuongdanAnhdaidien: '',
      }

      this.formWorkProcess = {
        FK_iVitriCongviecID: null,
        dNgayBatdau: '',
        dNgayKethuc: '',
      }

      this.isUpdate = false
      this.submitted = false
      // this.loadListStaffProfile()
    },
    handleBtnEditProfileClick(profileEdit) {
      this.isUpdate = true
      this.$refs.ma_nhan_vien.focus()
      let {
        sMaNhanvien,
        sHoten,
        dNgaysinh,
        sNoisinh,
        bGioitinh,
        sNguyenquan,
        sDiachi,
        sDienthoai,
        sEmail,
        sCMND,
        dNgaycapCMND,
        sNoicapCMND,
        sTrinhdoVanhoa,
        sMasothue,
        sMotaBanthan,
        sDuongdanSoyeuLylich,
        sDuongdanAnhdaidien,
      } = profileEdit

      this.formStaff = {
        sMaNhanvien,
        sHoten,
        sNoisinh,
        bGioitinh,
        sNguyenquan,
        sDiachi,
        sDienthoai,
        sEmail,
        sCMND,
        sNoicapCMND,
        sTrinhdoVanhoa,
        sMasothue,
        sMotaBanthan,
        sDuongdanSoyeuLylich,
        sDuongdanAnhdaidien,
      }
      this.formStaff.dNgaysinh = moment(String(dNgaysinh)).format('DD/MM/YYYY')
      this.formStaff.dNgaycapCMND = moment(String(dNgaycapCMND)).format(
        'DD/MM/YYYY'
      )
      this.formStaff.FK_iDantocID = this.listNation.find((nation) => {
        return nation._id === profileEdit.FK_iDantocID
      })

      this.formStaff.FK_iTongiaoID = this.listReligion.find((religion) => {
        return religion._id === profileEdit.FK_iTongiaoID
      })

      this.profileUpdateId = profileEdit._id
    },
  },
  validations: {
    formStaff: {
      sMaNhanvien: { required },
      sHoten: { required },
      sNoisinh: { required },
      sNguyenquan: { required },
      sDiachi: { required },
      sDienthoai: { required },
      sEmail: { required, email },
      sCMND: { required },
      sNoicapCMND: { required },
      sTrinhdoVanhoa: { required },
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
          isUpdate ? 'Cập nhật nhân viên' : 'Thêm nhân viên'
        }}</h4>
        <hr />
        <form @submit.prevent="handleSubmit">
          <div class="row-flex">
            <div class="avatar-container">
              <vue-avatar-editor
                :width="200"
                :height="200"
                :has-rotation="true"
                :has-scale="true"
                :finish-text="'Cắt ảnh'"
                @finished="saveClicked"
                @select-file="changeAvatar($event)"
              />
            </div>
            <div>
              <div class="row">
                <div class="col-xl-3 col-lg-4 form-group">
                  <label for="ma-nhan-vien"
                    >Mã nhân viên <span class="text-danger">*</span></label
                  >
                  <input
                    id="ma-nhan-vien"
                    ref="ma_nhan_vien"
                    v-model="formStaff.sMaNhanvien"
                    type="text"
                    class="form-control"
                    placeholder="VD: HC3006"
                    autofocus="true"
                    :class="{
                      'is-invalid':
                        submitted && $v.formStaff.sMaNhanvien.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sMaNhanvien.required"
                    class="invalid-feedback"
                    >Chưa nhập mã nhân viên</div
                  >
                </div>
                <div class="col-lg-6 col-xl-4 form-group">
                  <label for="ho-ten"
                    >Họ tên <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="formStaff.sHoten"
                    type="text"
                    class="form-control"
                    placeholder="VD: Bùi Văn Hùng"
                    :class="{
                      'is-invalid': submitted && $v.formStaff.sHoten.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sHoten.required"
                    class="invalid-feedback"
                    >Chưa nhập họ tên nhân viên</div
                  >
                </div>
                <div class="col-lg-3 form-group">
                  <label for="ngay-sinh"
                    >Ngày sinh <span class="text-danger">*</span></label
                  >
                  <input
                    id="ngay-sinh"
                    v-model="formStaff.dNgaysinh"
                    v-mask="'##/##/####'"
                    placeholder="dd/mm/yyyy"
                    type="text"
                    name="ngay-sinh"
                    :class="{
                      'is-invalid':
                        submitted &&
                        !checkAvailableDate(
                          formStaff.dNgaysinh,
                          new Date(),
                          '<'
                        ),
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="
                      submitted &&
                      !checkAvailableDate(formStaff.dNgaysinh, new Date(), '<')
                    "
                    class="invalid-feedback"
                    >Ngày sinh không hợp lệ</div
                  >
                </div>
                <div class="col-lg-1 col-xl-2 form-group">
                  <label for="gioi-tinh">Giới tính: </label>
                  <div class="row">
                    <div class="col">
                      <div class="custom-control custom-radio">
                        <input
                          id="male"
                          v-model="formStaff.bGioitinh"
                          value="1"
                          type="radio"
                          name="gioi-tinh"
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
                          v-model="formStaff.bGioitinh"
                          value="0"
                          type="radio"
                          name="gioi-tinh"
                          class="custom-control-input"
                        />
                        <label class="custom-control-label" for="female">
                          Nữ
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-xl-3 form-group">
                  <label for="so-dien-thoai">
                    Số điện thoại
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    id="so-dien-thoai"
                    v-model="formStaff.sDienthoai"
                    v-mask="'####-###-###'"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && $v.formStaff.sDienthoai.$error,
                    }"
                    placeholder="VD: 0329-222-617"
                  />
                  <div
                    v-if="submitted && $v.formStaff.sDienthoai.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.formStaff.sDienthoai.required"
                      >Chưa nhập số điện thoại.</span
                    >
                  </div>
                </div>
                <div class="col-lg-9 col-xl-4 form-group">
                  <label for="email">
                    Email
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="formStaff.sEmail"
                    type="email"
                    name="email"
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && $v.formStaff.sEmail.$error,
                    }"
                    placeholder="VD: vanhung14.2.2017@gmail.com"
                  />
                  <div
                    v-if="submitted && $v.formStaff.sEmail.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.formStaff.sEmail.required"
                      >Email không được bỏ trống.</span
                    >
                    <span v-if="!$v.formStaff.sEmail.email"
                      >Email không đúng định dạng.</span
                    >
                  </div>
                </div>
                <div class="col-lg-12 col-xl-5 form-group">
                  <label for="dia-chi"
                    >Địa chỉ <span class="text-danger">*</span></label
                  >
                  <input
                    id="dia-chi"
                    ref="dia-chi"
                    v-model="formStaff.sDiachi"
                    type="text"
                    name="dia-chi"
                    placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                    :class="{
                      'is-invalid': submitted && $v.formStaff.sDiachi.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sDiachi.required"
                    class="invalid-feedback"
                    >Chưa nhập địa chỉ.</div
                  >
                </div>
                <div class="col-md-3 form-group">
                  <label for="dan-toc">
                    Dân tộc
                    <span class="text-danger">*</span>
                  </label>
                  <multiselect
                    id="dan-toc"
                    v-model="formStaff.FK_iDantocID"
                    name="dan-toc"
                    label="sTenDantoc"
                    track-by="_id"
                    placeholder="Chọn dân tộc"
                    :show-labels="false"
                    :options="listNation"
                  ></multiselect>
                  <div
                    class="invalid-feedback"
                    :class="{
                      'invalid-feedback invalid-feedback-select':
                        submitted && !formStaff.FK_iDantocID,
                    }"
                    >Vui lòng chọn dân tộc.</div
                  >
                </div>
                <div class="col-md-9 form-group">
                  <label for="nguyen-quan"
                    >Nguyên quán <span class="text-danger">*</span></label
                  >
                  <input
                    id="nguyen-quan"
                    ref="nguyen-quan"
                    v-model="formStaff.sNguyenquan"
                    type="text"
                    name="nguyen-quan"
                    placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                    :class="{
                      'is-invalid':
                        submitted && $v.formStaff.sNguyenquan.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sNguyenquan.required"
                    class="invalid-feedback"
                    >Chưa nhập nguyên quán.</div
                  >
                </div>
                <div class="col-md-3 form-group">
                  <label for="ton-giao">
                    Tôn giáo
                    <span class="text-danger">*</span>
                  </label>
                  <multiselect
                    id="ton-giao"
                    v-model="formStaff.FK_iTongiaoID"
                    name="ton-giao"
                    label="sTenTongiao"
                    track-by="_id"
                    placeholder="Chọn tôn giáo"
                    :show-labels="false"
                    :options="listReligion"
                  ></multiselect>
                  <div
                    class="invalid-feedback"
                    :class="{
                      'invalid-feedback invalid-feedback-select':
                        submitted && !formStaff.FK_iTongiaoID,
                    }"
                    >Vui lòng chọn tôn giáo.</div
                  >
                </div>
                <div class="col-md-9 form-group">
                  <label for="nguyen-quan"
                    >Nơi sinh <span class="text-danger">*</span></label
                  >
                  <input
                    id="noi-sinh"
                    ref="noi-sinh"
                    v-model="formStaff.sNoisinh"
                    type="text"
                    name="noi-sinh"
                    placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                    :class="{
                      'is-invalid': submitted && $v.formStaff.sNoisinh.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sNoisinh.required"
                    class="invalid-feedback"
                    >Chưa nhập nơi sinh.</div
                  >
                </div>
              </div>
            </div>
          </div>
          <div v-if="!isUpdate">
            <hr />
            <div class="row">
              <div class="col-md-8 form-group">
                <label for="jobPosition">
                  Vị trí công việc
                  <span class="text-danger">*</span>
                </label>
                <multiselect
                  id="jobPosition"
                  v-model="formWorkProcess.FK_iVitriCongviecID"
                  name="jobPosition"
                  label="sTenVitriCongviec"
                  track-by="_id"
                  placeholder="Chọn vị trí công việc"
                  :show-labels="false"
                  :options="listJobPosition"
                ></multiselect>
                <div
                  class="invalid-feedback"
                  :class="{
                    'invalid-feedback invalid-feedback-select':
                      submitted && !formWorkProcess.FK_iVitriCongviecID,
                  }"
                  >Vui lòng chọn vị trí công việc.</div
                >
              </div>
              <div class="col-md-2 form-group">
                <label for="ngay-bat-dau-cong-viec"
                  >Ngày bắt đầu <span class="text-danger">*</span></label
                >
                <input
                  id="ngay-bat-dau-cong-viec"
                  v-model="formWorkProcess.dNgayBatdau"
                  v-mask="'##/##/####'"
                  placeholder="dd/mm/yyyy"
                  type="text"
                  name="ngay-bat-dau-cong-viec"
                  :class="{
                    'is-invalid':
                      submitted &&
                      !checkAvailableDate(formWorkProcess.dNgayBatdau),
                  }"
                  class="form-control"
                />
                <div
                  v-if="
                    submitted &&
                    !checkAvailableDate(formWorkProcess.dNgayBatdau)
                  "
                  class="invalid-feedback"
                  >Ngày bắt đầu công việc không hợp lệ</div
                >
              </div>
              <div class="col-md-2 form-group">
                <label for="ngay-bat-dau-cong-viec">Ngày kết thúc</label>
                <input
                  id="ngay-ket-thuc-cong-viec"
                  v-model="formWorkProcess.dNgayKethuc"
                  v-mask="'##/##/####'"
                  placeholder="dd/mm/yyyy"
                  type="text"
                  name="ngay-ket-thuc-cong-viec"
                  class="form-control"
                  :class="{
                    'is-invalid':
                      submitted &&
                      formWorkProcess.dNgayKethuc &&
                      !checkAvailableDate(
                        formWorkProcess.dNgayKethuc,
                        new Date(),
                        '>='
                      ),
                  }"
                />
                <div
                  v-if="
                    submitted &&
                    formWorkProcess.dNgayKethuc &&
                    !checkAvailableDate(
                      formWorkProcess.dNgayKethuc,
                      new Date(),
                      '>='
                    )
                  "
                  class="invalid-feedback"
                  >Ngày kết thúc công việc không hợp lệ</div
                >
              </div>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-md-6">
              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="so-cmnd"
                    >Số CMND <span class="text-danger">*</span></label
                  >
                  <input
                    id="so-cmnd"
                    v-model="formStaff.sCMND"
                    type="text"
                    class="form-control"
                    placeholder="VD: 113704072"
                    :class="{
                      'is-invalid': submitted && $v.formStaff.sCMND.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sCMND.required"
                    class="invalid-feedback"
                    >Chưa nhập số CMND</div
                  >
                </div>
                <div class="col-md-6 form-group">
                  <label for="ngay-cap-cmnd"
                    >Ngày cấp CMND <span class="text-danger">*</span></label
                  >
                  <input
                    id="ngay-cap-cmnd"
                    v-model="formStaff.dNgaycapCMND"
                    v-mask="'##/##/####'"
                    placeholder="dd/mm/yyyy"
                    type="text"
                    name="ngay-cap-cmnd"
                    :class="{
                      'is-invalid':
                        submitted &&
                        !checkAvailableDate(
                          formStaff.dNgaycapCMND,
                          new Date(),
                          '<'
                        ),
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="
                      submitted &&
                      !checkAvailableDate(
                        formStaff.dNgaycapCMND,
                        new Date(),
                        '<'
                      )
                    "
                    class="invalid-feedback"
                    >Ngày cấp CMND không hợp lệ</div
                  >
                </div>
                <div class="col-md-12 form-group">
                  <label for="noi-cap-cmnd"
                    >Nơi cấp CMND <span class="text-danger">*</span></label
                  >
                  <input
                    id="noi-cap-cmnd"
                    v-model="formStaff.sNoicapCMND"
                    type="text"
                    class="form-control"
                    placeholder="VD: CA Hòa Bình"
                    :class="{
                      'is-invalid':
                        submitted && $v.formStaff.sNoicapCMND.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sNoicapCMND.required"
                    class="invalid-feedback"
                    >Chưa nhập nơi cấp CMND</div
                  >
                </div>
                <div class="col-md-6 form-group">
                  <label for="trinh-do-van-hoa"
                    >Trình độ văn hóa <span class="text-danger">*</span></label
                  >
                  <input
                    id="trinh-do-van-hoa"
                    v-model="formStaff.sTrinhdoVanhoa"
                    type="text"
                    class="form-control"
                    placeholder="VD: Đại học"
                    :class="{
                      'is-invalid':
                        submitted && $v.formStaff.sTrinhdoVanhoa.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.formStaff.sTrinhdoVanhoa.required"
                    class="invalid-feedback"
                    >Chưa nhập trình độ văn hóa</div
                  >
                </div>
                <div class="col-md-6 form-group">
                  <label for="ma-so-thue">Mã số thuế</label>
                  <input
                    id="ma-so-thue"
                    v-model="formStaff.sMasothue"
                    type="text"
                    class="form-control"
                    placeholder="VD: 109273837"
                  />
                </div>
              </div>
            </div>
            <div class="col-md-6 form-group">
              <label for="mo-ta-ban-than">Mô tả bản thân</label>
              <vue-editor
                id="mo-ta-ban-than"
                v-model="formStaff.sMotaBanthan"
                :height="175"
              ></vue-editor>
            </div>
          </div>
          <hr />
          <div class="form-group text-center m-t-2 m-b-0">
            <button
              v-if="!isUpdate"
              class="btn btn-primary"
              name="action"
              value="them-nhan-vien"
              type="submit"
            >
              <i class="uil uil-plus"></i> Thêm nhân viên</button
            >
            <button
              v-if="isUpdate"
              class="btn btn-primary"
              name="action"
              value="cap-nhat-nhan-vien"
              type="submit"
            >
              <i class="uil uil-arrow-to-bottom"></i> Cập nhật nhân viên</button
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
    <StaffProfileList
      :list-staff-profile="listStaffProfile"
      @handleBtnEditProfileClick="handleBtnEditProfileClick"
    />
  </Layout>
</template>
<style>
.row-flex {
  display: flex;
  flex-direction: row;
}
.avatar-container {
  width: 220px;
}
.avatar-container + div {
  width: calc(100% - 250px);
  margin-left: 30px;
}
.invalid-feedback.invalid-feedback-select {
  display: block;
}
.form-group .ql-editor {
  min-height: 138px;
}
</style>