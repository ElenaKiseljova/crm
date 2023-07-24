<template>
  <div class="app-page">
    <div>
      <div class="page-title">
        <!-- <h3>Категории</h3> -->
        <h3>{{ $t('nav.categories') }}</h3>
      </div>

      <section>
        <BaseLoader v-if="isLoading" />
        <div v-else class="row">
          <CategoryCreate @created="addNewCategory" />
          <CategoryEdit
            v-if="categories.length"
            :key="categoryEditUpdate"
            @updated="updateCategories"
            :categories="categories"
          />
          <p v-else class="center">{{ $t('no-categories') }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate.vue';
import CategoryEdit from '@/components/CategoryEdit.vue';

import { ref } from '@vue/reactivity';
import { computed, onMounted } from '@vue/runtime-core';

import { useCategoryStore } from '@/stores/category';

export default {
  name: 'CategoriesView',
  components: { CategoryCreate, CategoryEdit },
  setup() {
    const categoryStore = useCategoryStore();
    const { fetchCategories } = categoryStore;

    const categories = ref([]);
    const isLoading = ref(true);
    const updateCount = ref(0);

    const categoryEditUpdate = computed(() => {
      return categories.value.length + updateCount.value;
    });

    onMounted(async () => {
      categories.value = await fetchCategories();

      isLoading.value = false;
    });

    function addNewCategory(category) {
      categories.value.push(category);
    }

    function updateCategories(category) {
      const idx = categories.value.findIndex((cat) => cat.id === category.id);

      categories.value[idx].title = category.title;
      categories.value[idx].limit = category.limit;

      updateCount.value++;
    }

    return {
      isLoading,
      categories,
      categoryEditUpdate,
      addNewCategory,
      updateCategories,
    };
  },
};
</script>
