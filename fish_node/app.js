const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const articleRouter = require('./routes/article');

const uploadRouter = require('./routes/upload');

const middles = require('./middles/middles');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(middles.cors);
app.use('/', indexRouter);
app.use('/api/article', articleRouter);
app.use('/api/upload', uploadRouter);


// 请求超时处理
// 路由请求超时的中间件
app.use(function (req, res, next) {
    // 这里必须是Response响应的定时器【120秒】
    res.setTimeout(120*1000, function () {
        console.log("Request has timed out.");
        return res.status(408).send("请求超时")
    });
    next();
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8888, () => {
  console.log('后端服务器启动成功，地址是: http://127.0.0.1:8888')
})
module.exports = app;
