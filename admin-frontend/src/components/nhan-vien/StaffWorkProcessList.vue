<script>
import btnTooltip from '@components/button-tooltip'
import moment from 'moment'

export default {
  components: { btnTooltip },
  filters: {
    momentVNDate: function (date) {
      return moment(date).format('DD/MM/YYYY')
    },
    momentENDate: function (date) {
      return moment(date).format('YYYY/MM/DD')
    },
  },
  props: {
    listWorkProcess: {
      type: Array,
      default: () => [],
    },
    isShowBtnAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listJobPosition: [],
      dNgayKethucConfig: {
        enableTime: false,
        dateFormat: 'd/m/Y',
        minDate: new Date(),
      },
      submitted: false,
      workProcessChange: {},
      form: {
        dNgayKethuc: new Date(),
        sGhichu: '',
      },
    }
  },
  created() {
    this.loadJobPosition()
  },
  methods: {
    loadJobPosition() {
      this.$recruitment
        .get('/api/cau-hinh/list-job-position')
        .then((res) => {
          if (res.status === 200) {
            let listJobPosition = {}
            res.data.forEach((job) => {
              listJobPosition[job._id] = job
            })
            this.listJobPosition = listJobPosition
          }
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleBtnAddLaborContractClick(data) {
      let routeData = this.$router.resolve({
        name: 'LaborContractWorkProcess',
        params: { profileId: data.FK_iNhanvienID, workProcessId: data._id },
      })
      window.open(routeData.href, '_blank')
    },
    handleBtnEndLaborContractClick(workProcess) {
      let dNgayBatdau = new Date(workProcess.dNgayBatdau)
      this.dNgayKethucConfig.minDate = dNgayBatdau.setDate(
        dNgayBatdau.getDate() + 1
      )
      this.dNgayKethucConfig.minDate = new Date(this.dNgayKethucConfig.minDate).setHours(0, 0, 0, 0)
      this.workProcessChange = workProcess
    },
    handleBtnAddWorkProcessClick() {
      let routeData = this.$router.resolve({
        name: 'WorkProcess',
        params: { profileId: this.$router.currentRoute.params.profileId },
      })
      window.open(routeData.href, '_blank')
    },
    handleResetForm() {
      this.form = {
        dNgayKethuc: new Date(),
        sGhichu: '',
      }
      this.submitted = false
    },
    handleSubmit(){
      this.submitted = true
      if (!this.checkAvailableDate(this.form.dNgayKethuc, this.dNgayKethucConfig.minDate, '>=')) return false
      if (!this.isValidDate(new Date(this.form.dNgayKethuc))){
        this.form.dNgayKethuc = new Date(this.convertDate(this.form.dNgayKethuc))
      }
      this.handleCheckoutWorkProcess()
    },
    handleCheckoutWorkProcess() {
      let checkOut = {...this.form}
      if (!this.isValidDate(checkOut.dNgayKethuc)){
        checkOut.dNgayKethuc = this.convertDate(checkOut.dNgayKethuc)
      }
      checkOut.dNgayKethuc = new Date(checkOut.dNgayKethuc)
      
    },
    isValidDate(date) {
      return date instanceof Date && !isNaN(date)
    },
    convertDate(dateOld) {
      let date = dateOld.split('/')
      let newDate = [date[1], date[0], date[2]]
      return newDate.join('/')
    },
    checkAvailableDate(dateString, dateCompare = null, condition = null) {
      let newDate = this.isValidDate(dateString)
        ? dateString
        : this.convertDate(dateString)
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
  },
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="text-uppercase">Lịch sử làm việc</h5>
      <hr />
      <div class="table-responsive">
        <table class="table table-border">
          <thead>
            <tr>
              <th>Vị trí công việc</th>
              <th>Bộ phận</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Ghi chú</th>
              <th class="text-right">Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(workProcess, index) in listWorkProcess" :key="index">
              <td>{{
                listJobPosition[workProcess.FK_iVitriCongviecID]
                  ? listJobPosition[workProcess.FK_iVitriCongviecID]
                      .sTenVitriCongviec
                  : ''
              }}</td>
              <td>{{
                listJobPosition[workProcess.FK_iVitriCongviecID]
                  ? listJobPosition[workProcess.FK_iVitriCongviecID]
                      .FK_iBophanID.sTenBophan
                  : ''
              }}</td>
              <td>{{ workProcess.dNgayBatdau | momentVNDate }}</td>
              <td>
                <span v-if="workProcess.dNgayKethuc">{{
                  workProcess.dNgayKethuc | momentVNDate
                }}</span>
              </td>
              <td>{{ workProcess.sGhichu }}</td>
              <td class="text-right">
                <btnTooltip
                  v-if="
                    workProcess.dNgayKethuc === '' ||
                    new Date() < new Date(workProcess.dNgayKethuc)
                  "
                  :btn-id="'btn-labor-contract-info-' + index"
                  :btn-type="'success'"
                  :btn-data="workProcess"
                  :btn-tooltip-text="'Tạo mới / gia hạn hợp đồng'"
                  :btn-icon="'uil uil-file-plus-alt'"
                  @onBtnClick="handleBtnAddLaborContractClick"
                />
                <btnTooltip
                  v-if="workProcess.dNgayKethuc === ''"
                  v-b-modal.modal-sm
                  :btn-id="'btn-labor-contract-end-' + index"
                  :btn-type="'warning'"
                  :btn-data="workProcess"
                  :btn-tooltip-text="'Kết thúc vị trí'"
                  :btn-icon="'uil uil-check-square'"
                  @onBtnClick="handleBtnEndLaborContractClick"
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr v-if="isShowBtnAdd">
              <th colspan="6" class="text-right">
                <btnTooltip
                  :btn-id="'btn-add-work-process-'"
                  :btn-type="'primary'"
                  :btn-tooltip-text="'Thuyên chuyển vị trí công việc'"
                  :btn-icon="'uil uil-plus'"
                  @onBtnClick="handleBtnAddWorkProcessClick"
                />
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
      <b-modal
        id="modal-sm"
        size="sm"
        title="Kết thúc vị trí công việc"
        title-class="font-18"
        hide-footer
      >
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="ngay-ket-thuc-cong-viec"
              >Ngày kết thúc <span class="text-danger">*</span></label
            >
            <flat-pickr
              id="ngay-ket-thuc-cong-viec"
              v-model="form.dNgayKethuc"
              :config="dNgayKethucConfig"
              class="form-control"
              placeholder="dd/mm/yyyy"
              :class="{
                'is-invalid':
                  submitted && !checkAvailableDate(form.dNgayKethuc, dNgayKethucConfig.minDate, '>='),
              }"
            ></flat-pickr>
            <div
              v-if="submitted && !checkAvailableDate(form.dNgayKethuc, dNgayKethucConfig.minDate, '>=')"
              class="invalid-feedback"
              >Ngày kết thúc công việc không hợp lệ</div
            >
          </div>
          <div class="form-group">
            <label for="ghi-chu">Ghi chú:</label>
            <textarea
              id="ghi-chu"
              rows="5"
              class="form-control"
              placeholder="VD: Hết nhiệm kỳ..."
            ></textarea>
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
              @click="handleResetForm"
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
}
table.table tr td {
  vertical-align: middle;
}
td.btn-action {
  min-width: 120px;
}
.invalid-feedback.invalid-feedback-select {
  display: block;
}
</style>