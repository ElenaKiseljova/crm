import { computed, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

export default function useRenderingPagination(perPage = 5) {
  const router = useRouter();
  const route = useRoute();

  const _ = require('lodash');

  const page = ref(+route.query.page || 1);
  const pageCount = ref(0);
  const items = ref([]);
  const itemsAllPages = ref([]);
  const itemsByPage = ref([]);

  const countItems = computed(() => {
    return items.value.length;
  });

  function setupPagination(pagItems) {
    items.value = pagItems;
    itemsAllPages.value = _.chunk(pagItems, perPage);
    pageCount.value = _.size(itemsAllPages.value);
    itemsByPage.value = itemsAllPages.value[page.value - 1] || itemsAllPages.value[0];
  }

  function pageChangeHandler(curPage) {
    router.push({ path: route.path, query: { page: curPage } });

    itemsByPage.value = itemsAllPages.value[curPage - 1] || itemsAllPages.value[0];
  }

  return {
    page,
    perPage,
    pageCount,
    items,
    itemsAllPages,
    itemsByPage,
    countItems,
    setupPagination,
    pageChangeHandler,
  };
}