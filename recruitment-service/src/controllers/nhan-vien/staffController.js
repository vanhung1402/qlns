import tbl_nhanvien from '../../database/models/nhan-vien/staff'
import { format as dateFormat, compareAsc } from 'date-fns'

exports.addExample = () => {
    let id = Date.now()
    let example = [
        {
            PK_iNhanvienID: id,
            sHoten: 'Bùi Văn Hùng',
            sTen: 'Hùng',
            dNgaysinh: new Date('06/30/1999'),
            bGioitinh: 1,
            sDiachi: '296 Minh Khai, Hai Bà trung, Hà Nội',
            sDienthoai: '0329-222-617',
            sEmail: 'vanhung14.2.2017@gmail.com',
            sCMND: '113704072',
            sMasothue: '1',
            sDuongdanSoyeuLylich: '',
        },
        {
            PK_iNhanvienID: id + 1,
            sHoten: 'Nguyễn Thị Hoài',
            sTen: 'Hoài',
            dNgaysinh: '11/16/1999',
            bGioitinh: 0,
            sDiachi: 'Khánh Vân, Yên Khánh, Ninh Bình',
            sDienthoai: '0396-338-034',
            sEmail: 'nguyenhoai161199@gmail.com',
            sCMND: '116372182',
            sMasothue: '3',
            sDuongdanSoyeuLylich: '',
        },
        {
            PK_iNhanvienID: id + 2,
            sHoten: 'Đặng Thị Hương Lan',
            sTen: 'Lan',
            dNgaysinh: '02/17/1999',
            bGioitinh: 0,
            sDiachi: 'Thái Thụy, Thái Bình',
            sDienthoai: '0398-982-172',
            sEmail: 'lantnd@gmail.com',
            sMasothue: '2',
            sCMND: '192736211',
        },
    ]
    tbl_nhanvien.deleteMany({}).exec()
    example.forEach(staffExample => {
        let newStaff = new Staff(staffExample)
        newStaff.save()
    });
}

exports.getList = (request, response) => {
    let filter = request.body.filter
    tbl_nhanvien
        .find(filter)
        .populate({
            path: 'FK_iVitriCongviecID',
            select: 'sTenVitriCongviec FK_iBophanID',
            populate: 'FK_iBophanID'
        })
        .exec(function (err, listStaff) {
            if (err)
                response.send(err)
            let listStaffFormat = listStaff.map(staff => {
                const formatStaff = JSON.parse(JSON.stringify(staff))
                formatStaff.tNgaysinh = dateFormat(staff.dNgaysinh, 'dd/MM/yyyy')
                return formatStaff
            })
            response.json(listStaffFormat)
        })
}