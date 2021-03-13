import { request, response } from 'express'
import Department from '../database/models/cau-hinh/department'
import Nation from '../database/models/danh-muc/nation'
import Religion from '../database/models/danh-muc/religion'

exports.setListDepartment = (request, response) => {
    // let id = Date.now()
    // let example = [
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP tuyển dụng',
    //         iThutuBophan: 1,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP lương thưởng và phúc lợi',
    //         iThutuBophan: 2,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP hành chính',
    //         iThutuBophan: 3,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP kế hoạch',
    //         iThutuBophan: 4,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP kế toán',
    //         iThutuBophan: 5,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP Marketing',
    //         iThutuBophan: 6,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP Sale',
    //         iThutuBophan: 7,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP kho',
    //         iThutuBophan: 8,
    //     },
    //     {
    //         PK_iBophanID: id++,
    //         sTenBophan: 'BP chăm sóc khách hàng',
    //         iThutuBophan: 9,
    //     },
    // ]

    // example.forEach(depart => {
    //     let newDepartment = new Department(depart)
    //     newDepartment.save()
    // });
    // let id = Date.now()
    // let example = [
    //     { 
    //         "PK_iDantocID" : 1614285708689.0, 
    //         "sTenDantoc" : "Kinh", 
    //     },
    //     { 
    //         "PK_iDantocID" : 1614285708688.0, 
    //         "sTenDantoc" : "Mường", 
    //     },
    //     { 
    //         "PK_iDantocID" : 1614285708687.0, 
    //         "sTenDantoc" : "Thái", 
    //     },
    //     { 
    //         "PK_iDantocID" : 1614285708686.0, 
    //         "sTenDantoc" : "Giao",
    //     }
    // ]

    // example.forEach(depart => {
    //     let newDepartment = new Nation(depart)
    //     newDepartment.save()
    // });

    // let id = Date.now()
    // let example = [
    //     { 
    //         "PK_iTongiaoID" : 1614285708689.0, 
    //         "sTenTongiao" : "Không", 
    //     },
    //     { 
    //         "PK_iTongiaoID" : 1614285708688.0, 
    //         "sTenTongiao" : "Công giáo", 
    //     },
    //     { 
    //         "PK_iTongiaoID" : 1614285708687.0, 
    //         "sTenTongiao" : "Phật giáo", 
    //     },
    //     { 
    //         "PK_iTongiaoID" : 1614285708686.0, 
    //         "sTenTongiao" : "Đạo Hồi",
    //     }
    // ]

    // example.forEach(depart => {
    //     let newDepartment = new Religion(depart)
    //     newDepartment.save()
    // });
}