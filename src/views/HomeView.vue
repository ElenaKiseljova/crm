<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <!-- <h3>Счет</h3> -->
        <h3>{{ $t('nav.bill') }}</h3>

        <button class="btn waves-effect waves-light btn-small" @click="refresh">
          <i class="material-icons">refresh</i>
        </button>
      </div>

      <BaseLoader v-if="isLoading" />

      <p v-else-if="!isLoading && !isCurrencyData" class="center">
        Нет данных с ApiLayer
      </p>

      <div v-else class="row">
        <HomeBill :rates="currencyRates" />

        <HomeCurrency :rates="currencyRates" :date="currencyDate" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';

import { useCurrencyStore } from '@/stores/currency';

import HomeBill from '@/components/HomeBill.vue';
import HomeCurrency from '@/components/HomeCurrency.vue';
import BaseLoader from '@/components/app/BaseLoader.vue';

export default {
  name: 'HomeView',
  components: {
    HomeBill,
    HomeCurrency,
    BaseLoader,
  },
  setup() {
    const currencyStore = useCurrencyStore();
    const { fetchCurrency } = currencyStore;

    const currencyRates = ref(null);
    const currencyDate = ref(null);

    const isCurrencyData = ref(false);
    const isLoading = ref(true);

    async function getCurrency() {
      const currency = await fetchCurrency();

      if (currency) {
        currencyRates.value = currency.rates;
        currencyDate.value = currency.date;

        isCurrencyData.value = true;
      }

      isLoading.value = false;
    }

    async function refresh() {
      isLoading.value = true;

      await getCurrency();
    }

    onMounted(async () => {
      await getCurrency();
    });

    return {
      currencyRates,
      currencyDate,
      refresh,
      isCurrencyData,
      isLoading,
    };
  },
};
</script>
