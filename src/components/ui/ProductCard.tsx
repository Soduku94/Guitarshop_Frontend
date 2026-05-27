'use client';

import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  return (
    <div className="group relative bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 hover:border-gold-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col h-full">
      <Link href={`/products/${id}`} className="block relative aspect-[3/4] overflow-hidden bg-dark-900">
        {/* Fallback to background color if image fails, but normally would use next/image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
      </Link>
      
      <div className="p-6 relative flex-grow flex flex-col justify-end min-h-[160px]">
        <Link href={`/products/${id}`} className="block">
          <span className="text-gold-500 text-xs font-bold tracking-wider uppercase mb-2 block">{category}</span>
          <h3 className="text-xl font-bold text-white mb-1 hover:text-gold-400 transition-colors line-clamp-2">{name}</h3>
          <p className="text-gray-300 font-medium mb-4">{price}</p>
        </Link>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            alert('Đã thêm sản phẩm vào giỏ hàng!');
          }}
          className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex items-center justify-center space-x-2 mt-auto"
        >
          <span>Thêm vào giỏ</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
