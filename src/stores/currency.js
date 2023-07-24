import { ref } from "vue";

import { defineStore } from "pinia";
import { useErrorStore } from "@/stores/error";

import useRenderingDate from '@/composables/renderingDate';

export const useCurrencyStore = defineStore('currency', () => {
  const errorStore = useErrorStore();
  const { setError } = errorStore;

  const { renderingDate } = useRenderingDate();

  const currencies = ref(['UAH', 'RUB', 'EUR', 'USD']);

  async function fetchCurrency() {
    try {
      const currentDate = renderingDate(new Date());

      const currencyData = localStorage.getItem('currencyData');
      const lastUpdated = localStorage.getItem('lastUpdated');

      if (!currencyData || !lastUpdated || (currencyData && lastUpdated !== currentDate)) {
        console.log('Курс валют из ApiLayer');

        const key = process.env.VUE_APP_FIXER;

        const response = await fetch(`https://api.apilayer.com/fixer/latest?apikey=${key}&base=USD&symbols=UAH,RUB,EUR,USD`);

        const data = await response.json();

        if (data?.success) {
          localStorage.setItem('currencyData', JSON.stringify(data));
          localStorage.setItem('lastUpdated', currentDate);

          return data;
        } else {
          throw new Error(response.statusText || 'Что-то пошло не так...');
        }
      } else {
        console.log('Курс валют из локал стора');

        return JSON.parse(currencyData);
      }
    } catch (e) {
      setError(e);
    }
  }

  return {
    currencies,
    fetchCurrency,
  }
});