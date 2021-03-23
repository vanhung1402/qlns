
<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { VueEditor } from 'vue2-editor'
import { required } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import RecruitmentPostList from '@components/tuyen-dung/recruitmentPostList'

export default {
  page: {
    title: 'Tin tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    VueEditor,
    RecruitmentPostList,
  },
  data() {
    return {
      title: 'Tin tuyển dụng',
      items: [
        {
          text: 'Locifa',
          href: '/',
        },
        {
          text: 'Quản lý hệ thống',
          href: '/',
        },
        {
          text: 'Tin tuyển dụng',
          active: true,
        },
      ],
      icon: 'newspaper',
      form: {
        recruitmentPlanSelected: null,
        recruitmentPlanDetailSelected: null,
        timeExpire: '',
        titleNews: '',
        contentNews: '',
      },
      submitted: false,
      updateId: 0,
      recruitmentPosts: [],
      recruitmentPlans: [],
      recruitmentPlanDetails: [],
      dateTimePicker: {
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        minDate: new Date(),
      },
      btnSubmitTitle: 'Tạo bản tin',
      iconBtnSubmit: 'navigator',
    }
  },
  validations: {
    form: {
      timeExpire: { required },
      titleNews: { required },
      contentNews: { required },
    },
  },
  created() {
    this.loadRecruitmentPlanAvailable()
    this.loadRecruitmentPost()
  },
  methods: {
    async loadRecruitmentPost() {
      this.$recruitment
        .get('/api/tuyen-dung/list-recruitment-post')
        .then((res) => {
          if (res.status === 200) {
            this.recruitmentPosts = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    async loadRecruitmentPlanAvailable() {
      this.$recruitment
        .get('/api/tuyen-dung/recruitment-plan-available')
        .then((res) => {
          if (res.status === 200) {
            this.recruitmentPlans = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSubmit(e) {
      this.submitted = true
      this.$v.form.$touch()
      if (
        this.$v.form.$pending ||
        this.$v.form.$error ||
        !this.form.recruitmentPlanDetailSelected ||
        !this.form.contentNews
      )
        return false
      this.handleSavePost()
    },
    handleSavePost() {
      let post = {...this.form}
      let ngayDang = post.timeExpire
      ngayDang = ngayDang.split(' ')
      let mangNgay = ngayDang[0].split('/')
      mangNgay = [mangNgay[1], mangNgay[0], mangNgay[2]].join('/')
      ngayDang = [mangNgay, ngayDang[1]].join(' ')
      this.form.timeExpire = new Date(ngayDang)
      let newPost = {
        ...this.form,
        ...{ createBy: this.$store.state.auth.currentUser.staff },
      }
      if (this.updateId) {
        this.$recruitment
          .put('/api/tuyen-dung/recruitment-post/' + this.updateId, newPost)
          .then((res) => {
            if (res.status === 200) {
              this.$toastr.success(
                'Đã cập nhật bản tin tuyển dụng.',
                'Thành công'
              )
              this.loadRecruitmentPost()
            } else {
              this.$toastr.error(
                'Không thể cập nhật bản tin tuyển dụng.',
                'Thất bại'
              )
            }
          })
          .catch((err) => {
            console.error(err)
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cập nhật bản tin tuyển dụng.',
              'Lỗi'
            )
          })
      } else {
        this.$recruitment
          .post('/api/tuyen-dung/recruitment-post', newPost)
          .then((res) => {
            if (res.status === 200) {
              this.$toastr.success('Đã tạo bản tin tuyển dụng.', 'Thành công')
              this.loadRecruitmentPost()
            } else {
              this.$toastr.error(
                'Không thể tạo bản tin tuyển dụng.',
                'Thất bại'
              )
            }
          })
          .catch((err) => {
            console.error(err)
            this.$toastr.error(
              'Đã có lỗi xảy ra khi tạo bản tin tuyển dụng.',
              'Lỗi'
            )
          })
      }
    },
    handleResetFormNews() {
      this.form = {
        recruitmentPlanSelected: null,
        recruitmentPlanDetailSelected: null,
        timeExpire: '',
        titleNews: '',
        contentNews: '',
      }
      this.submitted = false
    },
    async onChangeRecruitmentPlan() {
      if (this.form.recruitmentPlanSelected) {
        await this.$recruitment
          .get(
            '/api/tuyen-dung/recruitment-plan-list-detail/' +
              this.form.recruitmentPlanSelected._id
          )
          .then((res) => {
            if (res.status === 200) {
              console.log(res.data)
              this.renderRecruitmentPlanDetail(res.data.filter(rpd => {
                return rpd.FK_iHinhthucDangtuyenID.sTenHinhthucDangtuyen === 'Trang tuyển dụng'
              }))
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.form.recruitmentPlanDetailSelected = null
    },
    renderRecruitmentPlanDetail(planDetail, selectedId = null) {
      this.recruitmentPlanDetails = planDetail.map((detail) => {
        detail.titleSelect = detail.FK_iVitriCongviecID.sTenVitriCongviec
        if (selectedId && detail._id === selectedId) {
          this.form.recruitmentPlanDetailSelected = detail
        }
        return detail
      })
    },
    async handleClickEditPost(data) {
      this.$refs.postTitle.focus()
      this.updateId = data._id
      this.btnSubmitTitle = 'Cập nhật bản tin'
      this.form = {
        recruitmentPlanSelected:
          data.FK_iChitietKehoachTuyendungID.FK_iKehoachTuyendungID,
        recruitmentPlanDetailSelected: data.FK_iChitietKehoachTuyendungID,
        timeExpire: data.tThoigianHethan,
        titleNews: data.sTieudeTinTuyendung,
        contentNews: data.sNoidungTinTuyendung,
      }
      await this.onChangeRecruitmentPlan()
      this.renderRecruitmentPlanDetail(
        this.recruitmentPlanDetails,
        data.FK_iChitietKehoachTuyendungID._id
      )
    },
  },
}
</script>
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />
    <div class="card">
      <div class="card-body">
        <h4 class="text-center text-uppercase">Đăng tin tuyển dụng</h4>
        <br />
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-5">
              <div class="form-group">
                <label for="recruitmentPlan"> Kế hoạch tuyển dụng </label>
                <multiselect
                  id="recruitmentPlan"
                  v-model="form.recruitmentPlanSelected"
                  name="recruitmentPlan"
                  label="sTieudeKehoach"
                  track-by="_id"
                  placeholder="Chọn kế hoạch"
                  :show-labels="false"
                  :options="recruitmentPlans"
                  @input="onChangeRecruitmentPlan"
                ></multiselect>
              </div>
            </div>
            <div class="col-md-5">
              <div class="form-group">
                <div class="form-group">
                  <label for="recruitmentPlanDetail">
                    Vị trí công việc theo đợt tuyển dụng
                    <span class="text-danger">*</span>
                  </label>
                  <multiselect
                    id="recruitmentPlanDetail"
                    v-model="form.recruitmentPlanDetailSelected"
                    name="recruitmentPlanDetail"
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
                        submitted && !form.recruitmentPlanDetailSelected,
                    }"
                    >Vui lòng chọn vị trí công việc tuyển dụng.</div
                  >
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <label for="timeExpire">
                  Hạn hiển thị <span class="text-danger">*</span>
                </label>
                <flat-pickr
                  id="timeExpire"
                  v-model="form.timeExpire"
                  :config="dateTimePicker"
                  class="form-control"
                  placeholder="Chọn thời gian"
                  :class="{
                    'is-invalid': submitted && $v.form.timeExpire.$error,
                  }"
                ></flat-pickr>
                <div
                  v-if="submitted && !$v.form.timeExpire.required"
                  class="invalid-feedback"
                  >Vui lòng nhập hạn hiển thị tin</div
                >
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label for="tieu-de-tin-tuyen-dung"
                  >Tiêu đề tin tuyển dụng
                  <span class="text-danger">*</span></label
                >
                <input
                  id="tieu-de-tin-tuyen-dung"
                  ref="postTitle"
                  v-model="form.titleNews"
                  type="text"
                  class="form-control"
                  name="tieu-de-tin-tuyen-dung"
                  placeholder="Tiêu đề hiển thị bản tin"
                  :class="{
                    'is-invalid': submitted && $v.form.titleNews.$error,
                  }"
                />
                <div
                  v-if="submitted && !$v.form.titleNews.required"
                  class="invalid-feedback"
                  >Vui lòng nhập hạn hiển thị tin</div
                >
              </div>
              <div class="form-group">
                <label
                  >Nội dung tin tuyển dụng
                  <span class="text-danger">*</span></label
                >
                <vue-editor v-model="form.contentNews"></vue-editor>
                <div
                  class="invalid-feedback"
                  :class="{
                    'invalid-feedback invalid-feedback-select':
                      submitted && !form.contentNews,
                  }"
                  >Vui lòng nhập nội dung tin.</div
                >
              </div>
              <div class="form-group text-center m-b-0">
                <button
                  class="btn btn-primary"
                  name="action"
                  value="them-tin-tuyen-dung"
                  type="submit"
                >
                  <i :class="'uil uil-' + iconBtnSubmit"></i>
                  {{ btnSubmitTitle }}</button
                >
                <button
                  type="reset"
                  class="btn btn-secondary m-l-5 ml-1"
                  @click="handleResetFormNews"
                >
                  <i class="uil uil-multiply"></i> Hủy</button
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <RecruitmentPostList
      :lists="recruitmentPosts"
      @handleClickEditPost="handleClickEditPost"
    />
  </Layout>
</template>

<style>
.invalid-feedback.invalid-feedback-select {
  display: block;
}
.account-report {
  padding-bottom: 21.5px;
}
</style>