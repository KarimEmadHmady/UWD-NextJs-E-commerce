// Product details dynamic route page

import ProductDetails from '@/components/product/ProductDetails/ProductDetails';
import { products } from '@/components/product/product-data';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string }
}

export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.id === Number(params.id));
  if (!product) return notFound();
  return <ProductDetails product={product} />;
}
