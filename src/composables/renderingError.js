import { inject, watch } from '@vue/runtime-core';

import { storeToRefs } from 'pinia';
import { useErrorStore } from '@/stores/error';

import messages from '@/utils/messages';

export default function useRenderingError() {
  const errorStore = useErrorStore();
  const { error } = storeToRefs(errorStore);

  const errorMessage = inject('error');

  watch(error, (fbError) => {
    if (messages[fbError.code]) {
      errorMessage(messages[fbError.code]);
    } else {
      console.log(fbError);
      errorMessage(fbError.message || 'Что-то пошло не так...');
    }
  });
}