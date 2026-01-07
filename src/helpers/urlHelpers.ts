import type { Ref } from 'vue'
import { validSortOptions, defaultSort, defaultCategory } from './constants'

export const getQueryParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search)
}

export const updateURL = (
  selectedCategory: string,
  sortOption: string,
  isReadingFromURL: Ref<boolean>
): void => {
  // Don't update URL when reading from query params
  if (isReadingFromURL.value) {
    return
  }
  
  const params = new URLSearchParams()
  
  // Only add category param if not default
  if (selectedCategory !== defaultCategory) {
    params.set('category', selectedCategory)
  }
  
  // Only add sort param if not default
  if (sortOption !== defaultSort) {
    params.set('sort', sortOption)
  }
  
  const newURL = params.toString() 
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname
  
  window.history.replaceState({}, '', newURL)
}

export const validateAndSetCategoryFromQuery = (
  pendingCategoryParam: Ref<string | null>,
  categories: Ref<string[]>,
  selectedCategory: Ref<string>
): void => {
  if (pendingCategoryParam.value && categories.value.length > 0) {
    const categoryParam = pendingCategoryParam.value
    if (categoryParam === defaultCategory || categories.value.includes(categoryParam)) {
      selectedCategory.value = categoryParam
    } else {
      // Invalid category, remove from URL
      const params = getQueryParams()
      params.delete('category')
      const newURL = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname
      window.history.replaceState({}, '', newURL)
    }
    pendingCategoryParam.value = null
  }
}

export const readQueryParams = (
  categories: Ref<string[]>,
  selectedCategory: Ref<string>,
  sortOption: Ref<string>,
  pendingCategoryParam: Ref<string | null>
): void => {
  const params = getQueryParams()
  const categoryParam = params.get('category')
  const sortParam = params.get('sort')
  
  // Handle category param
  if (categoryParam) {
    if (categories.value.length > 0) {
      // Categories already loaded, validate immediately
      if (categoryParam === defaultCategory || categories.value.includes(categoryParam)) {
        selectedCategory.value = categoryParam
      } else {
        // Invalid category, remove from URL
        params.delete('category')
      }
    } else {
      // Categories not loaded yet, store for later validation
      pendingCategoryParam.value = categoryParam
    }
  }
  
  // Validate and set sort
  if (sortParam) {
    if (validSortOptions.includes(sortParam as any)) {
      sortOption.value = sortParam
    } else {
      // Invalid sort, remove from URL
      params.delete('sort')
    }
  }
  
  // Remove any unknown params
  const knownParams = ['category', 'sort']
  const paramsToRemove: string[] = []
  params.forEach((_, key) => {
    if (!knownParams.includes(key)) {
      paramsToRemove.push(key)
    }
  })
  paramsToRemove.forEach(key => params.delete(key))
  
  // Update URL if we removed invalid params
  if (paramsToRemove.length > 0) {
    const newURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname
    window.history.replaceState({}, '', newURL)
  }
}

