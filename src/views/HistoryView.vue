<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <!-- <h3>История записей</h3> -->
        <h3>{{ $t('history-records') }}</h3>
      </div>

      <div class="history-chart">
        <canvas></canvas>
        <Pie :chart-data="chartData" :chart-options="chartOptions" />
      </div>

      <BaseLoader v-if="isLoading" />

      <p v-else-if="!records.length" class="center">
        Записей пока нет
        <router-link to="/record">Добавить сейчас</router-link>
      </p>

      <section v-else>
        <HistoryTable :records="itemsByPage" :per-page="perPage" />

        <base-pagination
          v-model="page"
          :records="countItems"
          :per-page="perPage"
          @paginate="pageChangeHandler"
          :options="{ hideCount: true, template: PaginationTemplate }"
        ></base-pagination>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, markRaw } from '@vue/reactivity';
import { defineAsyncComponent, onMounted } from '@vue/runtime-core';

import { useCategoryStore } from '@/stores/category';
import { useRecordStore } from '@/stores/record';

import useRenderingPagination from '@/composables/renderingPagination';

import { useI18n } from 'vue-i18n';

import HistoryTable from '@/components/HistoryTable.vue';
import Pie from '@/components/charts/PieChart.vue';

export default {
  name: 'HistoryView',
  components: {
    HistoryTable,
    Pie,
  },
  setup() {
    const categoryStore = useCategoryStore();
    const { fetchCategories } = categoryStore;

    const recordStore = useRecordStore();
    const { fetchRecords } = recordStore;

    const {
      page,
      perPage,
      itemsByPage,
      countItems,
      setupPagination,
      pageChangeHandler,
    } = useRenderingPagination(2);

    const { t } = useI18n();

    const records = ref([]);
    const chartData = ref({});
    const chartOptions = ref({});
    const isLoading = ref(true);

    onMounted(async () => {
      const categories = await fetchCategories();

      records.value = await fetchRecords();

      renderPagination(categories);

      renderChart(categories);

      isLoading.value = false;
    });

    function renderPagination(categories) {
      setupPagination(
        records.value.map((record) => {
          return {
            ...record,
            categoryName: categories.find((c) => c.id === record.categoryId)
              ?.title,
            typeClass: record.type === 'income' ? 'green' : 'red',
            // typeText: record.type === 'income' ? 'Доход' : 'Расход',
            typeText: record.type === 'income' ? t('income') : t('outcome'),
          };
        })
      );
    }

    function renderChart(categories) {
      chartData.value = {
        labels: categories.map((c) => c.title),
        datasets: [
          {
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'cyan',
            ],
            data: categories.map((c) => {
              return records.value.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === 'outcome') {
                  total += +r.amount;
                }

                return total;
              }, 0);
            }),
            hoverOffset: 4,
          },
        ],
      };

      chartOptions.value = {
        responsive: true,
      };
    }

    return {
      PaginationTemplate: markRaw(
        defineAsyncComponent(() =>
          import('@/components/app/PaginationTemplate.vue')
        )
      ),
      records,
      page,
      perPage,
      itemsByPage,
      countItems,
      chartData,
      chartOptions,
      isLoading,
      pageChangeHandler,
    };
  },
};
</script>
