import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [{
			path: '/redirect/:path*',
			component: () =>
				import('@/views/redirect/index')
		}]
	},
	{
		path: '/login',
		component: () =>
			import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/auth-redirect',
		component: () =>
			import('@/views/login/auth-redirect'),
		hidden: true
	},
	{
		path: '/404',
		component: () =>
			import('@/views/error-page/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () =>
			import('@/views/error-page/401'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [{
			path: 'dashboard',
			component: () =>
				import('@/views/dashboard/index'),
			name: 'Dashboard',
			meta: {
				title: '文章后台管理系统',
				icon: 'dashboard',
				affix: true
			}
		}]
	}, {
		path: '/profile',
		component: Layout,
		redirect: '/profile/index',
		hidden: true,
		children: [{
			path: 'index',
			component: () =>
				import('@/views/profile/index'),
			name: 'Profile',
			meta: {
				title: 'Profile',
				icon: 'user',
				noCache: true
			}
		}]
	}
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
	// 栏目路由
	{
		path: '/category',
		component: Layout,
		children: [{
			path: 'List',
			component: () =>
				import('@/pages/category/List'),
			name: 'cateory_list',
			meta: {
				title: '栏目管理',
				icon: 'tree-table',
				affix: true
			}
		}]
	},
	// 文章路由
	{
		path: '/article',
		component: Layout,
		meta: {
			title: '文章管理',
			icon: 'edit',
			//roles: ['admin', 'editor'] // you can set roles in root nav
		},
		children: [{
				path: 'List',
				component: () =>
					import('@/pages/article/List'),
				name: 'article_list',
				meta: {
					title: '文章列表',
					affix: true
					//roles: ['admin', 'editor'] // or you can only set roles in sub nav
				}
			},
			{
				hidden: true,
				path: 'Editor',
				component: () =>
					import('@/pages/article/Editor'),
				name: 'articl_editor',
				meta: {
					title: '文章编辑',
					//roles: ['admin','editor'] // or you can only set roles in sub nav
				}
			}, {
				hidden: true,
				path: 'Manager',
				component: () =>
					import('@/pages/article/Manager'),
				name: 'articl_Manager',
				meta: {
					title: '批量管理',
					//roles: ['admin'] // or you can only set roles in sub nav
				}
			}
		]
	},
	// 系统设置路由
	{
		path: '/user',
		component: Layout,
		children: [{
			path: 'user/list',
			component: () =>
				import('@/pages/sys/user/List'),
			name: 'sys_user_list',
			meta: {
				title: '用户管理',
				icon: 'user',
				affix: true
			}
		}]
	}, {
		path: '/role',
		component: Layout,
		children: [{
			path: 'list',
			component: () =>
				import('@/pages/sys/role/List'),
			name: 'role_list',
			meta: {
				title: '角色管理',
				icon: 'peoples',
				affix: true
			}
		}]
	}, {
		path: '/usprivilegeer',
		component: Layout,
		children: [{
			path: 'list',
			component: () =>
				import('@/pages/sys/privilege/List'),
			name: 'privilge_list',
			meta: {
				title: '权限管理',
				icon: 'password',
				affix: true
			}
		}]
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