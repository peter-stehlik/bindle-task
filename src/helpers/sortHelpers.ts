import type { Product } from './types'

export interface SortParams {
  sortBy: 'title' | 'price'
  order: 'asc' | 'desc'
}

export const getSortParams = (sortOption: string): SortParams => {
  switch (sortOption) {
    case 'Title A-Z':
      return { sortBy: 'title', order: 'asc' }
    case 'Title Z-A':
      return { sortBy: 'title', order: 'desc' }
    case 'Price Low to High':
      return { sortBy: 'price', order: 'asc' }
    case 'Price High to Low':
      return { sortBy: 'price', order: 'desc' }
    default:
      return { sortBy: 'title', order: 'asc' }
  }
}

export const sortProducts = (productsToSort: Product[], sortOption: string): Product[] => {
  const { sortBy, order } = getSortParams(sortOption)
  const sorted = [...productsToSort]
  
  sorted.sort((a, b) => {
    if (sortBy === 'title') {
      // Use localeCompare for proper string comparison
      const comparison = a.title.localeCompare(b.title, undefined, { 
        sensitivity: 'base',
        numeric: true 
      })
      return order === 'asc' ? comparison : -comparison
    } else {
      // Numeric comparison for price
      const comparison = a.price - b.price
      return order === 'asc' ? comparison : -comparison
    }
  })
  
  return sorted
}

