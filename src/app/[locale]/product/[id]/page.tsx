import { notFound } from 'next/navigation';
import RevealOnScroll from '@/components/common/RevealOnScroll';
import ProductDetails from '@/components/product/ProductDetails/ProductDetails';
import { products } from '@/components/product/product-data';

type ParamsType = {
  locale?: string;
  id?: string;
};

export default async function ProductPage(props: { params: Promise<ParamsType> }) {
  const { id } = await props.params;

  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    notFound();
    return null;
  }

  return (
    <RevealOnScroll>
      <ProductDetails product={product} />
    </RevealOnScroll>
  );
}
