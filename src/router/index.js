import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('../views/HomeView.vue');
const CategoriesView = () => import('../views/CategoriesView.vue');
const HistoryView = () => import('../views/HistoryView.vue');
const PlanningView = () => import('../views/PlanningView.vue');
const RecordView = () => import('../views/RecordView.vue');
const RecordDetailView = () => import('../views/RecordDetailView.vue');
const ProfileView = () => import('../views/ProfileView.vue');
const LoginView = () => import('../views/LoginView.vue');
const RegisterView = () => import('../views/RegisterView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/planning',
    name: 'planning',
    component: PlanningView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/record',
    name: 'record',
    component: RecordView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/record/:id',
    name: 'record-detail',
    component: RecordDetailView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      layout: 'main',
      auth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      layout: 'empty',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      layout: 'empty',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, _2, next) => {
  const authStore = useAuthStore();
  const { tryLogin } = authStore;
  const { isAuthenticated } = storeToRefs(authStore);

  if (!isAuthenticated.value) {
    await tryLogin();
  }

  const requiredAuth = to.meta?.auth;

  if (requiredAuth && !isAuthenticated.value) {
    next('/login?message=login');
  } else {
    next();
  }
});

export default router;
