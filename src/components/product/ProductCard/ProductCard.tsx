import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import type { Product } from '../product-data';
import { CartProduct } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: [product.image, ...product.gallery],
      category: product.categories[0] || 'General',
      rating: product.rating,
      stock: product.inStock ? 10 : 0,
      brand: 'Brand',
      tags: product.categories,
    };
    
    addItem(cartProduct, 1);

    // Show success state briefly
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-xs sm:text-base font-semibold text-gray-900 mb-2 hover:text-primary transition-colors mt-[5px] ">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs sm:text-base font-bold text-gray-900">
            E.L{product.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full transition-all duration-300 ${
            isAdding ? 'bg-green-500 text-white' : ''
          }`}
          variant={!product.inStock ? "ghost" : "default"}
        >
          {!product.inStock
            ? "Out of Stock"
            : isAdding
              ? "Added! ✓"
              : "Add to Cart"
          }
        </Button>
      </div>
    </div>
  );
};