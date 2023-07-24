<template>
  <div class="grey darken-1 empty-layout">
    <RouterView />
  </div>
</template>

<script>
import useRenderingError from '@/composables/renderingError';

export default {
  name: 'EmptyLayout',
  setup() {
    useRenderingError();
  },
};
</script>