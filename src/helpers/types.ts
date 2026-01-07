export interface Product {
  id: number
  title: string
  category: string
  price: number
  thumbnail: string
  images: string[]
  description: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

