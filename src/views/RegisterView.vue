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
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="state.name"
          :class="{ invalid: v$.name.$errors.length }"
        />
        <label for="name">
          <!-- Имя -->
          {{ $t('placeholders.name') }}
        </label>
        <template v-if="v$.name.$errors.length">
          <small
            v-for="error in v$.name.$errors"
            :key="error.$message"
            class="helper-text invalid"
          >
            {{ error.$message }}
          </small>
        </template>
      </div>
      <div class="input-field">
        <select ref="selectEl" v-model="selectedCurrency">
          <option
            v-for="currency in currencies"
            :key="currency"
            :value="currency"
          >
            {{ currency }}
          </option>
        </select>
        <label>
          <!-- Выберите валюту по умолчанию -->
          {{ $t('placeholders.choose-default-currency') }}
        </label>
      </div>
      <p>
        <label
          class="checkbox"
          :class="{
            invalid: v$.agree.$dirty && v$.agree.checked.$invalid,
          }"
        >
          <input type="checkbox" v-model="state.agree" />
          <span>
            <!-- С правилами согласен -->
            {{ $t('agree') }}
          </span>
        </label>
      </p>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          <!-- Зарегистрироваться -->
          {{ $t('buttons.register') }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        <!-- Уже есть аккаунт? -->
        {{ $t('have-account') }}
        <router-link to="/login">
          <!-- Войти -->
          {{ $t('login') }}
          !</router-link
        >
      </p>
    </div>
  </form>
</template>

<script>
import { onMounted, onBeforeMount } from '@vue/runtime-core';
import { reactive, ref } from '@vue/reactivity';

import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useCurrencyStore } from '@/stores/currency';

import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, maxLength } from '@vuelidate/validators';

export default {
  name: 'RegisterView',
  setup() {
    const authStore = useAuthStore();
    const { isAuthenticated } = storeToRefs(authStore);
    const { register } = authStore;

    const currencyStore = useCurrencyStore();
    const { currencies } = currencyStore;

    const router = useRouter();

    const select = ref(null);
    const selectEl = ref(null);
    const selectedCurrency = ref(null);

    const state = reactive({
      email: '',
      password: '',
      name: '',
      agree: false,
    });

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
      name: { required, maxLength: maxLength(30) },
      agree: { checked: (v) => v },
    };

    const v$ = useVuelidate(rules, state);

    onBeforeMount(() => {
      if (currencies[0]) {
        selectedCurrency.value = currencies[0];
      }
    });

    onMounted(async () => {
      select.value = await window.M.FormSelect.init(selectEl.value);
    });

    async function submitHandler() {
      if (v$.value.$invalid) {
        v$.value.$touch();

        return;
      }

      const formData = {
        email: state.email,
        password: state.password,
        name: state.name,
        currency: selectedCurrency.value,
      };

      await register(formData);

      if (isAuthenticated.value) {
        router.replace('/');
      }
    }

    return {
      currencies,
      select,
      selectEl,
      selectedCurrency,
      state,
      v$,
      submitHandler,
    };
  },
};
</script>

<style>
.checkbox.invalid span::before {
  border-color: red;
}
</style>
