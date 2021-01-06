const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
const articleService = require('../services/articleService')
//根据id获取文章信息
router.get('/add_article', function (req, res, next) {
    let articleData = req.query
    console.log(articleData)
    articleService.addArticle(articleData).then(result => {
        console.log('数据::::' + result)
        res.json({ code: '200', data: result })
    }).catch(err => {
        console.log('出现错误:' + JSON.stringify(err))
        next(err);
    })
});
//修改文章信息
router.post('/update_article', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let articleData = req.body
    console.log(articleData)
    if (token.checkToken(accessToken)) {
        articleService.updateArticle(articleData,
            function (error, data) {
                if (error) {
                    console.log('出现错误:' + JSON.stringify(error))
                    next(error);
                } else {
                    console.log(JSON.stringify(error), '数据::::' + data)
                    res.json({ code: '200', data: data });
                }
            })
    } else {
        res.json(errorNumber.TOKEN_TIME_OUT())
    }

});

module.exports = router;