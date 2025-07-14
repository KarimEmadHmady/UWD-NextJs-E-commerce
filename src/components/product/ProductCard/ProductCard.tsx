import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/common/Button/Button';
import { Badge } from '@/components/common/Badge/Badge';
import type { Product } from '@/types/common';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);

    // Show success state briefly
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-xs sm:text-base font-semibold text-gray-900 mb-2 hover:text-primary transition-colors mt-[5px] ">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs sm:text-base font-bold text-gray-900">
            ${product.price.toFixed(2)}
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
          disabled={product.stock <= 0 || isAdding}
          className={`w-full transition-all duration-300 ${
            isAdding ? 'bg-green-500 text-white' : ''
          }`}
          variant={product.stock <= 0 ? "ghost" : "default"}
        >
          {product.stock <= 0
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