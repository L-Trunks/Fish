'use strict';
const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 50,
    host: 'http://149.129.59.121:3306',
    user: 'root',
    password: 'aliyun1998',
    database: 'fish',
    multipleStatements: true  //是否允许执行多条sql语句
});

//执行代码，返回执行结果
var execute = (sql, ...params) => {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
                return;
            }
            connection.query(sql, params, function (error, res) {
                connection.release();
                if (error) {
                    reject(error);
                    return;
                }
                resolve(res);
            });
        });
    });
}

//模块导出
module.exports = {
    execute: execute
}