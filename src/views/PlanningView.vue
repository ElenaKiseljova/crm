<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <!-- <h3>Планирование</h3> -->
        <h3>
          {{ $t('nav.planning') }}
        </h3>
        <h4>{{ renderingCurrency(info.bill) }}</h4>
      </div>

      <BaseLoader v-if="isLoading" />

      <p v-else-if="!categories.length" class="center">
        {{ $t('no-categories') }}
        <router-link to="/categories">{{ $t('add-category') }}</router-link>
      </p>

      <section v-else>
        <div v-for="cat in categories" :key="cat.id">
          <p>
            <strong>{{ cat.title }}:</strong>
            {{ renderingCurrency(cat.spend) }} из
            {{ renderingCurrency(cat.limit) }}
          </p>
          <div class="progress" v-tooltip="cat.tooltip">
            <div
              class="determinate"
              :class="[cat.progressColor]"
              :style="{ width: `${cat.progressPercent}%` }"
            ></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';

import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';
import { useCategoryStore } from '@/stores/category';
import { useRecordStore } from '@/stores/record';

import { useI18n } from 'vue-i18n';

import useRenderingCurrency from '@/composables/renderingCurrency';

export default {
  name: 'PlanningView',
  setup() {
    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);

    const recordStore = useRecordStore();
    const { fetchRecords } = recordStore;

    const categoryStore = useCategoryStore();
    const { fetchCategories } = categoryStore;

    const { t } = useI18n();

    const { renderingCurrency } = useRenderingCurrency();

    const isLoading = ref(true);
    const categories = ref([]);

    onMounted(async () => {
      const records = await fetchRecords();
      const categoriesArr = await fetchCategories();

      categories.value = await categoriesArr.map((cat) => {
        const spend = records
          .filter((rec) => rec.categoryId === cat.id)
          .filter((rec) => rec.type === 'outcome')
          .reduce((total, rec) => {
            return (total += +rec.amount);
          }, 0);

        const percent = spend > 0 ? (spend / cat.limit) * 100 : 0;
        const progressPercent = percent > 100 ? 100 : percent;
        const progressColor =
          percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red';

        const tooltipValue = cat.limit - spend;
        const tooltip = `${
          tooltipValue < 0 ? t('exceeding') : t('left')
        } ${renderingCurrency(Math.abs(tooltipValue))}`;

        return {
          ...cat,
          progressPercent,
          progressColor,
          spend,
          tooltip,
        };
      });

      isLoading.value = false;
    });

    return {
      renderingCurrency,
      categories,
      info,
      isLoading,
    };
  },
};
</script>
