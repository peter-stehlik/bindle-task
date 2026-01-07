<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'page-change', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const getPageNumbers = (): (number | string)[] => {
  const pages: (number | string)[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
}
</script>

<template>
  <div v-if="totalPages > 1" id="pagination" class="flex justify-center items-center mt-12 space-x-2">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
      </svg>
    </button>
    <button
      v-for="page in getPageNumbers()"
      :key="page"
      @click="typeof page === 'number' && goToPage(page)"
      :class="[
        'px-4 py-2 rounded-lg',
        typeof page === 'number' && page === currentPage
          ? 'bg-teal-600 text-white'
          : typeof page === 'number'
          ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
          : 'px-2 text-gray-500 cursor-default'
      ]"
      :disabled="typeof page === 'string'"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path fill="currentColor" d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"></path>
      </svg>
    </button>
  </div>
</template>

<style scoped>

</style>

