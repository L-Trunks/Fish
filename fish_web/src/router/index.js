import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Main from '../views/Main.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import UserPerson from '../components/UserPerson'
import Management from '../components/Management'
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
    children: []
  }

]

const router = new VueRouter({
  routes
})

export default router
