import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: Layout,
    children: [{
      path: '/404',
      component: () => import('@/views/404')
    }],
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/',
      component: () => import('@/views/index')
    }]
  },
  // 系统管理
  {
    path: '/footer-icon',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'setting'
    },
    children: [{
        path: 'footer-icon-list',
        name: 'footer-icon-list',
        component: () => import('@/views/material/FooterIconList'),
        meta: {
          title: '　底部链接列表',
        }
      },
     
      {
        path: 'footer-icon-add',
        name: 'footer-icon-add',
        component: () => import('@/views/material/FooterIconAdd'),
        meta: {
          title: '　新增首页链接',
        }
      },
      {
        path: 'footer-icon-upd',
        name: 'footer-icon-upd',
        component: () => import('@/views/material/FooterIconUpd'),
        meta: {
          title:'修改首页链接',
        },
        hidden:true,
      },
      {
        path: 'defaultavatar',
        name: 'defaultavatar',
        component: () => import('@/views/material/DefaultAvatar'),
        meta: {
          title: '　用户默认头像',
        }
      },
      {
        path: 'recommendset',
        name: 'recommendset',
        component: () => import('@/views/material/RecommendSet'),
        meta: {
          title: '　首页推荐设置',
        }
      },
      {
        path: 'royaltyset',
        name: 'royaltyset',
        component: () => import('@/views/material/Royalty'),
        meta: {
          title: '　创作者税设置',
        }
      },
    
    ]
  },
  // 用户管理
  {
    path: '/user',
    component: Layout,
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [{
        path: 'userlist',
        name: 'userlist',
        component: () => import('@/views/users/UsersList'),
        meta: {
          title: '用户列表',
        }
      },
    ]
  },
  // Collection管理
  {
    path: '/collection',
    component: Layout,
    meta: {
      title: 'collection',
      icon: 'collection'
    },
    children: [{
        path: 'collectionlist',
        name: 'collectionlist',
        component: () => import('@/views/collections/CollectionsList'),
        meta: {
          title: '　collection列表',
        }
      },
      {
        path: 'collectionadd',
        name: 'collectionadd',
        component: () => import('@/views/collections/CollectionsAdd'),
        meta: {
          title: '　新增collection',
        }
      },
      {
        path: 'collectionupd',
        name: 'collectionupd',
        component: () => import('@/views/collections/CollectionsUpd'),
        meta: {
          title: '更新collection',
        },
        hidden:true,
      },
      {
        path: 'collectionviewworks',
        name: 'collectionviewworks',
        component: () => import('@/views/works/WorksList'),
        meta: {
          title: '查看作品',
        },
        hidden:true,
      },
    ]
  },
   // works作品管理
   {
    path: '/work',
    component: Layout,
    meta: {
      title: '作品管理',
      icon: 'works'
    },
    children: [{
        path: 'worklist',
        name: 'worklist',
        component: () => import('@/views/works/WorksList'),
        meta: {
          title: '　作品列表',
        }
      },
      {
        path: 'workClaim',
        name: 'workClaim',
        component: () => import('@/views/works/WorksClaim'),
        meta: {
          title: '　作品认领',
        }
      },
      {
        path: 'workcheck',
        name: 'workcheck',
        component: () => import('@/views/works/WorksCheck'),
        meta: {
          title: '作品审核',
        },
        hidden: true
      },
      {
        path: 'claimdetail',
        name: 'claimdetail',
        component: () => import('@/views/works/ClaimDetail'),
        meta: {
          title: '认领审核',
        },
        hidden: true
      },
      {
        path: 'workupd',
        name: 'workupd',
        component: () => import('@/views/works/WorksUpd'),
        meta: {
          title: '作品更新',
        },
        hidden: true
      },
    ]
  },
   // 标签管理
   {
    path: '/label',
    component: Layout,
    meta: {
      title: '标签管理',
      icon: 'label'
    },
    children: [{
        path: 'labellist',
        name: 'labellist',
        component: () => import('@/views/labels/LabelsList'),
        meta: {
          title: '　标签列表',
        }
      },
      {
        path: 'labeladd',
        name: 'labeladd',
        component: () => import('@/views/labels/LabelsAdd'),
        meta: {
          title: '　新增标签',
        }
      },
      {
        path: 'labelupd',
        name: 'labelupd',
        component: () => import('@/views/labels/LabelsUpd'),
        meta: {
          title: '修改标签',
        },
        hidden:true
      },
    ]
  },

  // 爬虫管理
  {
    path: '/crawler',
    component: Layout,
    meta: {
      title: '爬虫管理',
      icon: 'python'
    },
    children: [{
        path: 'crawlerlist',
        name: 'crawlerlist',
        component: () => import('@/views/crawler/CrawlerList'),
        meta: {
          title: '　爬虫列表',
        }
      },
      {
        path: 'crawlerrecycle',
        name: 'crawlerrecycle',
        component: () => import('@/views/crawler/CrawlerRecycle'),
        meta: {
          title: '　爬虫回收',
        }
      },
      {
        path: 'crawlerdetail',
        name: 'crawlerdetail',
        component: () => import('@/views/crawler/CrawlerDetail'),
        meta: {
          title: '爬虫详情',
        },
        hidden:true
      },
    ]
  },
  //上传接口
  {
    path: '/upload',
    component: () => import('@/views/test/upload'),
    meta: {
      title: '上传文件',
      icon: 'python'
    },
    hidden: true,
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
