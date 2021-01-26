const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
const categoryService = require('../services/categoryService')

//添加分类
router.post('/add_category', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        categoryService.addCategory(params).then(result => {
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


//删除分类
router.get('/delete_category', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        categoryService.deleteCategory(params).then(result => {
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

//修改分类
router.post('/update_category', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        categoryService.updateCategory(params).then(result => {
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

//查询所有分类
router.get('/select_all_category', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    categoryService.selectAllCategory(params).then(result => {
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

//根据id查询分类
router.get('/select_category_by_id', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    categoryService.selectCategoryById(params).then(result => {
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

//根据类型查询分类
router.get('/select_category_by_type', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    categoryService.selectCategoryByType(params).then(result => {
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

//根据用户查询分类
router.get('/select_category_by_user', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        categoryService.selectCategoryByUser(params).then(result => {
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


module.exports = router;