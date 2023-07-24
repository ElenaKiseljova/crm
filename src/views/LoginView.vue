<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">
        <!-- Домашняя бухгалтерия -->
        {{ $t('home-bookkeeping') }}
      </span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="state.email"
          :class="{ invalid: v$.email.$errors.length }"
        />

        <label for="email">
          <!-- Email -->
          {{ $t('placeholders.email') }}
        </label>
        <template v-if="v$.email.$errors.length">
          <small
            v-for="error in v$.email.$errors"
            :key="error.$message"
            class="helper-text invalid"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="state.password"
          :class="{ invalid: v$.password.$errors.length }"
        />

        <label for="password">
          <!-- Пароль -->
          {{ $t('placeholders.password') }}
        </label>
        <template v-if="v$.password.$errors.length">
          <small
            v-for="error in v$.password.$errors"
            :key="error.$message"
            class="helper-text invalid"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          <!-- Войти -->
          {{ $t('buttons.login') }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        <!-- Нет аккаунта? -->
        {{ $t('have-not-account') }}
        <router-link to="/register">
          <!-- Зарегистрироваться -->
          {{ $t('buttons.register') }}
        </router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { reactive } from '@vue/reactivity';
import { inject, onMounted } from '@vue/runtime-core';

import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/auth';

import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';

import messages from '@/utils/messages';
import { storeToRefs } from 'pinia';

export default {
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore();

    const { isAuthenticated } = storeToRefs(authStore);
    const { login } = authStore;

    const message = inject('message');

    const route = useRoute();
    const router = useRouter();

    const state = reactive({
      email: '',
      password: '',
    });

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);

    async function submitHandler() {
      if (v$.value.$invalid) {
        v$.value.$touch();

        return;
      }

      const formData = {
        email: state.email,
        password: state.password,
      };

      await login(formData);

      if (isAuthenticated.value) {
        router.replace('/');
      }
    }

    onMounted(() => {
      if (messages[route.query.message]) {
        message(messages[route.query.message]);
      }
    });

    return { submitHandler, state, v$ };
  },
};
</script>
