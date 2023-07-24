<template>
  <ul class="sidenav app-sidenav" :class="{ open: open }">
    <router-link
      v-for="link in links"
      :key="link.url"
      :to="link.url"
      custom
      v-slot="{ href, navigate, isExactActive }"
    >
      <li :class="{ active: isExactActive }">
        <a
          class="waves-effect waves-orange pointer"
          :href="href"
          @click="navigate"
        >
          <!-- {{ link.title }} -->
          {{ $t(link.title) }}
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script>
import { ref } from '@vue/reactivity';

export default {
  name: 'side-bar',
  props: {
    open: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  setup() {
    // const links = ref([
    //   {
    //     title: 'Счет',
    //     url: '/',
    //   },
    //   {
    //     title: 'История',
    //     url: '/history',
    //   },
    //   {
    //     title: 'Планирование',
    //     url: '/planning',
    //   },
    //   {
    //     title: 'Новая запись',
    //     url: '/record',
    //   },
    //   {
    //     title: 'Категории',
    //     url: '/categories',
    //   },
    // ]);

    const links = ref([
      {
        title: 'nav.bill',
        url: '/',
      },
      {
        title: 'nav.history',
        url: '/history',
      },
      {
        title: 'nav.planning',
        url: '/planning',
      },
      {
        title: 'nav.new-record',
        url: '/record',
      },
      {
        title: 'nav.categories',
        url: '/categories',
      },
    ]);

    return {
      links,
    };
  },
};
</script>