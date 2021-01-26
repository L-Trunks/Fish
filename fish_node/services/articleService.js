import mysql from '../database/mysql'
import errorNumber from '../config/errorNum'

//上传文章
async function addArticle(params) {
    let sql = `insert into f_article (title,content,user_id,sign,category_id) 
    values (${params.title},${params.content},${params.userId},${params.sign},${params.categoryId})`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//删除文章
async function deleteArticle(params) {
    let sql = `delete from f_article where id = ${params.articleId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//修改文章
async function updateArticle(params) {
    let sql = `update f_article set title = ${params.title},content = ${params.content},
    user_id = ${params.userId},sign = ${params.sign},category_id = ${params.categoryId} where id = ${params.articleId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//修改点赞评论收藏数
async function updateArticleCount(params) {
    let sql = `update f_article set goods_count = ${params.goodsCount},comments_count = ${params.commentsCount},
    collections_count = ${params.collectionsCount} where id = ${params.articleId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//浏览量+1
async function updateArticleLooksCount(params) {
    let sql = `update f_article set looks_count = ${+params.looksCount+1} where id = ${params.articleId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        } 
    })
}

//查询所有文章
async function selectAllArticle(params) {
    let sql = `select a.*,u.user_name,u.name,c.category_name from
    f_article a,f_user u,f_category c where a.category_id = c.id and a.user_id = u.id
    limit ${params.page - 1 * params.limit},${params.limit}
    order by a.ct ${params.order&&params.order&& 'asc'}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据分类查询文章
async function selectAllArticle(params) {
    let sql = `select a.*,u.user_name,u.name,c.category_name from
    f_article a,f_user u,f_category c where a.category_id = c.id and a.user_id = u.id
    and a.category_id = ${params.categoryId} limit ${params.page - 1 * params.limit},${params.limit}
    order by a.ct ${params.order&&params.order&& 'asc'}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}
//根据id查询文章
async function selectArticleById(params) {
    let sql = `select a.*,u.user_name,u.name,c.category_name from
    f_article a,f_user u,f_category c where a.category_id = c.id and a.user_id = u.id 
    and a.id = ${params.articleId}`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//模糊查询
async function selectArticleByLike(params) {
    let sql = `select a.*,u.user_name,u.name,c.category_name from
     f_article a,f_user u,f_category c where a.user_id = u.id and a.category_id = c.id 
     and a.content like '%${params.keyword}%' or a.sign like '%${params.keyword}%' or 
     a.title like '%${params.keyword}%' limit ${params.page - 1 * params.limit},${params.limit}
     order by a.ct ${params.order&&params.order&& 'asc'}`
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
    addArticle: addArticle,
    deleteArticle:deleteArticle,
    updateArticle:updateArticle,
    updateArticleCount:updateArticleCount,
    updateArticleLooksCount:updateArticleLooksCount,
    selectArticleByLike:selectArticleByLike,
    selectArticleById:selectArticleById,
    selectAllArticle:selectAllArticle
}