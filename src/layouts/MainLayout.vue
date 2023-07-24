<template>
  <div>
    <BaseLoader v-if="isLoading" />

    <div v-else class="app-main-layout">
      <NavBar @burgerClick="toggleOpenState" />

      <SideBar :open="isOpen" />

      <main class="app-content" :class="{ full: !isOpen }">
        <RouterView />
      </main>

      <div class="fixed-action-btn">
        <router-link
          class="btn-floating btn-large blue"
          to="/record"
          v-tooltip="$t('create-new-record')"
        >
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/app/NavBar.vue';
import SideBar from '@/components/app/SideBar.vue';

import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';

// import { useRouter } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useInfoStore } from '@/stores/info';

import useRenderingError from '@/composables/renderingError';

export default {
  name: 'MainLayout',
  components: {
    NavBar,
    SideBar,
  },
  setup() {
    useRenderingError();

    /* Просто чтобы поиграться с Lodash - start */
    const _ = require('lodash');
    /* Просто чтобы поиграться с Lodash - end */

    // const router = useRouter();

    const isLoading = ref(true);
    const isOpen = ref(true);

    const infoStore = useInfoStore();
    const { info } = storeToRefs(infoStore);
    const { fetchInfo } = infoStore;

    onMounted(async () => {
      /* Просто чтобы поиграться с Lodash - start */
      if (_.isEmpty(info.value)) {
        /* Просто чтобы поиграться с Lodash - end */
        // if (!Object.keys(info).length) {
        const info = await fetchInfo();

        if (info) {
          isLoading.value = false;
        }
        // else {
        //   router.replace('/login');
        // }
      }
    });

    function toggleOpenState() {
      isOpen.value = !isOpen.value;
    }

    return {
      isLoading,
      isOpen,
      toggleOpenState,
    };
  },
};
</script>