import mysql from '../database/mysql'
import errorNumber from '../config/errorNum'
//上传文章
async function addArticle(params) {
    let sql = 'insert into f_article () values ()'
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