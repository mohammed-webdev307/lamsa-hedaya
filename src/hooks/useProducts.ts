import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, CategoryId, OccasionId } from '@/types';

interface RawProduct {
  id: number;
  name: string;
  description: string | null;
  short_description?: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  image_url: string | null;
  gallery?: string[] | null;
  available: boolean;
  visible: boolean;
  badge?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  features?: string[] | null;
  occasions?: string[] | null;
}

function mapProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    shortDescription: raw.short_description ?? (raw.description ?? '').slice(0, 80),
    description: raw.description ?? '',
    price: Number(raw.price),
    oldPrice: raw.old_price ? Number(raw.old_price) : undefined,
    image: raw.image_url ?? '',
    gallery: raw.gallery ?? (raw.image_url ? [raw.image_url] : []),
    category: (raw.category ?? 'boxes') as CategoryId,
    occasions: (raw.occasions ?? []) as OccasionId[],
    rating: Number(raw.rating ?? 0),
    reviewsCount: raw.reviews_count ?? 0,
    inStock: raw.available,
    badge: (raw.badge as Product['badge']) ?? undefined,
    features: raw.features ?? [],
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setProducts([]);
      } else {
        setProducts((data as RawProduct[]).map(mapProduct));
      }
      setLoading(false);
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('visible', true)
        .maybeSingle();

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setProduct(null);
      } else if (data) {
        setProduct(mapProduct(data as RawProduct));
      } else {
        setProduct(null);
      }
      setLoading(false);
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
