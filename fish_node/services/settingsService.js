import mysql from '../database/mysql'
import errorNumber from '../config/errorNum'

//添加设置（公告或轮播图信息）
async function addSettings(params) {
    let sql = `insert into f_rotation_img (title,img_url,info,content,sign,type) values (${params.title},${params.imgUrl},${params.info},${params.content},${params.sign},${params.type})`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//删除设置
async function deleteSettings(params) {
    let sql = `delete from f_rotation_img where id = ${params.settingsId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//修改设置
async function updateSettings(params) {
    let sql = `update f_rotation_img set title = ${params.title},img_url = ${params.imgUrl},info = ${params.info},content = ${params.content},sign = ${params.sign},type=${params.type}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据类型查询设置信息
async function selectSettingsByType(params) {
    let sql = `select r.*,u.name from f_rotation_img r,f_user u where r.user_id = u.id and r.type = ${params.type} order by ct`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据id查询设置信息
async function selectSettingsById(params) {
    let sql = `select r.*,u.name from f_rotation_img r,f_user u where r.user_id = u.id and r.id = ${params.settingsId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//查询所有设置信息
async function selectAllSettings(params) {
    let sql = `select r.*,u.name from f_rotation_img r,f_user u where r.user_id = u.id limit limit ${(params.page - 1) * params.limit},${params.limit}`
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
    addSettings: addSettings,
    deleteSettings:deleteSettings,
    updateSettings:updateSettings,
    selectSettingsByType:selectSettingsByType,
    selectSettingsById:selectSettingsById,
    selectAllSettings:selectAllSettings
}