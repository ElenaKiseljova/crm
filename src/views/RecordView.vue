<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <!-- <h3>Новая запись</h3> -->
        <h3>
          {{ $t('nav.new-record') }}
        </h3>
      </div>

      <BaseLoader v-if="isLoading" />

      <p v-else-if="!categories.length" class="center">
        {{ $t('no-categories') }}
        <router-link to="/categories">{{ $t('add-category') }}</router-link>
      </p>

      <form v-else class="form" @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="selectEl" v-model="currentCatId">
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.title }}
            </option>
          </select>
          <label>{{ $t('select-category') }}</label>
        </div>

        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="income"
              v-model="type"
            />
            <span>{{ $t('income') }}</span>
          </label>
        </p>

        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="outcome"
              v-model="type"
            />
            <span>{{ $t('outcome') }}</span>
          </label>
        </p>

        <div class="input-field">
          <input
            id="amount"
            type="number"
            v-model.number="state.amount"
            :class="{ invalid: v$.amount.$errors.length }"
          />
          <label for="amount">{{ $t('amount') }}</label>

          <small
            v-if="v$.amount?.$dirty && v$.amount?.minValue?.$invalid"
            class="helper-text invalid"
          >
            Минимальное значение {{ v$.amount?.minValue?.$params?.min }}
          </small>
        </div>

        <div class="input-field">
          <input
            id="description"
            type="text"
            v-model="state.description"
            :class="{ invalid: v$.description.$errors.length }"
          />
          <label for="description">{{ $t('description') }}</label>

          <small
            v-if="
              v$.description.$errors.length ||
              (v$.description?.$dirty && v$.description?.required?.$invalid)
            "
            class="helper-text invalid"
          >
            Поле обязательно для заполнения
          </small>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          <!-- Создать -->
          {{ $t('buttons.create') }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  inject,
  computed,
} from '@vue/runtime-core';

import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';
import { useCategoryStore } from '@/stores/category';
import { useRecordStore } from '@/stores/record';

import { useVuelidate } from '@vuelidate/core';
import { required, minValue } from '@vuelidate/validators';

export default {
  name: 'RecordView',
  setup() {
    const message = inject('message');

    const recordStore = useRecordStore();
    const { createRecord } = recordStore;

    const categoryStore = useCategoryStore();
    const { fetchCategories } = categoryStore;

    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);
    const { updateInfo } = infoStore;

    const categories = ref([]);
    const currentCatId = ref(null);

    const select = ref(null);
    const selectEl = ref(null);

    const type = ref('outcome');

    const isLoading = ref(true);

    const state = reactive({
      amount: 1,
      description: '',
    });

    const rules = {
      amount: { required, minValue: minValue(1) },
      description: { required },
    };

    const v$ = useVuelidate(rules, state);

    const canCreateRecord = computed(() => {
      if (type.value === 'income') {
        return true;
      }

      if (type.value === 'outcome') {
        return info.value?.bill ? info.value.bill >= state.amount : false;
      }

      return false;
    });

    onMounted(async () => {
      categories.value = await fetchCategories();

      isLoading.value = false;

      if (categories.value.length) {
        currentCatId.value = categories.value[0]?.id;
      }

      // Алттернатива нулевому таймауту.
      // Вроде, более правильный слособ запустить инициализацию скрипта
      // после полного построения компонента
      await nextTick();

      select.value = await window.M.FormSelect.init(selectEl.value);

      window.M.updateTextFields();
    });

    onBeforeUnmount(() => {
      if (select.value?.destroy) select.value.destroy();
    });

    async function submitHandler() {
      if (v$.value.$invalid) {
        v$.value.$touch();

        return;
      }

      if (canCreateRecord.value) {
        const formData = {
          amount: state.amount,
          description: state.description,
          type: type.value,
          categoryId: currentCatId.value,
          date: new Date().toJSON(),
        };

        const r = await createRecord(formData);

        if (r) {
          const newBill =
            type.value === 'income'
              ? info.value.bill + state.amount
              : info.value.bill - state.amount;

          updateInfo({ bill: newBill });

          state.description = '';
          state.amount = 100;

          window.M.updateTextFields();

          v$.value.$reset();

          message('Запись успешно добавлена!');
        }
      } else {
        message(
          `На вашем счёте недостаточно средств ${
            state.amount - info.value.bill
          }!`
        );
      }
    }

    return {
      categories,
      currentCatId,
      selectEl,
      type,
      isLoading,
      state,
      v$,
      submitHandler,
    };
  },
};
</script>
