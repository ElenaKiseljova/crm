<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">
            <!--  Курс валют -->
            {{ $t('exchange-rates') }}
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <!-- <th>Валюта</th>
              <th>Курс</th>
              <th>Дата</th> -->
              <th>{{ $t('currency') }}</th>
              <th>{{ $t('rate') }}</th>
              <th>{{ $t('date') }}</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="cur in currencies" :key="cur">
              <td>{{ cur }}</td>
              <td>{{ rates[cur]?.toFixed(5) }}</td>
              <td>{{ renderingDate(date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import useRenderingDate from '@/composables/renderingDate';
import { useCurrencyStore } from '@/stores/currency';

export default {
  props: {
    rates: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  setup() {
    const currencyStore = useCurrencyStore();
    const { currencies } = currencyStore;

    const { renderingDate } = useRenderingDate('datetime');

    return {
      currencies,
      renderingDate,
    };
  },
};
</script>