import { request, response } from 'express'
import Department from '../database/models/cau-hinh/department'

exports.setListDepartment = (request, response) => {
    let id = Date.now()
    let example = [
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP tuyển dụng',
            iThutuBophan: 1,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP lương thưởng và phúc lợi',
            iThutuBophan: 2,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP hành chính',
            iThutuBophan: 3,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP kế hoạch',
            iThutuBophan: 4,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP kế toán',
            iThutuBophan: 5,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP Marketing',
            iThutuBophan: 6,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP Sale',
            iThutuBophan: 7,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP kho',
            iThutuBophan: 8,
        },
        {
            PK_iBophanID: id++,
            sTenBophan: 'BP chăm sóc khách hàng',
            iThutuBophan: 9,
        },
    ]

    example.forEach(depart => {
        let newDepartment = new Department(depart)
        newDepartment.save()
    });
}