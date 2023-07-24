<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ $t('create') }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="state.title"
            :class="{ invalid: v$.title.$errors.length }"
          />
          <label for="name">{{ $t('title') }}</label>
          <!-- :class="{ active: state.title.toString().length > 0 }" -->

          <template v-if="v$.title.$errors.length">
            <small
              v-for="error in v$.title.$errors"
              :key="error.$message"
              class="helper-text invalid"
            >
              {{ error.$message }}
            </small>
          </template>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="state.limit"
            :class="{ invalid: v$.limit.$errors.length }"
          />
          <label for="limit">{{ $t('limit') }}</label>
          <!-- :class="{ active: state.limit.toString().length > 0 }" -->

          <!-- <template v-if="v$.limit.$errors.length">
            <small
              v-for="error in v$.limit.$errors"
              :key="error.$message"
              class="helper-text invalid"
            >
              {{ error.$message }}
            </small>
          </template> -->
          <small
            v-if="v$.limit?.$dirty && v$.limit?.minValue?.$invalid"
            class="helper-text invalid"
          >
            Минимальное значение {{ v$.limit?.minValue?.$params?.min }}
          </small>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ $t('buttons.create') }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import { inject, nextTick } from '@vue/runtime-core';

import { useVuelidate } from '@vuelidate/core';
import { required, minValue, minLength } from '@vuelidate/validators';
import { onMounted } from '@vue/runtime-core';

import { useCategoryStore } from '@/stores/category';

// import messages from '@/utils/messages';

export default {
  emits: ['created'],
  setup(_, { emit }) {
    const message = inject('message');

    const categoryStore = useCategoryStore();
    const { createCategory } = categoryStore;

    const state = reactive({
      title: '',
      limit: 100,
    });

    const rules = {
      title: { required, minLength: minLength(3) },
      limit: { required, minValue: minValue(100) },
    };

    const v$ = useVuelidate(rules, state);

    onMounted(async () => {
      await nextTick();

      window.M.updateTextFields();
    });

    async function submitHandler() {
      if (v$.value.$invalid) {
        v$.value.$touch();

        return;
      }

      const formData = {
        title: state.title,
        limit: state.limit,
      };

      const category = await createCategory(formData);

      if (category) {
        state.title = '';
        state.limit = 100;

        window.M.updateTextFields();

        v$.value.$reset();

        emit('created', category);

        message(`Категория «${category.title}» успешно создана!`);
      }
    }

    return { submitHandler, state, v$ };
  },
};
</script>