<template>
  <ul v-show="props.showPagination" :class="props.theme.list">
    <li
      :class="props.theme.prev"
      class="waves-effect"
      @click="props.setPrevPage"
    >
      <a v-bind="props.prevProps">
        <i class="material-icons">chevron_left</i>
      </a>
    </li>

    <li
      v-for="page in props.pages"
      :key="page"
      :class="props.pageClasses(page)"
      class="waves-effect"
      v-on="props.pageEvents(page)"
    >
      <a v-bind="props.aProps" :class="props.theme.link">
        {{ page }}
      </a>
    </li>

    <li
      :class="props.theme.next"
      class="waves-effect"
      @click="props.setNextPage"
    >
      <a v-bind="props.nextProps">
        <i class="material-icons">chevron_right</i>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'PaginationTemplate',
  props: ['props'],
};
</script>