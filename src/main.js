import { createApp, defineAsyncComponent } from 'vue';

import { createPinia } from 'pinia';

import router from '@/router';

import { languages, defaultLocale } from '@/i18n';
import { createI18n, useI18n } from 'vue-i18n';

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import 'materialize-css/dist/js/materialize.min';

import message from './plugins/message';

import tooltip from './directives/tooltip';

import './registerServiceWorker';

import App from './App.vue';

const Pagination = defineAsyncComponent(() => import('v-pagination-3'));
const BaseLoader = defineAsyncComponent(() => import('@/components/app/BaseLoader.vue'));

/* Firebase Init - start */
const firebaseConfig = {
  apiKey: "AIzaSyCWXtTx3cKVw_Bpi9Ew7PnV0Rm7SSuPFbk",
  authDomain: "crm-vue-ea.firebaseapp.com",
  projectId: "crm-vue-ea",
  storageBucket: "crm-vue-ea.appspot.com",
  messagingSenderId: "731548182820",
  appId: "1:731548182820:web:b3497c8d8ecce849bdebb1"
};

initializeApp(firebaseConfig);

/* Firebase Init - end */

const messages = Object.assign(languages);

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages,
});

const pinia = createPinia();

const app = createApp(App, {
  setup() {
    const {t} = useI18n();

    return {
      t,
    }
  },
});

app.use(i18n);
app.use(pinia);
app.use(router);
app.use(message);

app.directive('tooltip', tooltip);

app.component('BasePagination', Pagination);
app.component('BaseLoader', BaseLoader);

let appMounted = false;

const appMount = async () => {
  await router.isReady();

  app.mount('#app');

  appMounted = !appMounted;
};

const firebaseAuth = getAuth();

/* Построение приложение, только если получены данные пользователя */
onAuthStateChanged(firebaseAuth, (user) => {
  if (!appMounted) {
    appMount();
  }

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // const uid = user.uid;
    // console.log(uid);
  } else {
    // User is signed out
    // ...
  }
});
