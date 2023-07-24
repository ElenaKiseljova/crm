<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">
          <!-- Счет в валюте -->
          {{ $t('bill-in-currencies') }}
        </span>

        <p v-for="cur in sortedCurrencies" :key="cur" class="currency-line">
          <span>
            {{ renderingCurrency(getMoneyInCurrency(cur), cur) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';

import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';
import { useCurrencyStore } from '@/stores/currency';

import useRenderingCurrency from '@/composables/renderingCurrency';

export default {
  name: 'HomeBill',
  props: {
    rates: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);

    const currencyStore = useCurrencyStore();
    const { currencies } = currencyStore;

    const { renderingCurrency } = useRenderingCurrency('datetime');

    const base = computed(() => {
      return info.value?.bill
        ? info.value.bill / props.rates[info.value.currency]
        : 0;
    });

    const sortedCurrencies = computed(() => {
      const indexDefaultCurrency = currencies.findIndex(
        (cur) => cur === info.value.currency
      );

      const defaultCurrency = currencies.splice(indexDefaultCurrency, 1);

      if (defaultCurrency[0]) {
        currencies.unshift(defaultCurrency[0]);
      }

      return currencies;
    });

    function getMoneyInCurrency(currency) {
      return Math.floor(base.value * props.rates[currency]);
    }

    return {
      sortedCurrencies,
      getMoneyInCurrency,
      renderingCurrency,
    };
  },
};
</script>