// [Require Library]
const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const ora = require('ora'); // cool spinner
const { MongoClient } = require("mongodb");
const SyncMoTMy = require("./sync/mongo-to-mysql")
// [End require library]

// [Define parameter]
const spinner = ora({
    text: '🛸 Waiting for database events... 🛸\n',
    color: 'blue',
    spinner: 'dots2'
});
const uri = 'mongodb://localhost:27020'; //,localhost:27019,localhost:27020/qlns?replicaSet=rs0';
// [End define parameter]

const program = async () => {
    // [Sync Mysql]
    // const connection = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'phpmyadmin',
    //     password: ''
    // });

    // const instance = new MySQLEvents(connection, {
    //     startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
    // });

    // await instance.start();

    // instance.addTrigger({
    //     name: 'monitoring all statments',
    //     expression: 'qlns.*', // listen to TEST database !!!
    //     statement: MySQLEvents.STATEMENTS.ALL, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
    //     onEvent: e => {
    //         console.log(e.affectedRows);
    //         spinner.succeed('👽 _EVENT_ 👽');
    //         spinner.start();
    //     }
    // });

    // instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    // instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
    // [End sync Mysql]

    // [Sync MongoDB]
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db("qlns");
    // Define table for sync 
    const tbl_nhanvien = database.collection("tbl_nhanvien");
    const tbl_bophan = database.collection("tbl_bophan");
    const tbl_quatrinh_lamviec = database.collection("tbl_quatrinh_lamviec");
    const tbl_vitri_congviec = database.collection("tbl_vitri_congviec");

    // Listen event change
    NVStream = tbl_nhanvien.watch();
    BPStream = tbl_bophan.watch();
    QTLVStream = tbl_quatrinh_lamviec.watch();
    VTCVStream = tbl_vitri_congviec.watch();
    
    // Handling
    NVStream.on("change", change => {
        console.log(`\n🕵 Nhân viên: ${change.operationType}`);
        switch (change.operationType) {
            case 'update': {
                SyncMoTMy.Update(change);
                break;
            }
            case 'insert': {
                SyncMoTMy.Insert(change);
                break;
            }
            case 'delete': {
                SyncMoTMy.Delete(change);
                break;
            }
        }
    });
    BPStream.on("change", change => {
        console.log(`\n🪑 Bộ phận: ${change.operationType}`);
        switch (change.operationType) {
            case 'update': {
                SyncMoTMy.Update(change);
                break;
            }
            case 'insert': {
                SyncMoTMy.Insert(change);
                break;
            }
            case 'delete': {
                SyncMoTMy.Delete(change);
                break;
            }
        }
    });
    QTLVStream.on("change", change => {
        console.log(`\n⚡ Quá trình làm việc: ${change.operationType}`);
        switch (change.operationType) {
            case 'update': {
                SyncMoTMy.Update(change);
                break;
            }
            case 'insert': {
                SyncMoTMy.Insert(change);
                break;
            }
            case 'delete': {
                SyncMoTMy.Delete(change);
                break;
            }
        }
    });
    VTCVStream.on("change", change => {
        console.log(`\n⚡ Vị trí công việc: ${change.operationType}`);
        switch (change.operationType) {
            case 'update': {
                SyncMoTMy.Update(change);
                break;
            }
            case 'insert': {
                SyncMoTMy.Insert(change);
                break;
            }
            case 'delete': {
                SyncMoTMy.Delete(change);
                break;
            }
        }
    });
    // [End sync Mongodb]
};

program()
  .then(spinner.start.bind(spinner))
  .catch(console.error);