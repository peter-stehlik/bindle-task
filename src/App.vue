<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'

import FiltersSection from './components/FiltersSection.vue'
import Pagination from './components/Pagination.vue'
import PageHeader from './components/PageHeader.vue'

import { fetchProducts as fetchProductsAPI, fetchCategories as fetchCategoriesAPI } from './helpers/apiHelpers'
import { updateURL, readQueryParams, validateAndSetCategoryFromQuery } from './helpers/urlHelpers'

const currentPage = ref(1)
const limit = ref(10)
const sortOption = ref('Title A-Z')
const selectedCategory = ref('all')
const pendingCategoryParam = ref<string | null>(null)
const isReadingFromURL = ref(false)

// Format category slug to readable name
const formatCategoryName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Fetch categories using Vue Query
const { data: categoriesData, isSuccess: categoriesLoaded } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategoriesAPI,
  staleTime: Infinity, // Categories don't change often
})

const categories = computed(() => categoriesData.value ?? [])

// Fetch products using Vue Query
const { data: productsData, isLoading: loading } = useQuery({
  queryKey: ['products', currentPage, limit, selectedCategory, sortOption],
  queryFn: () => fetchProductsAPI(currentPage.value, limit.value, selectedCategory.value, sortOption.value),
  enabled: () => categoriesLoaded.value, // Only fetch products after categories are loaded
})

const products = computed(() => productsData.value?.products ?? [])
const total = computed(() => productsData.value?.total ?? 0)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

// Watch for sort option changes and refetch products
watch(sortOption, () => {
  currentPage.value = 1
  updateURL(selectedCategory.value, sortOption.value, isReadingFromURL)
})

// Watch for category changes and refetch products
watch(selectedCategory, () => {
  currentPage.value = 1
  updateURL(selectedCategory.value, sortOption.value, isReadingFromURL)
})

// Watch for categories to load and validate pending category param
watch(categoriesData, (newCategories) => {
  if (newCategories && newCategories.length > 0) {
    validateAndSetCategoryFromQuery(pendingCategoryParam, categories, selectedCategory)
  }
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Handle browser back/forward navigation
const handlePopState = () => {
  isReadingFromURL.value = true
  readQueryParams(categories, selectedCategory, sortOption, pendingCategoryParam)
  currentPage.value = 1
  isReadingFromURL.value = false
}

onMounted(() => {
  // Read query params first (before fetching categories)
  isReadingFromURL.value = true
  readQueryParams(categories, selectedCategory, sortOption, pendingCategoryParam)
  isReadingFromURL.value = false
  
  // Listen for browser back/forward navigation
  window.addEventListener('popstate', handlePopState)
})
</script>

<template>
<main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <PageHeader />

    <FiltersSection
      v-model:selectedCategory="selectedCategory"
      v-model:sortOption="sortOption"
      :categories="categories"
      :total="total"
    />

    <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading products...</p>
    </div>

    <div v-else-if="products.length > 0" id="books-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-xl shadow-md border border-teal-100 overflow-hidden hover:shadow-xl hover:border-teal-200 transition-all duration-300 group flex md:flex-col"
        >
            <div class="relative w-1/3 md:w-full flex-shrink-0">
                <div class="w-full h-full min-h-[120px] md:h-48 flex items-center justify-center p-2 md:p-0">
                    <img
                        class="w-auto h-full max-h-32 md:max-h-36 object-cover"
                        :src="product.thumbnail"
                        :alt="product.title"
                        loading="lazy"
                    >
                </div>
            </div>

            <div class="flex-1 p-3 md:p-4 flex flex-col">
                <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2">{{ product.title }}</h3>
                
                <p class="text-xs md:text-sm text-gray-600 mb-2 md:mb-4">{{ formatCategoryName(product.category) }}</p>

                <div class="flex flex-row md:flex-col items-center md:items-stretch gap-2 md:gap-0 mt-auto">
                    <div class="flex-1 text-lg md:text-xl font-bold text-teal-600 mb-0 md:mb-4">${{ product.price.toFixed(2) }}</div>
                    <a href="#" class="flex items-center justify-center flex-1 md:w-full bg-teal-600 text-white py-2 md:py-2.5 text-sm md:text-base rounded-lg hover:bg-teal-700 transition-colors font-medium">
                        Add to Cart
                    </a>
                </div>
            </div>
        </div>
    </div>

    <Pagination
      v-if="!loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="goToPage"
    />
</main>
</template>

<style scoped>

</style>
