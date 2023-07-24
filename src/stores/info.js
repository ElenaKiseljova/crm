import { ref } from "vue";

import { defineStore, storeToRefs } from "pinia";

import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from "@/stores/error";

import { getDatabase, ref as firebaseRef, get, child, update } from "firebase/database";

export const useInfoStore = defineStore('info', () => {
  const database = getDatabase();

  const errorStore = useErrorStore();
  const { setError } = errorStore;

  let info = ref({});

  async function updateInfo(toUpdate) {
    try {
      info.value = {
        ...info.value,
        ...toUpdate,
      };

      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const updates = {};
      updates[`users/${userId.value}/info`] = info.value;

      const infoRef = firebaseRef(database);

      await update(infoRef, updates);

      return true;
    } catch (e) {
      setError(e);
    }

    return null;
  }

  async function fetchInfo() {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      if (userId.value) {
        const infoRef = firebaseRef(database);

        const snapshot = await get(child(infoRef, `users/${userId.value}/info`));

        if (snapshot.exists()) {
          info.value = snapshot.val();
        } else {
          setError('Info no exists!');
        }

        return true;
      }

      return false;
    } catch (e) {
      setError(e);
    }

    return false;
  }

  function resetInfo() {
    info.value = {};
  }

  return {
    info,
    updateInfo,
    fetchInfo,
    resetInfo,
  }
});