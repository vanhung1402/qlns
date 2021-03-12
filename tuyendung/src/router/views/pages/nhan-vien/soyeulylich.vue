<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import VueAvatarEditor from '@components/nhan-vien/VueAvatarEditor'
import { required, email } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { VueEditor } from 'vue2-editor'

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
  },
  data() {
    return {
      title: 'sơ yêu lý lịch',
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
          text: 'Sơ yếu lý lịch',
          active: true,
        },
      ],
      icon: 'users-alt',
      isUpdate: false,
      submitted: false,
      listNation: [],
      listReligion: [],
      form: {
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
      },
    }
  },
  methods: {
    saveClicked: function saveClicked(img) {},

    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (
        this.$v.form.$pending ||
        this.$v.form.$error ||
        !this.form.FK_iDantocID ||
        !this.form.FK_iTongiaoID
      )
        return false
    },
    handleResetForm() {
      this.form = {
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
      }
      this.submitted = false
    },
  },
  validations: {
    form: {
      sMaNhanvien: { required },
      sHoten: { required },
      dNgaysinh: { required },
      sNoisinh: { required },
      sNguyenquan: { required },
      sDiachi: { required },
      sDienthoai: { required },
      sEmail: { required, email },
      sCMND: { required },
      dNgaycapCMND: { required },
      sNoicapCMND: { required },
      sTrinhdoVanhoa: { required },
      sMotaBanthan: { required },
      sDuongdanSoyeuLylich: { required },
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />

    <div class="card">
      <div class="card-body">
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
                    v-model="form.sMaNhanvien"
                    type="text"
                    class="form-control"
                    placeholder="VD: HC3006"
                    :class="{
                      'is-invalid': submitted && $v.form.sMaNhanvien.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.form.sMaNhanvien.required"
                    class="invalid-feedback"
                    >Chưa nhập mã nhân viên</div
                  >
                </div>
                <div class="col-lg-6 col-xl-4 form-group">
                  <label for="ho-ten"
                    >Họ tên <span class="text-danger">*</span></label
                  >
                  <input
                    v-model="form.sHoten"
                    type="text"
                    class="form-control"
                    placeholder="VD: Bùi Văn Hùng"
                    :class="{
                      'is-invalid': submitted && $v.form.sHoten.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.form.sHoten.required"
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
                    v-model="form.dNgaysinh"
                    v-mask="'##/##/####'"
                    placeholder="dd/mm/yyyy"
                    type="text"
                    name="ngay-sinh"
                    :class="{
                      'is-invalid': submitted && $v.form.dNgaysinh.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.form.dNgaysinh.required"
                    class="invalid-feedback"
                    >Chưa nhập ngày sinh nhân viên</div
                  >
                </div>
                <div class="col-lg-1 col-xl-2 form-group">
                  <label for="gioi-tinh">Giới tính: </label>
                  <div class="row">
                    <div class="col">
                      <div class="custom-control custom-radio">
                        <input
                          id="male"
                          v-model="form.bGioitinh"
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
                          v-model="form.bGioitinh"
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
                    v-model="form.sDienthoai"
                    v-mask="'####-###-###'"
                    type="text"
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && $v.form.sDienthoai.$error,
                    }"
                    placeholder="VD: 0329-222-617"
                  />
                  <div
                    v-if="submitted && $v.form.sDienthoai.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.sDienthoai.required"
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
                    v-model="form.sEmail"
                    type="email"
                    name="email"
                    class="form-control"
                    :class="{
                      'is-invalid': submitted && $v.form.sEmail.$error,
                    }"
                    placeholder="VD: vanhung14.2.2017@gmail.com"
                  />
                  <div
                    v-if="submitted && $v.form.sEmail.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.form.sEmail.required"
                      >Email không được bỏ trống.</span
                    >
                    <span v-if="!$v.form.sEmail.email"
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
                    v-model="form.sDiachi"
                    type="text"
                    name="dia-chi"
                    placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                    :class="{
                      'is-invalid': submitted && $v.form.sDiachi.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.form.sDiachi.required"
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
                    v-model="form.FK_iDantocID"
                    name="dan-toc"
                    label="titleSelect"
                    track-by="_id"
                    placeholder="Chọn dân tộc"
                    :show-labels="false"
                    :options="listNation"
                  ></multiselect>
                  <div
                    class="invalid-feedback"
                    :class="{
                      'invalid-feedback invalid-feedback-select':
                        submitted && !form.FK_iDantocID,
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
                    v-model="form.sNguyenquan"
                    type="text"
                    name="nguyen-quan"
                    placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                    :class="{
                      'is-invalid': submitted && $v.form.sNguyenquan.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.form.sNguyenquan.required"
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
                    v-model="form.FK_iTongiaoID"
                    name="ton-giao"
                    label="titleSelect"
                    track-by="_id"
                    placeholder="Chọn tôn giáo"
                    :show-labels="false"
                    :options="listReligion"
                  ></multiselect>
                  <div
                    class="invalid-feedback"
                    :class="{
                      'invalid-feedback invalid-feedback-select':
                        submitted && !form.FK_iTongiaoID,
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
                    v-model="form.sNoisinh"
                    type="text"
                    name="noi-sinh"
                    placeholder="VD: Vĩnh Đồng, Kim Bôi, Hòa Bình"
                    :class="{
                      'is-invalid': submitted && $v.form.sNoisinh.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.form.sNoisinh.required"
                    class="invalid-feedback"
                    >Chưa nhập nơi sinh.</div
                  >
                </div>
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
                    v-model="form.sCMND"
                    type="text"
                    class="form-control"
                    placeholder="VD: 113704072"
                    :class="{
                      'is-invalid': submitted && $v.form.sCMND.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.form.sCMND.required"
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
                    v-model="form.dNgaycapCMND"
                    v-mask="'##/##/####'"
                    placeholder="dd/mm/yyyy"
                    type="text"
                    name="ngay-cap-cmnd"
                    :class="{
                      'is-invalid': submitted && $v.form.dNgaycapCMND.$error,
                    }"
                    class="form-control"
                  />
                  <div
                    v-if="submitted && !$v.form.dNgaycapCMND.required"
                    class="invalid-feedback"
                    >Chưa nhập ngày cấp CMND</div
                  >
                </div>
                <div class="col-md-12 form-group">
                  <label for="noi-cap-cmnd"
                    >Nơi cấp CMND <span class="text-danger">*</span></label
                  >
                  <input
                    id="noi-cap-cmnd"
                    v-model="form.sNoicapCMND"
                    type="text"
                    class="form-control"
                    placeholder="VD: CA Hòa Bình"
                    :class="{
                      'is-invalid': submitted && $v.form.sNoicapCMND.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.form.sNoicapCMND.required"
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
                    v-model="form.sTrinhdoVanhoa"
                    type="text"
                    class="form-control"
                    placeholder="VD: Đại học"
                    :class="{
                      'is-invalid': submitted && $v.form.sTrinhdoVanhoa.$error,
                    }"
                  />
                  <div
                    v-if="submitted && !$v.form.sTrinhdoVanhoa.required"
                    class="invalid-feedback"
                    >Chưa nhập trình độ văn hóa</div
                  >
                </div>
                <div class="col-md-6 form-group">
                  <label for="ma-so-thue">Mã số thuế</label>
                  <input
                    id="ma-so-thue"
                    v-model="form.sMasothue"
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
                v-model="form.sMotaBanthan"
								:height="175"
              ></vue-editor>
            </div>
          </div>
          <div class="form-group text-center m-b-0">
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
.form-group .ql-editor{
	min-height: 138px;
}
</style>