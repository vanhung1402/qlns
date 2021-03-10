import RecruitmentProfile from '../../database/models/tuyen-dung/profile'

exports.getList = (request, response) => {
	let status = request.body.status
	let findCondition = {}
	if (status) {
		findCondition = { FK_iTrangthaiHosoID: status }
	}
	RecruitmentProfile.find(findCondition, function (err, profile) {
		if (err)
			response.send(err)
		response.json(profile)
	})
}

exports.addNew = (request, response) => {
	let newProfile = new RecruitmentProfile({
		sHotenUngvien: request.body.fullName,
		sTenUngvien: request.body.fullName,
		sEmailUngvien: request.body.email,
		sDienthoaiUngvien: request.body.phone,
		sDuongdanHosoUngvien: 'Duong dan',
		FK_iNguoiLuuID: 1,
		tThoigianLuu: Date.now(),
		bGioitinhUngvien: request.body.gender,
		dNgaysinhUngvien: request.body.birthDay,
		PK_iChitietKehoachTuyendungID: 0,
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
	if (request.params.profileId){
		deleteCondition._id = request.params.profileId
	}
	RecruitmentProfile.deleteOne(deleteCondition, (err, doc) => {
		if (err) throw err
		response.send(doc)
	})
}

exports.update = (request, response) => {
	const filter = { _id: request.params.profileId }
	const update = {
		sHotenUngvien: request.body.profileUpdate.fullName,
		sTenUngvien: request.body.profileUpdate.fullName,
		sEmailUngvien: request.body.profileUpdate.email,
		sDienthoaiUngvien: request.body.profileUpdate.phone,
		tThoigianLuu: Date.now(),
		bGioitinhUngvien: request.body.profileUpdate.gender,
		dNgaysinhUngvien: request.body.profileUpdate.birthDay,
	}
	RecruitmentProfile.findOneAndUpdate(filter, update, {new: true}, (err, doc) => {
		if (err) throw err
		response.send(doc)
	})
}