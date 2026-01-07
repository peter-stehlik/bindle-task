import type { Product, ProductsResponse } from './types'
import { sortProducts } from './sortHelpers'

export const fetchProducts = async (
  page: number,
  limit: number,
  selectedCategory: string,
  sortOption: string
): Promise<{ products: Product[]; total: number }> => {
  let url: string
  let allProducts: Product[] = []
  
  if (selectedCategory === 'all') {
    // Fetch all products (we'll sort client-side for consistency)
    // First, get total count
    const countResponse = await fetch('https://dummyjson.com/products?limit=0')
    const countData: ProductsResponse = await countResponse.json()
    const total = countData.total
    
    // Fetch all products to sort client-side
    const allResponse = await fetch(`https://dummyjson.com/products?limit=${total}`)
    const allData: ProductsResponse = await allResponse.json()
    allProducts = allData.products
    
    // Sort products client-side
    allProducts = sortProducts(allProducts, sortOption)
    
    // Paginate client-side
    const skip = (page - 1) * limit
    const products = allProducts.slice(skip, skip + limit)
    
    return { products, total }
  } else {
    // Fetch products by category (API doesn't support pagination/sorting on category endpoint)
    // So we fetch all category products, sort client-side, then paginate
    url = `https://dummyjson.com/products/category/${selectedCategory}`
    const response = await fetch(url)
    const data: ProductsResponse = await response.json()
    allProducts = data.products
    
    // Sort products client-side
    allProducts = sortProducts(allProducts, sortOption)
    
    // Paginate client-side
    const skip = (page - 1) * limit
    const total = allProducts.length
    const products = allProducts.slice(skip, skip + limit)
    
    return { products, total }
  }
}

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch('https://dummyjson.com/products/category-list')
  return await response.json()
}

