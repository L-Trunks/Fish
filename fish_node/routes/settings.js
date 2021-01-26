const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
const settingsService = require('../services/settingsService')

//添加设置（公告或轮播图信息）
router.post('/add_settings', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        settingsService.addSettings(params).then(result => {
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
router.get('/delete_settings', function (req, res, next) {
    let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    if (token.checkToken(accessToken)) {
        settingsService.deleteSettings(params).then(result => {
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

//修改设置（公告或轮播图信息）
router.post('/update_settings', function (req, res, next) {
    let params = req.body
    // console.log(params)
    let accessToken = req.get('accessToken')
    if (token.checkToken(accessToken)) {
        settingsService.updateSettings(params).then(result => {
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

//根据类型查询设置信息
router.get('/select_settings_by_type', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    settingsService.selectSettingsByType(params).then(result => {
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

//根据id查询设置信息
router.get('/select_settings_by_id', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    settingsService.selectSettingsById(params).then(result => {
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

//查询所有设置信息
router.get('/select_all_settings', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.query
    // console.log(params)
    // if (token.checkToken(accessToken)) {
    settingsService.selectAllSettings(params).then(result => {
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