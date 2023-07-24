import { ref } from "vue";

import { defineStore } from "pinia";

export const useErrorStore = defineStore('error', () => {
  const error = ref(null);

  function setError(e) {
    error.value = e;
  }

  return {
    error,
    setError,
  }
});