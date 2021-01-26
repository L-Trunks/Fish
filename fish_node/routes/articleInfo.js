const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
const articleInfoService = require('../services/articleInfoService')

//添加文章信息(添加点赞、评论、收藏信息)
router.post('/add_article_info', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        articleInfoService.addArticleInfo(params).then(result => {
            // console.log('数据::::' + result)
            res.json({ code: '200', data: result })
        }).catch(err => {
            console.log('出现错误:' + JSON.stringify(err))
            next(err);
            res.json({ code: '200', desc: '服务器跑丢了' })
        })
    } else {
        res.json(errorNumber.TOKEN_TIME_OUT())
    }
});


//删除设置
router.get('/delete_article_info', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        articleInfoService.deleteArticleInfo(params).then(result => {
            // console.log('数据::::' + result)
            res.json({ code: '200', data: result })
        }).catch(err => {
            console.log('出现错误:' + JSON.stringify(err))
            next(err);
            res.json({ code: '200', desc: '服务器跑丢了' })
        })
    } else {
        res.json(errorNumber.TOKEN_TIME_OUT())
    }
});

//修改文章信息
router.post('/update_article_info', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        articleInfoService.updateArticleInfo(params).then(result => {
            // console.log('数据::::' + result)
            res.json({ code: '200', data: result })
        }).catch(err => {
            console.log('出现错误:' + JSON.stringify(err))
            next(err);
            res.json({ code: '200', desc: '服务器跑丢了' })
        })
    } else {
        res.json(errorNumber.TOKEN_TIME_OUT())
    }
});

//根据类型查询文章信息
router.get('/select_article_info_by_type', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        articleInfoService.selectArticleInfoByType(params).then(result => {
            // console.log('数据::::' + result)
            res.json({ code: '200', data: result })
        }).catch(err => {
            console.log('出现错误:' + JSON.stringify(err))
            next(err);
            res.json({ code: '200', desc: '服务器跑丢了' })
        })
    } else {
        res.json(errorNumber.TOKEN_TIME_OUT())
    }
});

//根据id查询文章信息
router.get('/select_article_info_by_id', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        articleInfoService.selectArticleInfoById(params).then(result => {
            // console.log('数据::::' + result)
            res.json({ code: '200', data: result })
        }).catch(err => {
            console.log('出现错误:' + JSON.stringify(err))
            next(err);
            res.json({ code: '200', desc: '服务器跑丢了' })
        })
    } else {
        res.json(errorNumber.TOKEN_TIME_OUT())
    }
});

//根据文章和类型查询文章信息
router.get('/select_article_info_by_article_and_type', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleInfoService.selectArticleInfoByArticleAndType(params).then(result => {
        // console.log('数据::::' + result)
        res.json({ code: '200', data: result })
    }).catch(err => {
        console.log('出现错误:' + JSON.stringify(err))
        next(err);
        res.json({ code: '200', desc: '服务器跑丢了' })
    })
    // } else {
    //     res.json(errorNumber.TOKEN_TIME_OUT())
    // }
});

//根据文章查询文章信息
router.get('/select_article_info_by_article', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleInfoService.selectArticleInfoByArticle(params).then(result => {
        // console.log('数据::::' + result)
        res.json({ code: '200', data: result })
    }).catch(err => {
        console.log('出现错误:' + JSON.stringify(err))
        next(err);
        res.json({ code: '200', desc: '服务器跑丢了' })
    })
    // } else {
    //     res.json(errorNumber.TOKEN_TIME_OUT())
    // }
});
module.exports = router;