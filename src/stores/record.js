import { ref } from "vue";

import { defineStore, storeToRefs } from 'pinia';
import { useErrorStore } from '@/stores/error';
import { useAuthStore } from '@/stores/auth';

import { getDatabase, ref as firebaseRef, set, get, push as firebasePush, child } from "firebase/database";

export const useRecordStore = defineStore('record', () => {
  const errorStore = useErrorStore();
  const { setError } = errorStore;

  const database = getDatabase();

  const records = ref([]);

  async function createRecord(record) {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const recordRef = firebaseRef(database, `users/${userId.value}/records`);
      const newRecordRef = firebasePush(recordRef);
      await set(newRecordRef, record);

      if (newRecordRef.key) {
        return {
          ...record,
          id: newRecordRef.key,
        };
      }

      return null;
    } catch (e) {
      setError(e);
    }
  }

  async function fetchRecords() {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const recordsRef = firebaseRef(database);

      const snapshot = await get(child(recordsRef, `users/${userId.value}/records`));

      if (snapshot.exists()) {
        const recordsObj = await snapshot.val();
        const recordsArr = Object.keys(recordsObj).map((key) => ({
          ...recordsObj[key],
          id: key,
        }));

        records.value = recordsArr;
      } else {
        records.value = [];
      }

      return records.value;
    } catch (e) {
      setError(e);
    }
  }

  async function fetchRecordByID(id) {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const recordsRef = firebaseRef(database);

      const snapshot = await get(child(recordsRef, `users/${userId.value}/records/${id}`));

      if (snapshot.exists()) {
        const record = await snapshot.val();

        return {
          ...record,
          id,
        };
      } else {
        return null;
      }
    } catch (e) {
      setError(e);
    }
  }

  return {
    createRecord,
    fetchRecords,
    fetchRecordByID,
  }
});