import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import UserPerson from '../components/UserPerson'
import Management from '../components/Management.vue';

import ArticleDetail from '../components/ArticleDetail.vue';
import VideoDetail from '../components/VideoDetail.vue';
import ActivityDetail from '../components/ActivityDetail.vue';
import ActivityList from '../components/ActivityList.vue';
import ListByCategory from '../components/ListByCategory.vue';
import SearchResult from '../components/SearchResult.vue';

import AddArticle from '../components/person/AddArticle.vue';
import MyArticle from '../components/person/MyArticle.vue';
import MyVideo from '../components/person/MyVideo.vue';

import CollectArticle from '../components/person/CollectArticle.vue';
import GoodsArticle from '../components/person/GoodsArticle.vue';
import UpdateUserInfo from '../components/person/UpdateUserInfo.vue';
import UpdateArticle from '../components/person/UpdateArticle.vue';

import AnnounceManagement from '../components/management/AnnounceManagement.vue';
import ArticleManagement from '../components/management/ArticleManagement.vue';

import RotationManagement from '../components/management/RotationManagement.vue';
import CategoryManagement from '../components/management/CategoryManagement.vue';
import UserManagement from '../components/management/UserManagement.vue';

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
          {
            path: '/person/add_article',
            component: AddArticle
          },
          {
            path: '/person/my_article',
            component: MyArticle
          },
          {
            path: '/person/my_video',
            component: MyVideo
          },
          {
            path: '/person/collect_article',
            component: CollectArticle
          },
          {
            path: '/person/goods_article',
            component: GoodsArticle
          },
          {
            path: '/person/update_user_info',
            component: UpdateUserInfo
          },
          {
            path: '/person/update_article',
            component: UpdateArticle
          },
        ]
      },
      {
        path: '/article_detail',
        component: ArticleDetail
      },
      {
        path: '/video_detail',
        component: VideoDetail
      },
      {
        path: '/rotation_img_detail',
        component: ActivityDetail
      },
      {
        path: '/list_by_category',
        component: ListByCategory
      },
      {
        path: '/activity_list',
        component: ActivityList
      },
      {
        path: '/search',
        component: SearchResult
      }
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
    ]
  },


]

const router = new VueRouter({
  routes
})

export default router
