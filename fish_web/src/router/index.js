import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import UserPerson from '../components/UserPerson'
import Management from '../components/Management.vue';

import AnnounceManagement from '../components/management/AnnounceManagement.vue';
import ArticleManagement from '../components/management/ArticleManagement.vue';

import RotationManagement from '../components/management/RotationManagement.vue';
import CategoryManagement from '../components/management/CategoryManagement.vue';
import UserManagement from '../components/management/UserManagement.vue';
import VideoManagement from '../components/management//VideoManagement.vue';

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        component: Main
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/register',
        component: Register
      },
      {
        path: '/person',
        component: UserPerson,
        children: [

        ]
      },
    ]
  },
  {
    path: "/management",
    component: Management,
    children: [
      {
        path: '/management/announce_management',
        component: AnnounceManagement,
      },
      {
        path: '/management/article_management',
        component: ArticleManagement,
      },
      {
        path: '/management/rotation_management',
        component: RotationManagement,
      },
      {
        path: '/management/category_management',
        component: CategoryManagement,
      },
      {
        path: '/management/user_management',
        component: UserManagement,
      },
      {
        path: '/management/video_management',
        component: VideoManagement,
      },
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
