import mysql from '../database/mysql'
import errorNumber from '../config/errorNum'

//添加文章信息(添加点赞、评论、收藏信息)
async function addArticleInfo(params) {
    let sql = `insert into f_article_info (type,comment_info,user_id,article_id,ct) values ('${params.type}','${params.commentInfo}','${params.userId}','${params.articleId}',NOW())`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//删除文章信息
async function deleteArticleInfo(params) {
    let sql = `delete from f_article_info where id = '${params.articleInfoId}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//修改文章信息
async function updateArticleInfo(params) {
    let sql = `update f_article_info set type = '${params.type}',comment_info = '${params.commentInfo}',user_id = '${params.userId}',article_id = '${params.articleId}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据类型查询文章信息
async function selectArticleInfoByType(params) {
    let sql = `select i.*,a.*,u.name from f_article_info i,f_article a,f_user u where i.user_id = u.id and i.article_id = a.id and i.type = '${params.type}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据id查询文章信息
async function selectArticleInfoById(params) {
    let sql = `select i.*,a.*,u.name from f_article_info i,f_article a,f_user u where i.user_id = u.id and i.article_id = a.id and i.id = '${params.articleInfoId}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据文章和类型查询文章信息
async function selectArticleInfoByArticleAndType(params) {
    let sql = `select i.*,a.*,u.name from f_article_info i,f_article a,f_user u where i.user_id = u.id and i.article_id = a.id and i.article_id = '${params.articleId}' and i.type = '${params.type}'`
    let data = await mysql.execute(sql)
    return new Promise((resolve, reject) => {
        if (data && data.errno) {
            reject(data)
        } else {
            resolve(data)
        }
    })
}

//根据文章查询文章信息
async function selectArticleInfoByArticle(params) {
    let sql = `select i.*,a.*,u.name from f_article_info i,f_article a,f_user u where i.user_id = u.id and i.article_id = a.id and i.article_id = '${params.articleId}' order by i.ct`
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
    addArticleInfo: addArticleInfo,
    deleteArticleInfo:deleteArticleInfo,
    updateArticleInfo:updateArticleInfo,
    selectArticleInfoByType:selectArticleInfoByType,
    selectArticleInfoById:selectArticleInfoById,
    selectArticleInfoByArticleAndType:selectArticleInfoByArticleAndType,
    selectArticleInfoByArticle:selectArticleInfoByArticle
}