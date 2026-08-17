export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Brand {
  id: number;
  name: string;
  logoUrl?: string;
  country?: string;
}

export interface ProductImage {
  id: number;
  url: string;
}

export interface Guitar {
  id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  description?: string;
  woodType?: string;
  color?: string;
  stringCount?: number;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  status?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  active: boolean;
  roles: string[];
}
