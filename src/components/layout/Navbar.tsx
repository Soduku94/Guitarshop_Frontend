'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { User } from '@/types';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="fixed w-full z-50 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold tracking-widest text-gold-500 uppercase">
              Resonar <span className="text-white">Guitar</span>
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-gold-500 px-3 py-2 text-sm font-medium transition-colors">Trang chủ</a>
            <a href="#categories" className="text-gray-300 hover:text-gold-500 px-3 py-2 text-sm font-medium transition-colors">Danh mục</a>
            <a href="#featured" className="text-gray-300 hover:text-gold-500 px-3 py-2 text-sm font-medium transition-colors">Nổi bật</a>
            <a href="#about" className="text-gray-300 hover:text-gold-500 px-3 py-2 text-sm font-medium transition-colors">Về chúng tôi</a>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-300 hover:text-gold-500 transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button className="text-gray-300 hover:text-gold-500 transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium text-gold-500">
                  {user.fullName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-gold-500 transition-colors text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-300 hover:text-gold-500 transition-colors p-2" aria-label="Đăng nhập/Đăng ký">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
