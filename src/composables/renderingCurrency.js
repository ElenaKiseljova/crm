import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';

export default function useRenderingCurrency() {
  const infoStore = useInfoStore();
  const { info } = storeToRefs(infoStore);

  function renderingCurrency(value, currency = info.value.currency || 'UAH') {
    const locale = info.value?.locale || 'ru-RU';

    const options = {
      style: 'currency',
      currency,
    };

    return new Intl.NumberFormat(locale, options).format(value);
  }

  return {
    renderingCurrency,
  };
}