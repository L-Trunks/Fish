const express = require('express');
const router = express.Router();
//token
import errorNumber from '../config/errorNum'
const token = require('../token/token') //引入
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
        res.json({ code: '400', data: {error:JSON.stringify(err)} })
    })
});