<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <!-- <h3>Профиль</h3> -->
        <h3>{{ $t('profile') }}</h3>
      </div>

      <form class="form" @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="state.name"
            :class="{ invalid: v$.name.$errors.length }"
          />
          <label for="name">Имя</label>
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

        <div class="switch">
          <label>
            English
            <input type="checkbox" v-model="state.isRuLocale" />
            <span class="lever"></span>
            Русский
          </label>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, reactive } from '@vue/runtime-core';

import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';

import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';

export default {
  name: 'ProfileView',
  setup() {
    const infoStore = useInfoStore();
    const { updateInfo } = infoStore;
    const { info } = storeToRefs(infoStore);

    const state = reactive({
      name: info.value?.name || '',
      isRuLocale: true,
    });

    const rules = {
      name: { required, minLength: minLength(3), maxLength: maxLength(30) },
    };

    const v$ = useVuelidate(rules, state);

    onMounted(async () => {
      await nextTick();

      state.isRuLocale = info.value.locale === 'ru-RU';

      window.M.updateTextFields();
    });

    async function submitHandler() {
      if (v$.value.$invalid) {
        v$.value.$touch();

        return;
      }

      const formData = {
        name: state.name,
        locale: state.isRuLocale ? 'ru-RU' : 'en-US',
      };

      await updateInfo(formData);
    }

    return {
      state,
      v$,
      submitHandler,
    };
  },
};
</script>

<style scoped>
.switch {
  margin-bottom: 20px;
}
</style>
