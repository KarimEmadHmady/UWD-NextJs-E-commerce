"use client"

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import RevealOnScroll from '@/components/common/RevealOnScroll';
import ProductDetails from '@/components/product/ProductDetails/ProductDetails';
import { useProduct } from '@/hooks/useProducts';
import { convertApiProductToUI } from '@/components/product/product-data';
import Skeleton from '@/components/common/Skeleton';

type ParamsType = {
  locale?: string;
  id?: string;
};

export default function ProductPage({ params }: { params: Promise<ParamsType> }) {
  const [resolvedParams, setResolvedParams] = useState<ParamsType | null>(null);
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
      if (resolved.id) {
        setProductId(Number(resolved.id));
      }
    };
    resolveParams();
  }, [params]);

  const { data: apiProduct, isLoading, error } = useProduct(productId || 0);

  console.log('Product ID:', productId);
  console.log('Product ID type:', typeof productId);
  console.log('API Product:', apiProduct);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  if (!resolvedParams || !productId || isLoading) {
    return (
      <RevealOnScroll>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-96 mb-4" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-20" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="w-3/4 h-8 mb-4" />
              <Skeleton className="w-1/2 h-6 mb-4" />
              <Skeleton className="w-full h-32 mb-4" />
              <Skeleton className="w-1/3 h-12 mb-4" />
              <Skeleton className="w-full h-20" />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    );
  }

  if (error || !apiProduct) {
    notFound();
    return null;
  }

  const product = convertApiProductToUI(apiProduct);

  return (
    <RevealOnScroll>
      <ProductDetails product={product} />
    </RevealOnScroll>
  );
}
