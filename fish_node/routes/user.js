const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
const tokenTimes = 604800 //token有效期 单位秒
const userService = require('../services/userService')

//用户注册
router.post('/user_register', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.body
    console.log(params)
    userService.userRegister(params).then(result => {
        console.log('数据::::' + result)
        res.json({ code: '200', data: result })
    }).catch(err => {
        console.log('出现错误:' + JSON.stringify(err))
        next(err);
        res.json({ code: '400', desc: '服务器跑丢了'})
    })
});

//用户登录
router.post('/user_login', function (req, res, next) {
    // let accessToken = req.get('accessToken')
    let params = req.body
    console.log(params)
    userService.userRegister(params).then(result => {
        console.log('数据::::' + result)
        let tokens = token.createToken(result[0].username, tokenTimes);
        res.json({ code: '200', data: result, accessToken: tokens && tokens || null });
    }).catch(err => {
        console.log('出现错误:' + JSON.stringify(err))
        next(err);
        res.json(errorNumber.USER_LOGIN_ERR())
    })
});


//验证用户名
router.get('/verify_user_name', function (req, res, next) {
    let params = req.query
    // let accessToken = req.get('accessToken')

    // if (token.checkToken(accessToken)) {
    userService.verifyUserName(params).then(result => {
        console.log('数据::::' + result)
        if(result&&result.length){
            res.json(errorNumber.USER_ALREADY())
        }else{
            res.json({ code: '200', data: '该用户名可以使用'});
        }
    }).catch(err => {
        console.log('出现错误:' + JSON.stringify(err))
        next(err);
        res.json({ code: '400', desc: '服务器跑丢了'})
    })
    // } else {
    //   res.json(errorNumber.TOKEN_TIME_OUT())
    // }

});