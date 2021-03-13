import RecruitmentProfile from '../../database/models/tuyen-dung/recruitmentProfile'
import Staff from './../../database/models/nhan-vien/staff'
import RecruitmentProfileStatus from '../../database/models/danh-muc/recruitmentProfileStatus'

exports.getList = (request, response) => {
	let status = request.body.status
	let findCondition = {}
	// if (status) {
	// 	findCondition = { FK_iTrangthaiHosoID: status }
	// }
	RecruitmentProfile
		.find(findCondition)
		.populate({
			path: 'FK_iChitietKehoachTuyendungID',
			populate: [
				{
					path: 'FK_iKehoachTuyendungID',
					select: 'sTieudeKehoach',
				},
				{
					path: 'FK_iVitriCongviecID',
					select: 'sTenVitriCongviec',
				},
			]
		})
		.populate({
			path: 'FK_iTrangthaiHosoTuyendungID',
			select: 'PK_iTrangthaiHosoTuyendungID sTenTrangthaiHosoTuyendung'
		})
		.exec(findCondition, function (err, profile) {
			if (err)
				response.send(err)
			response.json(profile)
		})
}

exports.getListWithStatus = (request, response) => {
	let status = request.query.status


	RecruitmentProfile
		.find()
		.populate({
			path: 'FK_iChitietKehoachTuyendungID',
			populate: [
				{
					path: 'FK_iKehoachTuyendungID',
					select: 'sTieudeKehoach',
				},
				{
					path: 'FK_iVitriCongviecID',
					select: 'sTenVitriCongviec FK_iBophanID',
					populate: 'FK_iBophanID'
				},
			]
		})
		.populate({
			path: 'FK_iTrangthaiHosoTuyendungID',
			select: 'PK_iTrangthaiHosoTuyendungID sTenTrangthaiHosoTuyendung'
		})
		.exec(function (err, doc) {
			if (err)
				response.send(err)
			if (status){
				response.json(doc.filter(profile => {
					return status.includes(profile.FK_iTrangthaiHosoTuyendungID.PK_iTrangthaiHosoTuyendungID.toString())
				}))
			}else{
				response.json(doc)
			}
			
		})
}

exports.addNew = async (request, response) => {
	const profileStatus = await RecruitmentProfileStatus.findOne({ PK_iTrangthaiHosoTuyendungID: 1 })
	const createBy = await Staff.findOne({ PK_iNhanvienID: request.body.createBy })

	const newProfile = new RecruitmentProfile({
		PK_iHosoTuyendungID: request.body.profileId,
		sHotenUngvien: request.body.fullName,
		sTenUngvien: request.body.fullName,
		sEmailUngvien: request.body.email,
		sDienthoaiUngvien: request.body.phone,
		sDuongdanHosoUngvien: 'Duong dan',
		FK_iNguoiLuuID: createBy,
		tThoigianLuu: Date.now(),
		bGioitinhUngvien: request.body.gender,
		dNgaysinhUngvien: request.body.birthDay,
		sDiachiUngvien: request.body.address,
		FK_iChitietKehoachTuyendungID: request.body.planDetail,
		FK_iTrangthaiHosoTuyendungID: profileStatus
	})

	newProfile.save(function (err, profile) {
		if (err)
			response.send(err)
		response.json(profile)
	})
}

exports.delete = (request, response) => {
	let deleteCondition = {
		_id: null
	}
	if (request.params.profileId) {
		deleteCondition._id = request.params.profileId
	}
	RecruitmentProfile.deleteOne(deleteCondition, (err, doc) => {
		if (err) throw err
		response.send(doc)
	})
}

exports.update = async (request, response) => {
	const filter = { _id: request.params.profileId }
	const updateBy = await Staff.findOne({ PK_iNhanvienID: request.body.params.updateBy }).exec()
	let action = request.body.params.action
	let update = { FK_iNguoiLuuID: updateBy, tThoigianLuu: Date.now() }

	if (!updateBy) {
		action = ''
		update = {}
	}

	if (action === 'updateInfo') {
		update = {
			...update,
			sHotenUngvien: request.body.params.profileUpdate.fullName,
			sTenUngvien: request.body.params.profileUpdate.fullName,
			sEmailUngvien: request.body.params.profileUpdate.email,
			sDienthoaiUngvien: request.body.params.profileUpdate.phone,
			bGioitinhUngvien: request.body.params.profileUpdate.gender,
			dNgaysinhUngvien: request.body.params.profileUpdate.birthDay,
			sDiachiUngvien: request.body.params.profileUpdate.address,
			FK_iChitietKehoachTuyendungID: request.body.params.profileUpdate.planDetail,
		}
	} else if (action === 'updateStatus') {
		const profileStatus = await RecruitmentProfileStatus.findOne({ PK_iTrangthaiHosoTuyendungID: request.body.params.status })
		if (profileStatus) {
			update = {
				...update,
				FK_iTrangthaiHosoTuyendungID: profileStatus
			}
		}
	} else if (action === 'updateCandidateEvaluate') {
		const profileStatus = await RecruitmentProfileStatus.findOne({ PK_iTrangthaiHosoTuyendungID: request.body.params.status })
		update = { FK_iNguoiDanhgiaHosoID: updateBy, FK_iTrangthaiHosoTuyendungID: profileStatus, tThoigianDanhgiaHoso: Date.now(), sDanhgiaHoso: request.body.params.profileUpdate.result }
	}
	RecruitmentProfile.findOneAndUpdate(filter, update, { new: true }, (err, doc) => {
		if (err) throw err
		response.send(doc)
	})
}