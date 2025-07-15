// Product details dynamic route page

import ProductDetails from '@/components/product/ProductDetails/ProductDetails';
import { products } from '@/components/product/product-data';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string }
}

/**
 * ProductPage component - Displays the details of a single product based on the dynamic route ID.
 * Fetches the product and renders the ProductDetails component, or shows not found if missing.
 */
export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.id === Number(params.id));
  if (!product) return notFound();
  return <ProductDetails product={product} />;
}
