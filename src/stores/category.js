import { ref } from 'vue';

import { defineStore, storeToRefs } from 'pinia';
import { useErrorStore } from '@/stores/error';
import { useAuthStore } from '@/stores/auth';

import { getDatabase, ref as firebaseRef, set, push as firebasePush, child, get, update } from "firebase/database";

export const useCategoryStore = defineStore('category', () => {
  const errorStore = useErrorStore();
  const { setError } = errorStore;

  const database = getDatabase();

  const categories = ref([]);

  async function createCategory({ title, limit }) {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const categoriesRef = firebaseRef(database, `users/${userId.value}/categories`);
      const newCategoriesRef = firebasePush(categoriesRef);
      await set(newCategoriesRef, {
        title,
        limit,
      });

      if (newCategoriesRef.key) {
        return {
          title,
          limit,
          id: newCategoriesRef.key,
        };
      }

      return null;
    } catch (e) {
      setError(e);
    }

    return null;
  }

  async function updateCategory({ title, limit, id }) {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const updates = {};
      updates[`users/${userId.value}/categories/${id}`] = { title, limit };

      const categoriesRef = firebaseRef(database);

      await update(categoriesRef, updates);

      return true;
    } catch (e) {
      setError(e);
    }

    return null;
  }

  async function fetchCategories() {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const categoriesRef = firebaseRef(database);

      const snapshot = await get(child(categoriesRef, `users/${userId.value}/categories`));

      if (snapshot.exists()) {
        const categoriesObj = await snapshot.val();
        const categoriesArr = Object.keys(categoriesObj).map((key) => ({
          ...categoriesObj[key],
          id: key
        }));

        categories.value = categoriesArr;
      } else {
        categories.value = [];
      }

      return categories.value;
    } catch (e) {
      setError(e);
    }
  }

  async function fetchCategoryById(id) {
    try {
      const authStore = useAuthStore();
      const { userId } = storeToRefs(authStore);

      const categoriesRef = firebaseRef(database);

      const snapshot = await get(child(categoriesRef, `users/${userId.value}/categories/${id}`));

      if (snapshot.exists()) {
        const category = await snapshot.val();

        return {
          ...category,
          id,
        }
      } else {
        return null;
      }
    } catch (e) {
      setError(e);
    }
  }

  return {
    categories,
    createCategory,
    updateCategory,
    fetchCategories,
    fetchCategoryById,
  }
});