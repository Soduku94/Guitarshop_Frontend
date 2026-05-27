import React from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Guitar } from '@/types';
import { formatVND } from '@/lib/utils';

interface FeaturedSectionProps {
  guitars: Guitar[];
}

export default function FeaturedSection({ guitars }: FeaturedSectionProps) {
  const defaultImages = [
    "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550291652-6cb90046361f?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1924&auto=format&fit=crop"
  ];

  return (
    <section id="featured" className="py-24 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sản Phẩm <span className="text-gold-500">Mới Nhất</span></h2>
            <div className="w-24 h-1 bg-gold-500 rounded-full"></div>
          </div>
          <a href="#" className="hidden md:flex items-center text-gold-500 hover:text-gold-600 font-semibold transition-colors">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {guitars && Array.isArray(guitars) && guitars.map((guitar, i) => {
            if (!guitar) return null;
            return (
              <ProductCard 
                key={guitar.id || i}
                id={guitar.id || 0}
                name={guitar.name || 'Sản phẩm không tên'}
                price={formatVND(guitar.price)}
                category={guitar.brand?.name || 'N/A'}
                image={guitar.thumbnail || defaultImages[i % 4]}
              />
            );
          })}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <a href="#" className="inline-flex items-center justify-center w-full px-6 py-3 border border-gold-500 text-gold-500 font-semibold rounded-lg hover:bg-gold-500/10 transition-colors">
            Xem tất cả sản phẩm
          </a>
        </div>
      </div>
    </section>
  );
}
