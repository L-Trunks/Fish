const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
const articleService = require('../services/articleService')

//发布文章
router.post('/add_article', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        articleService.addArticle(params).then(result => {
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

//删除文章
router.get('/delete_article', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        articleService.deleteArticle(params).then(result => {
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

//修改文章
router.post('/update_article', function (req, res, next) {
    let params = req.body
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        articleService.updateArticle(params).then(result => {
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

//修改点赞评论收藏数
router.post('/update_article_count', function (req, res, next) {
    let params = req.body
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        articleService.updateArticleCount(params).then(result => {
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

//浏览量+1
router.get('/update_article_looks_count', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.updateArticleLooksCount(params).then(result => {
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

router.get('/select_article_by_type', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.selectArticleByType(params).then(result => {
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

//查询所有文章
router.get('/select_all_article', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.selectAllArticle(params).then(result => {
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

//根据类型查询文章
router.get('/select_all_article_by_type', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.selectAllArticleByType(params).then(result => {
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

//根据用户查询文章
router.get('/select_all_article_by_user', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.selectAllArticleByUser(params).then(result => {
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

//根据id查询文章
router.get('/select_article_by_id', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.selectArticleById(params).then(result => {
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

//搜索
router.get('/select_article_by_like', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    articleService.selectArticleByLike(params).then(result => {
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