<template>
  <div>
    <component :is="layout">
      <RouterView />
    </component>
  </div>
  <!-- Test rebase -->
</template>

<script>
import { computed } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';

import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';

import { useI18n } from 'vue-i18n';

import EmptyLayout from '@/layouts/EmptyLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

export default {
  components: {
    EmptyLayout,
    MainLayout,
  },
  setup() {
    const route = useRoute();

    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);

    const { t, locale } = useI18n({ useScope: 'global' });

    const layout = computed(() => {
      return route.meta?.layout
        ? `${route.meta.layout}-layout`
        : 'empty-layout';
    });

    watch(info, () => {
      if (info.value?.locale) {
        switchLang();
      }
    });

    function switchLang() {
      info.value?.locale === 'ru-RU'
        ? (locale.value = 'ru')
        : (locale.value = 'en');
    }

    return {
      t,
      layout,
    };
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import '~materialize-css/dist/css/materialize.min.css';
@import '@/assets/index.css';

.message-error {
  color: red !important;
}
</style>
