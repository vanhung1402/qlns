module.exports = {
    url: 'mongodb://mongo_sync:27011,mongo2:27012,mongo3:27013/' + 'mongo_sync?replicaSet=rs0',
    column_not_sync: [
        'PK_iNguoithemID',
        'FK_iDantocID',
        'FK_iTongiaoID',
        'FK_iNguoicapnhatID',
        'sMasothue',
        'sTrinhdoVanhoa',
        'sMotaBanthan',
        'sDuongdanSoyeuLylich',
        'sNoicapCMND',
        'sNoicapCMND',
        'dNgaycapCMND',
        'sCMND',
        '__v',
    ]
  };