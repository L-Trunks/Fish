import mysql from '../database/mysql'
import errorNumber from '../config/errorNum'
//上传文章
async function addArticle(articleData) {
    let sql = 'select * from f_article'
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
}