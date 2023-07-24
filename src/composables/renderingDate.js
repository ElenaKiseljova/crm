import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';

export default function useRenderingDate() { 
  function renderingDate(date, type = 'date') {
    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);

    const locale = info.value?.locale || 'ru-RU';

    const options = {};

    if (type.includes('date')) {
      options.day = '2-digit';
      options.month = 'long';
      options.year = 'numeric';
    }

    if (type.includes('time')) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
    }

    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
  }

  return {
    renderingDate,
  };
}