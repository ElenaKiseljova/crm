<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ $t('edit') }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="selectEl" v-model="currentCatId">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
          <label>{{ $t('select-category') }}</label>
        </div>

        <div class="input-field">
          <input
            id="name2"
            type="text"
            v-model.trim="state.title"
            :class="{ invalid: v$.title.$errors.length }"
          />
          <label for="name2">{{ $t('title') }}</label>
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

          <small
            v-if="v$.limit?.$dirty && v$.limit?.minValue?.$invalid"
            class="helper-text invalid"
          >
            Минимальное значение {{ v$.limit?.minValue?.$params?.min }}
          </small>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ $t('buttons.update') }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from '@vue/reactivity';
import {
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  watch,
  inject,
  nextTick,
} from '@vue/runtime-core';

import { useCategoryStore } from '@/stores/category';

import { useVuelidate } from '@vuelidate/core';
import { required, minValue, minLength } from '@vuelidate/validators';

export default {
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const categoryStore = useCategoryStore();
    const { updateCategory } = categoryStore;

    const message = inject('message');

    const currentCatId = ref(null);

    const select = ref(null);
    const selectEl = ref(null);

    const state = reactive({
      title: '',
      limit: 100,
    });

    const rules = {
      title: { required, minLength: minLength(3) },
      limit: { required, minValue: minValue(100) },
    };

    const v$ = useVuelidate(rules, state);

    watch(currentCatId, (curCatId) => {
      const curCat = props.categories.find((cat) => cat.id === curCatId);

      setSelectedCat(curCat);
    });

    onBeforeMount(() => {
      if (props?.categories[0]) {
        setSelectedCat(props.categories[0]);
      }
    });

    onMounted(async () => {
      await nextTick();

      select.value = await window.M.FormSelect.init(selectEl.value);

      window.M.updateTextFields();
    });

    onBeforeUnmount(() => {
      if (select.value?.destroy) select.value.destroy();
    });

    function setSelectedCat(cat) {
      const { id, title, limit } = cat;

      currentCatId.value = id;

      state.title = title;
      state.limit = limit;
    }

    async function submitHandler() {
      if (v$.value.$invalid) {
        v$.value.$touch();

        return;
      }

      const formData = {
        title: state.title,
        limit: state.limit,
        id: currentCatId.value,
      };

      const catUpdated = updateCategory(formData);

      if (catUpdated) {
        emit('updated', formData);

        message(`Категория «${formData.title}» успешно обновлена!`);
      }
    }

    return {
      currentCatId,
      selectEl,
      state,
      v$,
      submitHandler,
    };
  },
};
</script>