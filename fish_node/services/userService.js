import mysql from '../database/mysql'

//用户注册
async function userRegister(params) {
    let sql = `insert into f_user (user_name,pass_word,name,permission,introduce,img_url) values (
        ${params.userName},${params.passWord},${params.name},${params.permission || 1},${params.introduce || ''},${params.img_url || ''}
    )`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//用户登录
async function userLogin(params) {
    let sql = `select user_name,name,permission,introduce,img_url from f_user where user_name = ${params.userName} and pass_word = ${params.passWord}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//验证用户名
async function verifyUserName(params) {
    let sql = `select user_name from f_user where user_name = ${params.userName}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//查询所有用户
async function selectAllUser(params) {
    let sql = `select user_name,name,permission,introduce,img_url from f_user limit ${params.page - 1 * params.number},${params.number}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据id查询用户信息
async function selectUserById(params) {
    let sql = `select user_name,name,permission,introduce,img_url from f_user where id = ${params.userId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//修改用户信息
async function updateUserById(params) {
    let sql = `update f_user set 
    user_name = ${params.userName},name = ${params.name},permission = ${params.permission},introduce = ${params.introduce},img_url=${params.img_url} where id = ${params.userId }`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}
module.exports = {
    userRegister: userRegister,
    userLogin: userLogin,
    verifyUserName: verifyUserName,
    selectAllUser: selectAllUser,
    selectUserById: selectUserById,
    updateUserById:updateUserById
}