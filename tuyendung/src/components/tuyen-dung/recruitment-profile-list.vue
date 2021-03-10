<script>
import ProfileCell from '@components/tuyen-dung/recruitment-profile-cell'
import Multiselect from 'vue-multiselect'
import axios from 'axios'

export default {
  components: { ProfileCell, Multiselect },
  props: {
    profiles: {
      type: Array,
      default: () => [],
    },
    viewCall: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      listProfile: this.profiles,
      candidateEvaluates: [],
      form: {
        candidateEvaluate: {
          _id: 0,
          sTenTrangthaiHosoTuyendung: 'Chưa đánh giá',
        },
        resultCandidateEvaluate: '',
      },
      isShowEvaluateModal: false,
      currentProfile: {},
      submitted: false,
    }
  },
  watch: {
    profiles: function (newProfiles) {
      this.listProfile = newProfiles
    },
  },
  created() {
    this.loadEvaluateValue()
  },
  methods: {
    async loadEvaluateValue() {
      axios
        .get('/api/danh-muc/list-recruitment-profile-status', {
          params: { status: 3 },
        })
        .then((res) => {
          if (res.status === 200) {
            this.candidateEvaluates = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSubmit(e) {
      this.submitted = true
      if (!this.form.candidateEvaluate._id) return false
      this.onChangeEvaluate()
    },
    handleBtnEditProfile(profileEdit) {
      this.$emit('handleEditProfile', profileEdit)
    },
    handleBtnRemoveProfile(profileDeleteId) {
      axios
        .delete('/api/tuyen-dung/profile/' + profileDeleteId)
        .then((res) => {
          if (res.data.ok) {
            let newListProfile = this.listProfile.filter((profile) => {
              return profile._id !== profileDeleteId
            })
            this.listProfile = newListProfile
            this.$toastr.success('Đã xóa hồ sơ tuyển dụng.', 'Thành công')
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi xóa hồ sơ tuyển dụng!',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
          this.$toastr.error('Không thể xóa hồ sơ tuyển dụng!', 'Thất bại')
        })
    },
    handleBtnChangeStatusProfile(data) {
      const status = data.status
      const title = status === 2 ? 'duyệt' : 'loại'

      axios
        .put('/api/tuyen-dung/profile/' + data.id, {
          params: {
            action: 'updateStatus',
            status: data.status,
            updateBy: this.$store.state.auth.currentUser.staff,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.$emit('handleReloadList')
            this.$toastr.success(`Đã ${title} hồ sơ tuyển dụng.`, 'Thành công')
          } else {
            this.$toastr.error(
              `Đã có lỗi xảy ra khi ${title} hồ sơ tuyển dụng!`,
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
          this.$toastr.error(`Không thể ${title} hồ sơ tuyển dụng!`, 'Thất bại')
        })
    },
    onCloseModal() {
      this.isShowEvaluateModal = false
    },
    onChangeEvaluate() {
      if (this.form.candidateEvaluate) {
        this.$swal
          .fire({
            title: 'Bạn có chắc chắn?',
            text: 'Kết quả đánh giá hồ sơ sẽ được ghi nhận!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Đúng, lưu lại!',
            cancelButtonText: 'Bỏ qua',
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.handleChangeCandidateEvaluate()
            }
            this.isShowEvaluateModal = false
          })
      }
    },
    handleChangeCandidateEvaluate() {
      const title = 'Đánh giá'
      let profileUpdate = {
        result: this.form.resultCandidateEvaluate,
      }
      axios
        .put('/api/tuyen-dung/profile/' + this.currentProfile._id, {
          params: {
            action: 'updateCandidateEvaluate',
            status: this.form.candidateEvaluate.PK_iTrangthaiHosoTuyendungID,
            updateBy: this.$store.state.auth.currentUser.staff,
            profileUpdate,
            result: this.form.resultCandidateEvaluate
          },
        })
        .then((res) => {
          if (res.status === 200) {
            this.$emit('handleReloadList')
            this.$toastr.success(`Đã ${title} hồ sơ tuyển dụng.`, 'Thành công')
          } else {
            this.$toastr.error(
              `Đã có lỗi xảy ra khi ${title} hồ sơ tuyển dụng!`,
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error('Error: ', err)
          this.$toastr.error(`Không thể ${title} hồ sơ tuyển dụng!`, 'Thất bại')
        })
    },
    handleChangeEvaluateProfile(profile) {
      this.isShowEvaluateModal = true
      this.currentProfile = profile
      if (
        profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID > 3
      ) {
        this.form.candidateEvaluate = profile.FK_iTrangthaiHosoTuyendungID
        this.form.resultCandidateEvaluate = profile.sDanhgiaHoso
      }
    },
  },
}
</script>
<template>
  <div class="card">
    <div class="card-body">
      <h4 class="text-center text-uppercase">Danh sách hồ sơ</h4>
      <br />
      <table class="table table-hover">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ứng viên</th>
            <th>Ngày sinh</th>
            <th>G.tính</th>
            <th>Vị trí tuyển dụng</th>
            <th v-if="viewCall === 'themhoso'">Trạng thái</th>
            <th v-if="viewCall === 'danhgia'">Đánh giá</th>
            <th class="text-right">Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          <ProfileCell
            v-for="(profile, index) in listProfile"
            :key="profile._id"
            :index="index + 1"
            :profile="profile"
            :candidate-evaluates="candidateEvaluates"
            :view-call="viewCall"
            @handleBtnEditProfile="handleBtnEditProfile"
            @handleBtnRemoveProfile="handleBtnRemoveProfile"
            @handleBtnChangeStatusProfile="handleBtnChangeStatusProfile"
            @handleChangeEvaluateProfile="handleChangeEvaluateProfile"
          />
        </tbody>
      </table>
      <b-modal
        id="modal-detail-plan"
        v-model="isShowEvaluateModal"
        centered
        title-class="font-18"
        hide-footer
        size="md"
        :title="'Đánh giá ứng viên: ' + currentProfile.sHotenUngvien"
        @hide="onCloseModal"
      >
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="candidate-evaluate"
              >Chọn đánh giá <span class="text-danger">*</span></label
            >
            <multiselect
              id="candidate-evaluate"
              v-model="form.candidateEvaluate"
              name="candidateEvaluate"
              label="sTenTrangthaiHosoTuyendung"
              track-by="_id"
              placeholder="Chọn đánh giá"
              :show-labels="false"
              :options="candidateEvaluates"
            ></multiselect>
            <div
              class="invalid-feedback"
              :class="{
                'invalid-feedback invalid-feedback-select':
                  submitted && !form.candidateEvaluate._id,
              }"
              >Vui lòng chọn đánh giá.</div
            >
          </div>
          <div class="form-group">
            <label for="content-evaluate">Nội dung đánh giá</label>
            <textarea
              id="content-evaluate"
              v-model="form.resultCandidateEvaluate"
              class="form-control"
              name="content-evaluate"
              rows="5"
            ></textarea>
          </div>

          <div class="form-group text-center m-b-0">
            <button
              class="btn btn-primary"
              name="action"
              value="danh-gia"
              type="submit"
            >
              <i class="uil uil-check"></i> Xác nhận</button
            >
            <button
              type="reset"
              class="btn btn-secondary m-l-5 ml-1"
              @click="onCloseModal"
            >
              <i class="uil uil-multiply"></i> Hủy</button
            >
          </div>
        </form>
      </b-modal>
    </div>
  </div>
</template>
<style scoped>
thead th {
  vertical-align: middle;
  text-align: center;
}
.invalid-feedback.invalid-feedback-select {
  display: block;
}
</style>