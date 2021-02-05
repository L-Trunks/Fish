import mysql from '../database/mysql'
import errorNumber from '../config/errorNum'

//添加分类
async function addCategory(params) {
    let sql = `insert into f_category (category_name,category_intro,user_id,status,type,ct) values ('${params.categoryName}','${params.categoryIntro}','${params.userId}','${params.status}','${params.type}',NOW())`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//删除分类
async function deleteCategory(params) {
    let sql = `delete from f_category where id = '${params.categoryId}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//修改分类
async function updateCategory(params) {
    let sql = `update f_category set category_intro = '${params.categoryIntro}',category_name = '${params.categoryName}',user_id = '${params.userId}',status = '${params.status}',type = '${params.type}' where id = '${params.categoryId}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//查询所有分类
async function selectAllCategory(params) {
    let sql = `select SQL_CALC_FOUND_ROWS c.*,u.name from f_category c,f_user u where c.user_id = u.id order by ct desc limit ${(params.page - 1) * params.limit},${params.limit};SELECT FOUND_ROWS() as total;`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//根据id查询分类
async function selectCategoryById(params) {
    let sql = `select * from f_category where id  = '${params.categoryId}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//根据类型查询分类
async function selectCategoryByType(params) {
    let sql = `select SQL_CALC_FOUND_ROWS * from f_category where type  = '${params.type}' limit ${(params.page - 1) * params.limit},${params.limit};SELECT FOUND_ROWS() as total;`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//根据用户查询分类
async function selectCategoryByUser(params) {
    let sql = `select SQL_CALC_FOUND_ROWS * from f_category where user_id  = '${params.userId}' limit ${(params.page - 1) * params.limit},${params.limit};SELECT FOUND_ROWS() as total;`
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
    addCategory: addCategory,
    updateCategory:updateCategory,
    deleteCategory:deleteCategory,
    selectCategoryById:selectCategoryById,
    selectCategoryByType:selectCategoryByType,
    selectCategoryByUser:selectCategoryByUser,
    selectAllCategory:selectAllCategory
}