<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import btnTooltip from '@components/button-tooltip'
import Multiselect from 'vue-multiselect'
import { VueEditor } from 'vue2-editor'
import axios from 'axios'
import RecruitmentDecisionList from '@components/tuyen-dung/recruitmentDecisionList'

export default {
  page: {
    title: 'Quản lý quyết định tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    VueEditor,
    btnTooltip,
    Multiselect,
    RecruitmentDecisionList,
  },
  data() {
    return {
      title: 'Quản lý quyết định tuyển dụng',
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
          text: 'Quản lý quyết định',
          active: true,
        },
      ],
      btnSubmitTitle: 'Lập quyết định',
      iconBtnSubmit: 'plus',
      icon: 'postcard',
      form: {
        exampleDecision: '',
        recruitmentProfileSelected: null,
      },
      submitted: false,
      listRecruitmentProfileApproved: [],
      listDemoDecisions: [],
      listRecruitmentDecision: [],
      decisionUpdateId: 0,
      isMultipleProfile: true,
      isDisabledProfile: false,
    }
  },
  created() {
    this.loadListProfiles()
    this.loadListRecuitmentDecisons()
  },
  methods: {
    loadListRecuitmentDecisons() {
      axios
        .get('/api/tuyen-dung/list-recruitment-decisions')
        .then((res) => {
          if (res.status === 200) {
            this.listRecruitmentDecision = res.data
            console.log(res.data)
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    loadListProfiles() {
      axios
        .get('/api/tuyen-dung/list-profile-with-status', {
          params: { status: [4] },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data)
            this.getListOptionProfile(res.data)
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
        })
    },
    handlePlanSubmit(e) {
      this.submitted = true
      if (!this.form.exampleDecision || !this.form.recruitmentProfileSelected)
        return false

      if (this.decisionUpdateId) {
        this.handleUpdateNewDecisions()
      } else {
        this.handleAddNewDecisions()
      }
      this.handleResetFormDecision()
    },
    getListOptionProfile(profileApproved) {
      this.listRecruitmentProfileApproved = profileApproved.map((profile) => {
        return {
          ...profile,
          titleSelect: `${profile.sHotenUngvien} - ${profile.FK_iChitietKehoachTuyendungID.FK_iVitriCongviecID.sTenVitriCongviec} - ${profile.FK_iChitietKehoachTuyendungID.FK_iKehoachTuyendungID.sTieudeKehoach}`,
        }
      })
    },
    handleUpdateNewDecisions() {
      axios
        .put('/api/tuyen-dung/recruitment-decisions', {
          updateBy: this.$store.state.auth.currentUser.staff,
          contentDecision: this.form.exampleDecision,
          decisionUpdateId: this.decisionUpdateId,
          action: 'updateContent',
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$toastr.success(
              'Đã cập nhật quyết định tuyển dụng.',
              'Thành công'
            )
            this.loadListRecuitmentDecisons()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cập nhật quyết định tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error(
            'Không thể cập nhật quyết định tuyển dụng.',
            'Thất bại'
          )
        })
    },
    handleAddNewDecisions() {
      let listDecisions = this.form.recruitmentProfileSelected.map(
        (profile) => {
          return {
            profile: profile,
            contentDecision: this.form.exampleDecision,
          }
        }
      )
      axios
        .post('/api/tuyen-dung/recruitment-decisions', {
          createBy: this.$store.state.auth.currentUser.staff,
          decision: listDecisions,
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$toastr.success('Đã lưu quyết định tuyển dụng.', 'Thành công')
            this.loadListRecuitmentDecisons()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi lưu quyết định tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error('Không thể lưu quyết định tuyển dụng.', 'Thất bại')
        })
    },
    handleDemoDecisions() {
      this.submitted = true
      if (!this.form.exampleDecision || !this.form.recruitmentProfileSelected)
        return false
      let listDecisions = []
      this.form.recruitmentProfileSelected.forEach((profile) => {
        listDecisions.push(this.renderDecisionProfile(profile))
      })
      this.listDemoDecisions = listDecisions
    },
    renderDecisionProfile(profile) {
      let contentDecision = this.form.exampleDecision
      contentDecision = contentDecision.replaceAll(
        '%ten_ung_vien%',
        profile.sHotenUngvien
      )
      contentDecision = contentDecision.replaceAll(
        '%ten_bo_phan%',
        profile.FK_iChitietKehoachTuyendungID.FK_iVitriCongviecID.FK_iBophanID
          .sTenBophan
      )
      return contentDecision
    },
    loadDecisionPattern() {
      axios
        .get('/api/tuyen-dung/list-recruitment-decisions-pattern')
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.form.exampleDecision = res.data.pop().sNoidungMauQuyetdinhTuyendung
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleResetFormPlan() {
      this.exampleDecision = ''
    },
    handleSaveDecisionPartern() {
      this.submitted = true
      if (this.form.exampleDecision) {
        axios
          .post('/api/tuyen-dung/recruitment-decisions-pattern', {
            decisionContent: this.form.exampleDecision,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$toastr.success(
                'Đã lưu mẫu quyết định tuyển dụng.',
                'Thành công'
              )
              this.loadDecisionPattern()
            } else {
              this.$toastr.error(
                'Đã có lỗi xảy ra khi lưu mẫu quyết định tuyển dụng.',
                'Thất bại'
              )
            }
          })
          .catch((err) => {
            console.error(err)
            this.$toastr.error(
              'Không thể lưu mẫu quyết định tuyển dụng.',
              'Thất bại'
            )
          })
      }
    },
    handleClickEditDecision(decision) {
      this.decisionUpdateId = decision._id
      this.form.exampleDecision = decision.sNoidungQuyetdinhTuyendung
      const profile = decision.FK_iHosoTuyendungID
      profile.titleSelect = `${profile.sHotenUngvien} - ${profile.FK_iChitietKehoachTuyendungID.FK_iVitriCongviecID.sTenVitriCongviec} - ${profile.FK_iChitietKehoachTuyendungID.FK_iKehoachTuyendungID.sTieudeKehoach}`
      this.form.recruitmentProfileSelected = profile
      this.btnSubmitTitle = 'Cập nhật quyết định'
      this.iconBtnSubmit = 'arrow-to-bottom'
      this.isMultipleProfile = false
      this.isDisabledProfile = true
    },
    handleResetFormDecision(){
      this.decisionUpdateId = 0
      this.loadDecisionPattern()
      this.btnSubmitTitle = 'Lập quyết định'
      this.iconBtnSubmit = 'plus'
      this.isMultipleProfile = true
      this.isDisabledProfile = false
      this.form.recruitmentProfileSelected = null
      this.submitted = false
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="handlePlanSubmit">
          <div class="form-group">
            <div class="row">
              <div class="col">
                <label for="example-decision"
                  >Nội dung mẫu quyết định
                  <span class="text-danger">*</span></label
                >
              </div>
              <div class="col text-right">
                <btnTooltip
                  class="pull-right mr-2"
                  :btn-id="'btn-reload-decision-pattern'"
                  :btn-type="'warning'"
                  :btn-tooltip-text="'Tải mẫu quyết định mới nhất'"
                  :btn-icon="'uil-sync'"
                  :btn-class="'btn-xs outline-primary'"
                  @onBtnClick="loadDecisionPattern"
                />
                <btnTooltip
                  class="pull-right"
                  :btn-id="'btn-save-decision-pattern'"
                  :btn-type="'primary'"
                  :btn-tooltip-text="'Lưu lại mẫu quyết định này'"
                  :btn-icon="'uil-download-alt'"
                  :btn-class="'btn-xs outline-primary'"
                  :btn-text="'Lưu mẫu'"
                  @onBtnClick="handleSaveDecisionPartern"
                />
              </div>
            </div>
            <vue-editor
              id="example-decision"
              v-model="form.exampleDecision"
            ></vue-editor>
            <div
              class="invalid-feedback"
              :class="{
                'invalid-feedback invalid-feedback-select':
                  submitted && !form.exampleDecision,
              }"
              >Vui lòng không bỏ trống.</div
            >
          </div>
          <div class="form-group">
            <label for="recruitmentProfileSelected">
              Chọn các ứng viên cần lập quyết định
              <span class="text-danger">*</span>
            </label>
            <multiselect
              id="recruitmentProfileSelected"
              v-model="form.recruitmentProfileSelected"
              name="recruitmentProfileSelected"
              label="titleSelect"
              track-by="_id"
              placeholder="Chọn các ứng viên cần lập chung mẫu quyết định"
              :show-labels="false"
              :multiple="isMultipleProfile"
              :disabled="isDisabledProfile"
              :options="listRecruitmentProfileApproved"
            ></multiselect>
            <div
              class="invalid-feedback"
              :class="{
                'invalid-feedback invalid-feedback-select':
                  submitted && !form.recruitmentProfileSelected,
              }"
              >Vui lòng chọn ứng viên áp dụng quyết định tuyển dụng.</div
            >
          </div>
          <div class="form-group text-center m-b-0">
            <button
              class="btn btn-primary"
              name="action"
              value="them-ke-hoach"
              type="submit"
            >
              <i :class="'uil uil-' + iconBtnSubmit"></i>
              {{ btnSubmitTitle }}</button
            >
            <button
              type="button"
              class="btn btn-info m-l-5 ml-1"
              @click="handleDemoDecisions"
            >
              <i class="uil uil-capture"></i> Xem kết quả mẫu</button
            >
            <button
              type="reset"
              class="btn btn-secondary m-l-5 ml-1"
              @click="handleResetFormDecision"
            >
              <i class="uil uil-multiply"></i> Hủy</button
            >
          </div>
        </form>
      </div>
    </div>

    <div
      v-for="(decision, index) in listDemoDecisions"
      :key="index"
      class="card"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div class="card-body" v-html="decision"></div>
      <!--eslint-enable-->
    </div>

    <RecruitmentDecisionList
      :list-decision="listRecruitmentDecision"
      @onClickEditDecision="handleClickEditDecision"
      @handleUpdateDecision="loadListRecuitmentDecisons"
    />
  </Layout>
</template>

<style>
thead th {
  vertical-align: middle;
  text-align: center;
}
.invalid-feedback.invalid-feedback-select {
  display: block;
}
.ql-align-center {
  text-align: center;
}
.ql-align-right {
  text-align: right;
}
</style>