import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import quillEditor from 'vue-quill-editor' // 调用富文本编辑器
import 'quill/dist/quill.snow.css' // 富文本编辑器外部引用样式  三种样式三选一引入即可

//md5加密
import md5 from 'js-md5';
Vue.use(quillEditor)
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false


const whiteList = ['/', '/login', '/register','/article_detail', '/video_detail',
  '/rotation_img_detail', '/list_by_category', '/activity_list', '/search']// 免登录白名单

router.beforeEach((to, from, next) => {
  console.log(store.state)
  let accessToken = localStorage.getItem("accessToken") || "";
  if (accessToken) {
    next()
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
