<script setup lang="ts">
interface Props {
  selectedCategory: string
  sortOption: string
  categories: string[]
  total: number
}

interface Emits {
  (e: 'update:selectedCategory', value: string): void
  (e: 'update:sortOption', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Format category slug to readable name
const formatCategoryName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

</script>

<template>
  <div id="filters-section" class="lg:rounded-lg lg:shadow-sm lg:border lg:border-gray-200 lg:p-6 mb-4 lg:mb-8">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div id="category-filter">
        <label class="block text-sm font-medium text-gray-700 mb-2">Product Category</label>
        <select 
          :value="selectedCategory" 
          @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base"
        >
          <option value="all">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ formatCategoryName(category) }}
          </option>
        </select>
      </div>
      
      <div id="sort-filter">
        <label class="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
        <select 
          :value="sortOption" 
          @change="emit('update:sortOption', ($event.target as HTMLSelectElement).value)"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm md:text-base"
        >
          <option>Title A-Z</option>
          <option>Title Z-A</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
        </select>
      </div>
    </div>
    
    <div class="text-sm text-gray-600">
      <span class="font-medium">{{ total.toLocaleString() }}</span> products found
    </div>
  </div>
</template>

<style scoped>

</style>

