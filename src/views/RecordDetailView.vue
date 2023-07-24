<template>
  <div class="app-page">
    <BaseLoader v-if="isLoading" />

    <div v-else-if="record">
      <div>
        <div class="breadcrumb-wrap">
          <router-link to="/history" class="breadcrumb">{{
            $t('nav.history')
          }}</router-link>
          <a @click.prevent class="breadcrumb">{{ recordTypeText }}</a>
        </div>
        <div class="row">
          <div class="col s12 m6">
            <div class="card" :class="[recordTypeColor]">
              <div class="card-content white-text">
                <p>{{ $t('description') }}: {{ record.description }}</p>
                <p>
                  {{ $t('amount') }}: {{ renderingCurrency(record.amount) }}
                </p>
                <p>{{ $t('category') }}: {{ record.categoryName }}</p>

                <small>{{ renderingDate(record.date, 'datetime') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="center">
      Запись с id = "{{ route.params.id }}" не найдена
    </p>
  </div>
</template>

<script>
import { computed, onMounted, ref } from '@vue/runtime-core';

import { useRoute } from 'vue-router';

import { useCategoryStore } from '@/stores/category';
import { useRecordStore } from '@/stores/record';

import { useI18n } from 'vue-i18n';

import useRenderingCurrency from '@/composables/renderingCurrency';
import useRenderingDate from '@/composables/renderingDate';

export default {
  name: 'RecordDetailView',
  setup() {
    const recordStore = useRecordStore();
    const { fetchRecordByID } = recordStore;

    const categoryStore = useCategoryStore();
    const { fetchCategoryById } = categoryStore;

    const route = useRoute();

    const { t } = useI18n();

    const { renderingCurrency } = useRenderingCurrency();
    const { renderingDate } = useRenderingDate();

    const record = ref(null);
    const isLoading = ref(true);

    const recordTypeText = computed(() => {
      return record.value?.type === 'outcome' ? t('outcome') : t('income');
    });

    const recordTypeColor = computed(() => {
      return record.value?.type === 'outcome' ? 'red' : 'green';
    });

    onMounted(async () => {
      const recordData = await fetchRecordByID(route.params.id);
      const categoryData = await fetchCategoryById(recordData?.categoryId);

      record.value = {
        ...recordData,
        categoryName: categoryData.title,
      };

      isLoading.value = false;
    });

    return {
      route,
      renderingCurrency,
      renderingDate,
      record,
      recordTypeText,
      recordTypeColor,
      isLoading,
    };
  },
};
</script>
