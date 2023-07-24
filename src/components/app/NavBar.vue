<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <a href="#" @click.prevent="$emit('burger-click')">
          <i class="material-icons black-text">dehaze</i>
        </a>
        <span class="black-text">{{ date }}</span>
      </div>

      <p v-if="!isAuthenticated" class="right">
        <router-link to="/login">
          <!-- Войти  -->
          <h3>{{ $t('login') }}</h3>
        </router-link>
      </p>
      <ul v-else class="right hide-on-small-and-down">
        <li>
          <a
            class="dropdown-trigger black-text"
            href="#"
            data-target="dropdown"
            ref="dropdownTrigger"
          >
            {{ name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>

          <ul id="dropdown" class="dropdown-content">
            <li>
              <router-link to="/profile" class="black-text">
                <i class="material-icons">account_circle</i>
                <!-- Профиль -->
                {{ $t('profile') }}
              </router-link>
            </li>
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logoutUser">
                <i class="material-icons">assignment_return</i>
                <!-- Выйти -->
                {{ $t('logout') }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useInfoStore } from '@/stores/info';

import useRenderingDate from '@/composables/renderingDate';

export default {
  name: 'nav-bar',
  setup() {
    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore);
    const { logout } = authStore;

    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);

    const router = useRouter();

    const { renderingDate } = useRenderingDate();

    const dropdownTrigger = ref(null);
    const dropdown = ref(null);
    const date = ref(null);

    const dateInterval = setInterval(() => {
      const curDate = new Date();

      date.value = renderingDate(curDate, 'datetime');
    }, 1000);

    const name = computed(() => {
      return info.value?.name ? info.value.name : '';
    });

    async function logoutUser() {
      await logout();

      if (!isAuthenticated.value) {
        router.push('/login?message=logout');
      }
    }

    onMounted(() => {
      const options = {
        constrainWidth: false,
      };

      if (dropdownTrigger.value) {
        dropdown.value = window.M.Dropdown.init(dropdownTrigger.value, options);
      }
    });

    onBeforeUnmount(() => {
      if (dateInterval) {
        clearInterval(dateInterval);
      }

      if (dropdown.value?.destroy) {
        dropdown.value.destroy();
      }
    });

    return {
      isAuthenticated,
      renderingDate,
      dropdownTrigger,
      logoutUser,
      date,
      name,
    };
  },
};
</script>
