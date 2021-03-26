/** tbl_nhanvien
 *  
 * FK_iDantocID
 * FK_iTongiaoID
 * sMasothue
 * sTrinhdoVanhoa
 * sMotaBanthan
 * sDuongdanSoyeuLylich
 * sNoicapCMND
 * dNgaycapCMND
 * sCMND
 * 
 */

/** tbl_bophan
 *  
 * __v
 * 
 */

const moment = require('moment');
const arrayDateColumn = ['dngaysinh', 'dngaycapcmnd', 'dngaybatdau', 'dngaykethuc']
const arrayDateTimeColumn = ['tthoigianchuyen', 'dngaycapcmnd', 'dngayky', 'dngaycohieuluc', 'dngayhethan']
const arrayNumberColumn = ['bgioitinh']

const convertISOtoDateTime = (strDate, format = 'YYYY-MM-DD') => {
    return moment(String(strDate)).format(format)
}

// For update
module.exports.Update = function (msg) { 
    const column_not_sync = require('../config/database').column_not_sync;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "phpmyadmin",
        password: "",
        database: "qlns"
    });
    const CHANGE = msg.updateDescription.updatedFields;
    column_not_sync.forEach(
        element => {
            delete CHANGE[element];
        }
    );
    if (Object.keys(CHANGE).length != 0) {
        const table_name = msg.ns.coll;
        const _id = msg.documentKey._id;
        var pg_sql = `UPDATE ${table_name} SET `;
        var my_sql = `UPDATE ${table_name} SET `;
        for (const [col, value] of Object.entries(CHANGE)) {
            if (arrayDateColumn.indexOf(col.toLowerCase()) !== -1) {
                pg_sql += `"${col.toLowerCase()}" = '${convertISOtoDateTime(value, 'YYYY-MM-DD')}' `
                my_sql += `${col} = '${convertISOtoDateTime(value, 'YYYY-MM-DD')}' ` 
            } else if (arrayDateTimeColumn.indexOf(col.toLowerCase()) !== -1) {
                pg_sql += `"${col.toLowerCase()}" = '${convertISOtoDateTime(value, 'YYYY-MM-DD HH:mm:ss')}' `
                my_sql += `${col} = '${convertISOtoDateTime(value, 'YYYY-MM-DD HH:mm:ss')}' `   
            } else {
                pg_sql += `"${col.toLowerCase()}" = '${value}' `
                if (arrayNumberColumn.indexOf(col.toLowerCase()) !== -1) {
                    my_sql += `${col} = ${value} `
                } else {
                    my_sql += `${col} = '${value}' `   
                }
            }
        }
        pg_sql += `WHERE "_id" = '${_id}'`;
        my_sql += `WHERE _id = '${_id}'`;
        con.connect(function(err) {
            if (err) throw err;
            con.query(my_sql, function (err, result) {
                if (err) throw err;
                console.log("🤖 _" + result.affectedRows + " Record Update_ 🤖");
            });
        });
    }
    const { Client } = require('pg');
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'QLNS',
        password: '1',
        port: 5432,
    });
    client.connect();
    client.query(pg_sql, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("🤖 _" + res.rowCount + " Record Update_ 🤖");
        client.end();
    });
};

// For insert
module.exports.Insert = async function (msg) { 
    const column_not_sync = require('../config/database').column_not_sync;
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "phpmyadmin",
        password: "",
        database: "qlns"
    });
    const INSERT = msg.fullDocument;
    const INSERT_PG = {...msg.fullDocument};

    for (const [col, value] of Object.entries(INSERT)) {
        let formatValue = value;
        if (arrayDateColumn.indexOf(col.toLowerCase()) !== -1) {
            formatValue = value ? convertISOtoDateTime(value, 'YYYY-MM-DD') : '';
        } else if (arrayDateTimeColumn.indexOf(col.toLowerCase()) !== -1) {
            formatValue = value ? convertISOtoDateTime(value, 'YYYY-MM-DD HH:mm:ss') : '';
        }
        INSERT_PG[col] = `'${formatValue}'`;
        if (arrayNumberColumn.indexOf(col.toLowerCase()) === -1) {
            formatValue = `'${formatValue}'`;
        }
        INSERT[col] = formatValue
    }
    // Check item exist in table 
    const table_name = msg.ns.coll;
    const query_check = `SELECT * FROM ${table_name} WHERE _id = ${INSERT._id}`;
    column_not_sync.forEach(
        element => {
            delete INSERT[element];
            delete INSERT_PG[element];
        }
    );

    const column_name = Object.keys(INSERT);
    const column_data = Object.values(INSERT);
    const column_name_pg = Object.keys(INSERT_PG);
    const column_data_pg = Object.values(INSERT_PG);
    // For Mysql
    var pg_sql = `INSERT INTO ${table_name} ("${column_name_pg.join("\",\"").toLowerCase()}") VALUES (${column_data_pg.join(",")})`;
    var my_sql = `INSERT INTO ${table_name} (${column_name.join(",")}) VALUES (${column_data.join(",")});`;

    my_sql = my_sql.replace(/''/g, 'NULL');
    con.connect(function(err) {
        if (err) throw err;
        con.query(query_check, function (err, result, fields) {
            if (err) throw err;
            if (result.length == 0){
                con.query(my_sql, function (err, result) {
                    if (err) throw err;
                    console.log("🤖 _" + result.affectedRows + " Record Insert_ 🤖");
                });
            }
        });
    });

    // For postgres
    pg_sql = pg_sql.replace(/''/g, 'NULL');
    check(query_check, pg_sql);
};

// Check 

const check = async (sql, insert) => {
    const { Client } = require('pg');
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'QLNS',
        password: '1',
        port: 5432,
    });
    await client.connect();
    client.query(sql, (err, res) => {
        if (err) throw err;
        if(res && res.rowCount == 0) {
            client.query(insert, (err, res) => {
                if (err) {
                    console.log(insert);
                    throw err;
                    return;
                }
                console.log("🤖 _" + res.rowCount + " Record Install 🤖");
                client.end();
            });
        }
    });
}
// For Delete
module.exports.Delete = function (msg) { 
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "phpmyadmin",
        password: "",
        database: "qlns"
    });
    const table_name = msg.ns.coll;
    const _id = msg.documentKey._id;
    const sql = `DELETE FROM ${table_name} WHERE _id = '${_id}'`;
    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("🤖 _" + result.affectedRows + " Record Delete_ 🤖");
        });
    });
    const { Client } = require('pg');
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'QLNS',
        password: '1',
        port: 5432,
    });
    client.connect();
    client.query(sql, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("🤖 _" + res.rowCount + " Record Delete_ 🤖");
        client.end();
    });
};