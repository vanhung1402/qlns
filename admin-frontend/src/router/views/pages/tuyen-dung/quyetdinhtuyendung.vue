<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

import { VueEditor } from 'vue2-editor'

export default {
  page: {
    title: 'Chi tiết quyết định tuyển dụng',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    VueEditor,
  },
  data() {
    return {
      title: 'Chi tiết quyết định tuyển dụng',
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
          text: 'quyết định tuyển dụng',
          active: true,
        },
      ],
      icon: 'info-circle',
      decision: {},
      decisionContent: '',
      isEdit: false,
      btnChangeTitle: 'Sửa đổi quyết định',
    }
  },
  created() {
    this.loadDecisionInfo()
  },
  methods: {
    loadDecisionInfo() {
      this.$recruitment
        .get(
          '/api/tuyen-dung/recruitment-decisions/' +
            this.$route.params.decisionId
        )
        .then((res) => {
          if (res.status === 200) {
            this.decision = res.data
            this.decisionContent = this.renderDecisionProfile(
              this.decision.FK_iHosoTuyendungID,
              this.decision.sNoidungQuyetdinhTuyendung
            )
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    renderDecisionProfile(profile, contentDecision) {
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
    onChangeMode() {
      this.isEdit = !this.isEdit
      this.btnChangeTitle = this.isEdit
        ? 'Xác nhận sửa đổi'
        : 'Sửa đổi quyết định'
    },
    onClickApprovedDecision() {
      this.$swal({
        title: 'Bạn có chắc chắn muốn duyệt?',
        text: 'Quyết định tuyển dụng này sẽ được phê duyệt',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý, duyệt ngay!',
        cancelButtonText: 'Bỏ qua',
      }).then((result) => {
        if (result.isConfirmed && this.decision._id) {
          this.handleChangeDecisionStatus(this.decision._id, 2)
        }
      })
    },
    onClickReapprovedDecision() {
      this.$swal({
        title: 'Bạn có chắc chắn muốn gửi lại để duyệt?',
        text: 'Quyết định tuyển dụng này sẽ được chờ phê duyệt',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý, chuyển ngay!',
        cancelButtonText: 'Bỏ qua',
      }).then((result) => {
        if (result.isConfirmed && this.decision._id) {
          this.handleChangeDecisionStatus(this.decision._id, 1)
        }
      })
    },
    async onClickRemoveDecision(){
      const btnRemoveDecision = await this.$swal.fire({
        input: 'textarea',
        inputLabel: 'Lý do hủy',
        inputPlaceholder: 'Nhập lý do hủy quyết định...',
        inputAttributes: {
          'aria-label': 'Nhập lý do hủy quyết định',
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Hủy',
        cancelButtonText: 'Giữ lại!',
      })

      if (btnRemoveDecision.isConfirmed) {
        if (btnRemoveDecision.value) {
          this.handleChangeDecisionStatus(
            this.decision._id,
            4,
            btnRemoveDecision.value
          )
        } else {
          this.$toastr.warning(
            'Chưa nhập lý do hủy quyết định tuyển dụng.',
            'Cảnh báo'
          )
        }
      }
    },
    async onClickReturnDecision() {
      const btnReturnDecision = await this.$swal.fire({
        input: 'textarea',
        inputLabel: 'Lý do gửi trả',
        inputPlaceholder: 'Nhập lý do gửi trả quyết định...',
        inputAttributes: {
          'aria-label': 'Nhập lý do gửi trả quyết định',
        },
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Gửi trả',
        cancelButtonText: 'Hủy!',
      })

      if (btnReturnDecision.isConfirmed) {
        if (btnReturnDecision.value) {
          this.handleChangeDecisionStatus(
            this.decision._id,
            3,
            btnReturnDecision.value
          )
        } else {
          this.$toastr.warning(
            'Chưa nhập lý do gửi trả quyết định tuyển dụng.',
            'Cảnh báo'
          )
        }
      }
    },
    handleChangeDecisionStatus(decisionUpdateId, status, reason = null) {
      this.$recruitment
        .put('/api/tuyen-dung/recruitment-decisions', {
          updateBy: this.$store.state.auth.currentUser.staff,
          decisionUpdateId,
          status,
          action: 'updateStatus',
          reason,
        })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$toastr.success(
              'Đã cập nhật trạng thái quyết định tuyển dụng.',
              'Thành công'
            )
            this.loadDecisionInfo()
          } else {
            this.$toastr.error(
              'Đã có lỗi xảy ra khi cập nhật trạng thái quyết định tuyển dụng.',
              'Thất bại'
            )
          }
        })
        .catch((err) => {
          console.error(err)
          this.$toastr.error(
            'Không thể cập nhật trạng thái quyết định tuyển dụng.',
            'Thất bại'
          )
        })
    },
    isShowWithStatus(status) {
      return (
        this.decision &&
        this.decision.FK_iTrangthaiQuyetdinhTuyendungID &&
        this.decision.FK_iTrangthaiQuyetdinhTuyendungID
          .PK_iTrangthaiQuyetdinhTuyendungID === status
      )
    },
    getStatusText() {
      let statusText = ''
      if (this.decision && this.decision.FK_iTrangthaiQuyetdinhTuyendungID) {
        if (
          this.decision.FK_iTrangthaiQuyetdinhTuyendungID
            .PK_iTrangthaiQuyetdinhTuyendungID === 2
        ) {
          statusText = `${this.decision.FK_iTrangthaiQuyetdinhTuyendungID.sTenTrangThaiQuyetDinhTuyenDung} lúc ${this.decision.txtThoigianDuyetQuyetdinhTuyendung} bởi ${this.decision.FK_iNguoiDuyetQuyetdinhTuyendungID.sHoten}`
        } else {
          let reason = (this.decision.FK_iTrangthaiQuyetdinhTuyendungID
            .PK_iTrangthaiQuyetdinhTuyendungID > 2) ? ` | Lý do: ${this.decision.sLydo}` : ''
          statusText = `${this.decision.FK_iTrangthaiQuyetdinhTuyendungID.sTenTrangThaiQuyetDinhTuyenDung} lúc ${this.decision.txtThoigianLapQuyetdinhTuyendung} bởi ${this.decision.FK_iNguoiLapQuyetdinhTuyendungID.sHoten}${reason}`
        }
      }
      return statusText
    },
    exportHTML() {
      var header = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word
        xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>`
      var footer = '</body></html>'
      var sourceHTML =
        header + document.getElementById('source-html').innerHTML + footer

      var source =
        'data:application/vnd.ms-word;charset=utf-8,' +
        encodeURIComponent(sourceHTML)
      var fileDownload = document.createElement('a')
      document.body.appendChild(fileDownload)
      fileDownload.href = source
      fileDownload.download = `Quyết định tuyển dụng - ${this.decision.FK_iHosoTuyendungID.sHotenUngvien}.doc`
      fileDownload.click()
      document.body.removeChild(fileDownload)
    },
  },
}
</script> 
 
<template>
  <Layout>
    <PageHeader :title="title" :items="items" :icon="icon" />

    <div class="card">
      <div class="card-body">
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-if="!isEdit"
          id="source-html"
          class="text-muted"
          v-html="decisionContent"
        >
        </div>
        <!--eslint-enable-->
        <vue-editor
          v-if="isEdit"
          id="decision-content"
          v-model="decision.sNoidungQuyetdinhTuyendung"
        ></vue-editor>
        <div class="text-center mt-5">
          <button
            v-if="isShowWithStatus(1)"
            type="button"
            class="btn btn-primary btn-sm m-1"
            @click="onChangeMode"
            ><i class="uil uil-edit-alt"></i> &nbsp;
            {{ btnChangeTitle }}</button
          >
          <button
            v-if="isShowWithStatus(1)"
            type="button"
            class="btn btn-success btn-sm m-1"
            @click="onClickApprovedDecision"
            ><i class="uil uil-check"></i> &nbsp; Duyệt quyết định</button
          >
          <button
            v-if="isShowWithStatus(1)"
            type="button"
            class="btn btn-warning btn-sm m-1"
            @click="onClickReturnDecision"
            ><i class="uil uil-corner-up-left"></i> &nbsp; Gửi trả quyết
            định</button
          >
          <button
            v-if="isShowWithStatus(3)"
            type="button"
            class="btn btn-warning btn-sm m-1"
            @click="onClickReapprovedDecision"
            ><i class="uil uil-corner-up-left"></i> &nbsp; Gửi lại quyết
            định</button
          >
          <button
            v-if="isShowWithStatus(1) || isShowWithStatus(3)"
            type="button"
            class="btn btn-danger btn-sm m-1"
            @click="onClickRemoveDecision"
            ><i class="uil uil-bolt-slash"></i> &nbsp; Hủy quyết
            định</button
          >
          <button
            v-if="isShowWithStatus(2)"
            type="button"
            class="btn btn-info btn-sm m-1"
            @click="exportHTML"
            ><i class="uil uil-file-download-alt"></i> &nbsp; Xuất file word</button
          >
        </div>
        <hr />
        <p class="text-center"
          ><b>{{ getStatusText() }}</b></p
        >
      </div>
    </div>
  </Layout>
</template>

<style>
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