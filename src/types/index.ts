export type CategoryId =
  | 'boxes'
  | 'flowers'
  | 'chocolate'
  | 'dolls'
  | 'perfumes'
  | 'custom'
  | 'graduation'
  | 'birthday'
  | 'wedding'
  | 'newborn';

export type OccasionId =
  | 'birthday'
  | 'graduation'
  | 'engagement'
  | 'wedding'
  | 'newborn'
  | 'anniversary'
  | 'apology'
  | 'thanks'
  | 'surprise';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  icon: string;
}

export interface Occasion {
  id: OccasionId;
  name: string;
  icon: string;
}

export interface Product {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery: string[];
  category: CategoryId;
  occasions: OccasionId[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  badge?: 'new' | 'bestseller' | 'sale';
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization: ProductCustomization;
}

export interface ProductCustomization {
  wrappingColor: string;
  recipientName: string;
  giftMessage: string;
  occasion: string;
  notes: string;
}

export interface WishlistItem {
  productId: number;
  addedAt: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}
