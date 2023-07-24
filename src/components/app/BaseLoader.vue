<template>
  <div class="app-loader">
    <div class="preloader-wrapper active">
      <div class="spinner-layer" :class="color">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default {
  setup() {
    const color = computed(() => {
      const colors = [
        'spinner-red-only',
        'spinner-blue-only',
        'spinner-green-only',
      ];

      return colors[getRandomValue(0, 2)];
    });

    return {
      color,
    };
  },
};
</script>