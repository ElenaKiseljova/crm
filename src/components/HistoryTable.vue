<template>
  <table>
    <thead>
      <tr>
        <!-- <th>#</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Категория</th>
        <th>Тип</th>
        <th>Открыть</th> -->
        <th>#</th>
        <th>{{ $t('amount') }}</th>
        <th>{{ $t('date') }}</th>
        <th>{{ $t('category') }}</th>
        <th>{{ $t('type') }}</th>
        <th>{{ $t('open') }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, index) in records" :key="record.id">
        <td>{{ index + startIndexRecord }}</td>
        <td>{{ renderingCurrency(record.amount) }}</td>
        <td>{{ renderingDate(record.date) }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="[record.typeClass]">{{
            record.typeText
          }}</span>
        </td>
        <td>
          <button
            v-tooltip="$t('view-record')"
            class="btn-small btn"
            @click="showRecord(record.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed } from '@vue/runtime-core';

import { useRouter, useRoute } from 'vue-router';

import useRenderingCurrency from '@/composables/renderingCurrency';
import useRenderingDate from '@/composables/renderingDate';

export default {
  props: {
    records: {
      type: Array,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();

    const { renderingCurrency } = useRenderingCurrency();
    const { renderingDate } = useRenderingDate();

    const startIndexRecord = computed(() => {
      const currenPage = +route.query.page || 1;

      return currenPage > 1 ? +props.perPage * (currenPage - 1) : currenPage;
    });

    function showRecord(recordId) {
      router.push(`/record/${recordId}`);
    }

    return {
      renderingCurrency,
      renderingDate,
      startIndexRecord,
      showRecord,
    };
  },
};
</script>
