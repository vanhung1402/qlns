<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { VueEditor } from 'vue2-editor'
import PlanDetailCell from '@components/tuyen-dung/recruitment-plan-cell'
import PlanDetailModal from '@components/tuyen-dung/recruitment-plan-modal'
import PlanReviewCell from '@components/tuyen-dung/recruitment-review-cell'
import { dateFilter } from 'vue-date-fns'
import axios from 'axios'

export default {
  page: {
    title: 'Lập kế hoạch tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  filters: {
    date: dateFilter,
  },
  components: {
    Layout,
    PageHeader,
    VueEditor,
    PlanDetailCell,
    PlanDetailModal,
    PlanReviewCell,
  },
  data() {
    return {
      title: 'Lập kế hoạch tuyển dụng',
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
          text: 'Lập kế hoạch',
          active: true,
        },
      ],
      btnSubmitTitle: 'Lập kế hoạch',
      iconBtnSubmit: 'plus',
      icon: 'postcard',
      planTitle: '',
      planContent: '',
      planDetails: [],
      isShowDetailPlanModal: false,
      typeActionModal: 'insert',
      detailPlan: {
        title: 'Thêm chi tiết kế hoạch tuyển dụng',
        data: {},
      },
      planUpdateId: 0,
      plans: [],
    }
  },
  created() {
    this.loadListRecruitmentPlan()
  },
  methods: {
    async loadListRecruitmentPlan() {
      let promise = await axios.get('/api/tuyen-dung/list-recruitment-plan')
      if (promise.status === 200) {
        this.plans = promise.data
      }
    },
    openDetailPlanModal(detailPlanID = null) {
      if (detailPlanID) {
        this.detailPlan.title = 'Cập nhật chi tiết kế hoạch tuyển dụng'
        this.detailPlan.data = this.planDetails.find(
          (detail) => detail._id === detailPlanID
        )
        this.isShowDetailPlanModal = true
        this.typeActionModal = 'update'
      }
    },
    handleRemoveDetailPlan(detailPlanID) {
      let newPlanDetails = this.planDetails.filter(
        (detail) => detail._id !== detailPlanID
      )
      this.planDetails = newPlanDetails
    },
    onClickAddDetailPlan() {
      this.detailPlan = {
        title: 'Thêm chi tiết kế hoạch tuyển dụng',
        data: {},
      }
      this.isShowDetailPlanModal = true
      this.typeActionModal = 'insert'
    },
    handleSubmitFormDetailPlan(dataDetailPlan) {
      if (this.typeActionModal === 'insert') {
        dataDetailPlan._id = new Date().getTime()
        this.planDetails.push(dataDetailPlan)
      } else if (this.typeActionModal === 'update') {
        this.planDetails = this.planDetails.map((detail) => {
          if (detail._id === this.detailPlan.data._id) {
            detail = dataDetailPlan
            detail._id = this.detailPlan.data._id
          }
          return detail
        })
      }
      this.isShowDetailPlanModal = false
    },
    handleCloseModal() {
      this.isShowDetailPlanModal = false
    },
    handlePlanSubmit() {
      if (!this.planContent) {
        this.$toastr.warning('Vui lòng nhập nội dung tuyển dụng.', 'Cảnh báo')
        return false
      }
      if (!this.planUpdateId) {
        let newPlan = {
          title: this.planTitle,
          content: this.planContent,
          detail: this.planDetails,
          createBy: this.$store.state.auth.currentUser.staff,
        }

        axios
          .post('/api/tuyen-dung/add-recruitment-plan', newPlan)
          .then((res) => {
            if (res.status === 200) {
              this.$toastr.success('Đã lập kế hoạch tuyển dụng.', 'Thành công')
              this.loadListRecruitmentPlan()
            } else {
              this.$toastr.error(
                'Không thể lập kế hoạch tuyển dụng.',
                'Thất bại'
              )
            }
          })
          .catch((err) => {
            console.error(err)
            this.$toastr.error(
              'Đã có lỗi xảy ra khi lập kế hoạch tuyển dụng.',
              'Lỗi'
            )
          })
      } else {
        let updatePlan = {
          updateBy: this.$store.state.auth.currentUser.staff,
          recruitmentPlan: {
            title: this.planTitle,
            content: this.planContent,
          },
          recruitmentPlanDetail: this.planDetails,
        }
        axios
          .put('/api/tuyen-dung/recruitment-plan/' + this.planUpdateId, {
            action: 'update',
            params: updatePlan,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$toastr.success(
                'Đã cập nhật kế hoạch tuyển dụng.',
                'Thành công'
              )
              this.loadListRecruitmentPlan()
            } else {
              this.$toastr.error(
                'Không thể cập nhật kế hoạch tuyển dụng.',
                'Thất bại'
              )
            }
          })
          .catch((err) => {
            console.error(err)
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cập nhật kế hoạch tuyển dụng.',
              'Lỗi'
            )
          })
      }
    },
    handleResetFormPlan() {
      this.planDetails = []
      this.planTitle = ''
      this.planContent = ''
    },
    async handleClickEditPlan(planIDEdit) {
      this.$refs.recruitmentTitle.focus()
      let planEdit = this.plans.find((plan) => {
        return plan._id === planIDEdit
      })

      if (planEdit) {
        this.planTitle = planEdit.sTieudeKehoach
        this.planContent = planEdit.sNoidungKehoach
        this.planDetails = await this.loadDetailPlan(planEdit._id)
        this.btnSubmitTitle = 'Cập nhật kế hoạch'
        this.planUpdateId = planIDEdit
        this.iconBtnSubmit = 'arrow-to-bottom'
      }
    },
    async loadDetailPlan(planId) {
      let promise = await axios.get(
        '/api/tuyen-dung/list-recruitment-plan-detail',
        {
          params: { FK_iKehoachTuyendungID: planId },
        }
      )
      if (promise.status === 200) {
        return promise.data.map((detail) => {
          return {
            _id: detail._id,
            viTricongViec: detail.FK_iVitriCongviecID,
            hinhThucDangTuyen: detail.FK_iHinhthucDangtuyenID,
            kinhPhiDuKien: detail.iKinhphiDutruTuyendung,
            lyDoTuyen: detail.sLydoTuyen,
            mucLuongDukien: detail.iMucluongDukien,
            soLuong: detail.iSoluong,
            thoiGianDuyetHoSo: [
              detail.dNgayBatdauTestHosoTuyendung,
              detail.dNgayKethucTestHosoTuyendung,
            ],
            thoiGianNhanHoSo: [
              detail.dNgayBatdauNhanHosoTuyendung,
              detail.dNgayKethucNhanHosoTuyendung,
            ],
            thoiGianPhongVan: [
              detail.dNgayBatdauPhongvanTuyendung,
              detail.dNgayKethucPhongvanTuyendung,
            ],
          }
        })
      }
      return null
    },
    async handleClickRemovePlan(planIDRemove) {
      const btnRemovePlan = await this.$swal.fire({
        input: 'textarea',
        inputLabel: 'Lý do hủy',
        inputPlaceholder: 'Nhập lý do hủy kế hoạch...',
        inputAttributes: {
          'aria-label': 'Nhập lý do hủy kế hoạch',
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Xác nhận hủy',
        cancelButtonText: 'Giữ lại!',
      })

      if (btnRemovePlan.isConfirmed) {
        if (btnRemovePlan.value) {
          axios
            .put('/api/tuyen-dung/recruitment-plan/' + planIDRemove, {
              action: 'change-status',
              params: {
                status: 4,
                reason: btnRemovePlan.value,
                updateBy: this.$store.state.auth.currentUser.staff,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                this.$toastr.success(
                  'Đã hủy kế hoạch tuyển dụng.',
                  'Thành công'
                )
                this.loadListRecruitmentPlan()
              } else {
                this.$toastr.error(
                  'Không thể hủy kế hoạch tuyển dụng.',
                  'Thất bại'
                )
              }
            })
            .catch((err) => {
              console.error(err)
              this.$toastr.error(
                'Đã có lỗi xảy ra khi hủy kế hoạch tuyển dụng.',
                'Lỗi'
              )
            })
        } else {
          this.$toastr.warning(
            'Chưa nhập lý do hủy kế hoạch tuyển dụng.',
            'Cảnh báo'
          )
        }
      }
    },
    async handleClickResendPlan(planIDResend) {
      this.$swal
        .fire({
          title: 'Bạn có chắc chắn?',
          text: 'Kế hoạch tuyển dụng này sẽ được gửi lại để duyệt!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Đúng, chuyển ngay!',
          cancelButtonText: 'Bỏ qua',
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .put('/api/tuyen-dung/recruitment-plan/' + planIDResend, {
              action: 'change-status',
              params: {
                status: 1,
                  updateBy: this.$store.state.auth.currentUser.staff,
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  this.$toastr.success(
                    'Đã cập nhật kế hoạch tuyển dụng.',
                    'Thành công'
                  )
                  this.loadListRecruitmentPlan()
                } else {
                  this.$toastr.error(
                    'Không thể cập nhật kế hoạch tuyển dụng.',
                    'Thất bại'
                  )
                }
              })
              .catch((err) => {
                console.error(err)
                this.$toastr.error(
                  'Đã có lỗi xảy ra khi cập nhật kế hoạch tuyển dụng.',
                  'Lỗi'
                )
              })
          }
        })
    },
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
            <label for="tieu-de-tuyen-dung"
              >Tiêu đề tuyển dụng <span class="text-danger">*</span></label
            >
            <input
              id="tieu-de-tuyen-dung"
              ref="recruitmentTitle"
              v-model="planTitle"
              type="text"
              class="form-control"
              name="tieu-de-tuyen-dung"
              required
              placeholder="VD: Tuyển dụng nhân viên Sale"
            />
          </div>
          <div class="form-group">
            <label
              >Nội dung tuyển dụng <span class="text-danger">*</span></label
            >
            <vue-editor v-model="planContent"></vue-editor>
          </div>
          <div>
            <table class="table">
              <thead>
                <tr>
                  <th class="text-center">STT</th>
                  <th>Vị trí công việc</th>
                  <th>Số lượng</th>
                  <th>Lý do tuyển</th>
                  <th>Mức lương dự kiến</th>
                  <th>Hình thức đăng tuyển</th>
                  <th>Kinh phí dự kiến</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                <PlanDetailCell
                  v-for="(plan, index) in planDetails"
                  :key="plan._id"
                  :index="index"
                  :plan="plan"
                  @onClickBtnChangeDetailPlan="openDetailPlanModal"
                  @onClickBtnRemoveDetailPlan="handleRemoveDetailPlan"
                />
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="8" class="text-right">
                    <b-button
                      id="btn-add-detail-plan"
                      variant="primary btn-sm m-1"
                      @click="onClickAddDetailPlan"
                      ><i class="uil uil-plus"></i>
                    </b-button>
                  </th>
                </tr>
              </tfoot>
            </table>
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
              type="reset"
              class="btn btn-secondary m-l-5 ml-1"
              @click="handleResetFormPlan"
            >
              <i class="uil uil-multiply"></i> Hủy</button
            >
          </div>
        </form>
        <PlanDetailModal
          :show="isShowDetailPlanModal"
          :detail="detailPlan"
          @handleCloseModal="handleCloseModal"
          @handleSubmitFormDetailPlan="handleSubmitFormDetailPlan"
        />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <h4 class="card-title text-center text-uppercase"
          >Danh sách kế hoạch tuyển dụng</h4
        >
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Kế hoạch</th>
              <th>Người cập nhập</th>
              <th>Trạng thái</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <PlanReviewCell
              v-for="(plan, index) in plans"
              :key="plan._id"
              :plan="plan"
              :index="index + 1"
              :viewcall="'lapkehoach'"
              @onClickEditPlan="handleClickEditPlan"
              @onClickRemovePlan="handleClickRemovePlan"
              @onClickResendPlan="handleClickResendPlan"
            />
          </tbody>
        </table>
      </div>
    </div>
  </Layout>
</template>

<style lang="stylus" scoped>
thead th {
  vertical-align: middle;
  text-align: center;
}
</style>