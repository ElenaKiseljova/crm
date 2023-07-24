import { computed, ref } from 'vue';

import router from '@/router';

import { defineStore } from 'pinia';
import { useInfoStore } from '@/stores/info';
import { useErrorStore } from '@/stores/error';

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref as firebaseRef, set } from "firebase/database";

export const useAuthStore = defineStore('auth', () => {
  const infoStore = useInfoStore();
  const { resetInfo } = infoStore;

  const auth = getAuth();
  const database = getDatabase();

  const errorStore = useErrorStore();
  const { setError } = errorStore;

  let timer = ref(null);

  const token = ref(null);
  const userId = ref(null);

  const isAuthenticated = computed(() => {
    return !!token.value;
  });

  function setUserData(userData) {
    token.value = userData.stsTokenManager.accessToken;
    userId.value = userData.uid;

    const expirationDate = +userData.stsTokenManager.expirationTime;
    // const expirationDate = new Date().getTime() + 5000;
    const expiresIn = expirationDate - new Date().getTime();

    localStorage.setItem('token', token.value);
    localStorage.setItem('tokenExpiration', expirationDate);
    localStorage.setItem('userId', userId.value);

    timer.value = setTimeout(() => {
      autoLogout();
    }, expiresIn);
  }

  function resetUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userId');

    clearTimeout(timer.value);

    timer.value = null;
    token.value = null;
    userId.value = null;
  }

  async function register({ email, password, name, currency }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential?.user) {
        setUserData(userCredential.user);

        await set(firebaseRef(database, `users/${userId.value}/info`), {
          bill: 0,
          name,
          currency,
        });
      }
    } catch (e) {
      setError(e);
    }
  }

  async function login({ email, password }) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential?.user) {
        setUserData(userCredential.user);
      }
    } catch (e) {
      setError(e);
    }
  }

  async function tryLogin() {
    const tokenLS = localStorage.getItem('token');
    const tokenExpirationLS = localStorage.getItem('tokenExpiration');
    const userIdLS = localStorage.getItem('userId');

    const expiresIn = +tokenExpirationLS - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }

    timer.value = setTimeout(() => {
      autoLogout();
    }, expiresIn);

    if (tokenLS && userIdLS) {
      token.value = tokenLS;
      userId.value = userIdLS;
    }
  }

  async function logout() {
    try {
      await signOut(auth);

      resetUser();
      resetInfo();
    } catch (e) {
      setError(e);
    }
  }

  async function autoLogout() {
    await logout();

    router.replace({ path: '/login', query: { message: 'Вы вышли из системы' } });
  }

  return {
    userId,
    isAuthenticated,
    register,
    login,
    tryLogin,
    logout,
  }
});