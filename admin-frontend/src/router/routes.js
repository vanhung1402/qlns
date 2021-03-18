import store from '@state/store'

// auth related routes
const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@views/pages/account/login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'dashboard' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => lazyLoadView(import('@views/pages/account/register')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'dashboard' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/confirm-account',
    name: 'confirm-account',
    component: () => lazyLoadView(import('@views/pages/account/confirm')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'dashboard' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: () =>
      lazyLoadView(import('@views/pages/account/forgetPassword')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'dashboard' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch('auth/logOut')
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.meta.authRequired
        )
        // Navigate back to previous page, or home as a fallback
        next(
          authRequiredOnPreviousRoute ? { name: 'dashboard' } : { ...routeFrom }
        )
      },
    },
  },
]

// error pages
const errorPagesRoutes = [
  {
    path: '/404',
    name: '404',
    component: require('@views/pages/secondary/error-404').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  {
    path: '/500',
    name: '500',
    component: require('@views/pages/secondary/error-500').default,
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
]

// dashboard
const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'codepen',
    badge: {
      text: '1',
      varient: 'success',
    },
    component: () => lazyLoadView(import('@views/pages/dashboard/dashboard')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
]

// welcome page
const welcomeRoutes = [
  {
    path: '/',
    name: 'Trang chủ',
    icon: 'home',
    component: () => lazyLoadView(import('@views/pages/welcome/welcome')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
]

// Quản lý danh mục
const categoryManagement = [
  {
    path: '/danh-mục',
    name: 'Quản lý danh mục',
    icon: 'settings',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        name: 'Bộ phận',
        path: 'bo-phan',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/bo-phan')),
      },
      {
        name: 'Vị trí công việc',
        path: 'vi-tri-cong-viec',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/vi-tri-cong-viec')),
      },
      {
        name: 'Hình thức đăng tuyển',
        path: 'hinh-thuc-dang-tin-tuyen-dung',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/hinh-thuc-dang-tuyen')),
      },
      {
        name: 'Trạng thái kế hoạch tuyển dụng ',
        path: 'trang-thai-ke-hoach-tuyen-dung',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/trang-thai-ke-hoach-tuyen-dung')),
      },
      {
        name: 'Trạng thái hồ sơ tuyển dụng ',
        path: 'trang-thai-ho-so-tuyen-dung',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/trang-thai-ho-so-tuyen-dung')),
      },
      {
        name: 'Trạng thái quyết định tuyển dụng ',
        path: 'trang-thai-quyet-dinh-tuyen-dung',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/trang-thai-quyet-dinh-tuyen-dung')),
      },
      {
        name: 'Loại hợp đồng ',
        path: 'loai-hop-dong',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/danh-muc/loai-hop-dong')),
      },
    ]
  }
]

// Quản lý hệ thống
const systemManagement = [
  {
    path: '/he-thong',
    name: 'Quản lý hệ thống',
    icon: 'settings',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        name: 'Cấp tài khoản',
        path: 'cap-tai-khoan',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/he-thong/captaikhoan')),
      },
      {
        name: 'Cập nhật tài khoản',
        path: 'cap-nhat-tai-khoan',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/he-thong/capnhattaikhoan')),
      },
      {
        name: 'Đổi mật khẩu',
        path: 'doi-mat-khau',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/he-thong/doimatkhau')),
      },
    ]
  }
]

// Quản lý tuyển dụng
const recruitmentManagement = [
  {
    path: '/tuyen-dung',
    name: 'Quản lý tuyển dụng',
    icon: 'star',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        name: 'Lập KH tuyển dụng',
        path: 'lap-ke-hoach',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/lapkehoach')),
      },
      {
        name: 'RecruitmentPlanInfo',
        path: 'chi-tiet-ke-hoach/:planId',
        hidden: 1,
        meta: { title: 'Nội dung kế hoạch tuyển dụng', authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/chitietkehoach')),
      },
      {
        name: 'Duyệt KH tuyển dụng',
        path: 'duyet-ke-hoach',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/duyetkehoach')),
      },
      {
        name: 'Đăng tin tuyển dụng',
        path: 'dang-tin',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/tintuyendung')),
      },
      {
        name: 'Tổng hợp hồ sơ',
        path: 'tong-hop-ho-so',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/themhosotuyendung')),
      },
      {
        name: 'ProfileRecruitment',
        path: 'ho-so/:profileId',
        hidden: 1,
        meta: { title: 'Thông tin hồ sơ ứng viên', authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/hosotuyendung')),
      },
      {
        name: 'Đ.giá năng lực ứng viên',
        path: 'danh-gia-ung-vien',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/danhgiaungvien')),
      },
      {
        name: 'Lập QĐ tuyển dụng',
        path: 'lap-quyet-dinh-tuyen-dung',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/lapquyetdinhtuyendung')),
      },
      {
        name: 'DecisionRecruitment',
        path: 'quyet-dinh-tuyen-dung/:decisionId',
        hidden: 1,
        meta: { title: 'Nội dung quyết định tuyển dụng', authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/tuyen-dung/quyetdinhtuyendung')),
      },
      {
        name: 'Báo cáo tuyển dụng',
        path: 'bao-cao',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
      {
        name: 'T.kê hồ sơ tuyển dụng',
        path: 'thong-ke-ho-so',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
    ]
  }
]

// Quản lý nhân viên
const employeeManagement = [
  {
    path: '/nhan-vien',
    name: 'Quản lý nhân viên',
    icon: 'user',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        name: 'Hồ sơ nhân viên',
        path: 'ho-so-nhan-vien',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/nhan-vien/hosonhanvien')),
      },
      {
        name: 'StaffProfile',
        path: 'ho-so/:profileId',
        hidden: 1,
        meta: { title: 'Thông tin hồ sơ nhân viên', authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/nhan-vien/thongtinhoso')),
      },
      {
        name: 'LaborContract',
        path: 'hop-dong-lao-dong/:profileId',
        hidden: 1,
        meta: { title: 'Hợp đồng lao động', authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/nhan-vien/hopdonglaodong')),
      },
      {
        name: 'Thuyên chuyển phòng ban',
        path: 'thuyen-chuyen-phong-ban',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
      {
        name: 'Thăng chức, giáng chức',
        path: 'thang-chuc-giang-chuc',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
      {
        name: 'Hợp đồng lao động',
        path: 'hop-dong-lao-dong',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/inbox')),
      },
      {
        name: 'Chứng chỉ',
        path: 'chung-chi',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
      {
        name: 'Khen thưởng, kỷ luật',
        path: 'khen-thuong-ky-luat',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
      {
        name: 'Báo cáo nhân sự',
        path: 'bao-cao-nhan-su',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
    ]
  }
]

// apps
const calendarAppsRoutes = [
  {
    path: '/apps/calendar',
    name: 'Calendar',
    header: 'Apps',
    icon: 'calendar',
    component: () => lazyLoadView(import('@views/pages/apps/calendar')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  }
];

const emailAppsRoutes = [
  {
    path: '/apps/email',
    name: 'Email',
    icon: 'inbox',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        name: 'Inbox',
        path: 'inbox',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/inbox')),
      },
      {
        path: 'read',
        name: 'Read Email',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/reademail')),
      },
      {
        path: 'compose',
        name: 'Compose Email',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/email/emailcompose')),
      },
    ],
  }
];

const projectAppsRoutes = [
  {
    path: '/apps/project',
    name: 'Project',
    icon: 'briefcase',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        path: 'list',
        name: 'List',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/project/list')),
      },
      {
        path: 'detail',
        name: 'Detail',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/project/detail')),
      },
    ],
  }
];

const taskAppsRoutes = [
  {
    path: '/apps/task',
    name: 'Task',
    icon: 'bookmark',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
    children: [
      {
        path: 'list',
        name: 'Task List',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/tasks/task-list')),
      },
      {
        path: 'task-board',
        name: 'Kanban Board',
        meta: { authRequired: true },
        component: () =>
          lazyLoadView(import('@views/pages/apps/tasks/task-board')),
      },
    ],
  }
];

const appsRoutes = [
  ...calendarAppsRoutes,
  ...emailAppsRoutes,
  ...projectAppsRoutes,
  ...taskAppsRoutes
]

// pages
const pagesRoutes = [
  {
    path: '/pages',
    name: 'Pages',
    icon: 'file-text',
    header: 'Custom',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    children: [
      {
        path: 'starter',
        name: 'Starter',
        component: () => lazyLoadView(import('@views/pages/secondary/starter')),
      },
      {
        path: 'invoice',
        name: 'Invoice',
        component: () => lazyLoadView(import('@views/pages/secondary/invoice')),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => lazyLoadView(import('@views/pages/secondary/profile/')),
      },
      {
        path: 'activity',
        name: 'Activity',
        component: () =>
          lazyLoadView(import('@views/pages/secondary/activity')),
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: () => lazyLoadView(import('@views/pages/secondary/pricing')),
      },
    ],
  },
]

// ui
const uiRoutes = [
  {
    path: '/ui',
    name: 'UI Elements',
    icon: 'package',
    header: 'Components',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    children: [
      {
        path: 'bootstrap',
        name: 'Bootstrap UI',
        component: () => lazyLoadView(import('@views/pages/ui/bootstrap/')),
      },
      {
        path: 'icons',
        name: 'Icons',
        // create a container component
        component: {
          render(c) {
            return c('router-view')
          },
        },
        children: [
          {
            path: 'feather',
            name: 'Feather',
            component: () =>
              lazyLoadView(import('@views/pages/ui/icons/feather')),
          },
          {
            path: 'unicons',
            name: 'Unicons',
            component: () =>
              lazyLoadView(import('@views/pages/ui/icons/unicons')),
          },
        ],
      },
      {
        path: 'widgets',
        name: 'Widgets',
        component: () => lazyLoadView(import('@views/pages/ui/widget/')),
      },
    ],
  },
]

// forms
const formsRoutes = [
  {
    path: '/forms',
    name: 'Forms',
    icon: 'file-text',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    children: [
      {
        path: 'basic',
        name: 'Basic',
        component: () => lazyLoadView(import('@views/pages/ui/forms/basic')),
      },
      {
        path: 'advanced',
        name: 'Advanced',
        component: () => lazyLoadView(import('@views/pages/ui/forms/advanced')),
      },
      {
        path: 'validation',
        name: 'Validation',
        component: () =>
          lazyLoadView(import('@views/pages/ui/forms/validation')),
      },
      {
        path: 'wizard',
        name: 'Wizard',
        component: () => lazyLoadView(import('@views/pages/ui/forms/wizard/')),
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => lazyLoadView(import('@views/pages/ui/forms/editor')),
      },
      {
        path: 'uploads',
        name: 'File Uploads',
        component: () => lazyLoadView(import('@views/pages/ui/forms/uploads')),
      },
    ],
  },
]

// tables
const tablesRoutes = [
  {
    path: '/tables',
    name: 'Tables',
    icon: 'grid',
    meta: { authRequired: true },
    // create a container component
    component: {
      render(c) {
        return c('router-view')
      },
    },
    children: [
      {
        path: 'basic',
        name: 'Basic Tables',
        component: () =>
          lazyLoadView(import('@views/pages/ui/tables/basic-table')),
      },
      {
        path: 'advanced',
        name: 'Advanced Tables',
        component: () =>
          lazyLoadView(import('@views/pages/ui/tables/advanced-table')),
      },
    ],
  },
]

// charts
const chartsRoutes = [
  {
    path: '/charts',
    name: 'Charts',
    icon: 'pie-chart',
    component: () => lazyLoadView(import('@views/pages/ui/chart/')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
]


const authProtectedRoutes = [
  ...welcomeRoutes,
  ...categoryManagement,
  ...systemManagement,
  ...recruitmentManagement,
  ...employeeManagement,
  ...dashboardRoutes,
  ...appsRoutes,
  ...pagesRoutes,
  ...uiRoutes,
  ...formsRoutes,
  ...chartsRoutes,
  ...tablesRoutes
]
const allRoutes = [...authRoutes, ...authProtectedRoutes, ...errorPagesRoutes]

export { allRoutes, authProtectedRoutes }
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@components/_loading').default,
    delay: 400,
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      return h(AsyncHandler, data, children)
    },
  })
}
