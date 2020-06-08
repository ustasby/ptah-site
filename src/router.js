import VueRouter from 'vue-router'
import routes from './routes'
import qs from 'qs'

const allowedPaths = [
  '/',
  '/login',
  '/signup',
  '/restore',
  '/policy',
  '/404'
]

let router = new VueRouter(
  {
    routes: routes,
    mode: 'history',
    linkActiveClass: 'active',
    parseQuery: function (query) {
      return qs.parse(query)
    },
    stringifyQuery: function (query) {
      let result = qs.stringify(query)

      return result ? ('?' + result) : ''
    }
  }
)

router.beforeEach(
  (to, from, next) => {
    if (!allowedPaths.includes(to.path) && (localStorage.getItem('token') === null)) {
      next('/login')
      return
    }

    next()
  }
)

router.afterEach((to) => {
  document.title = to.meta.title ? to.meta.title : 'Ptah'
})

export default router
