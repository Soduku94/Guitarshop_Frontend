'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = authService.getUser();
    if (!user || !user.roles.includes('ROLE_ADMIN')) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Đang kiểm tra quyền truy cập...</div>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Sản phẩm', path: '/admin/products' },
    { name: 'Đơn hàng', path: '/admin/orders' },
    { name: 'Về trang chủ', path: '/' },
  ];

  return (
    <div className="flex h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
      {/* Sidebar */}
      <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
        <div className="p-6 border-b border-dark-700">
          <span className="text-2xl font-bold tracking-widest text-gold-500 uppercase block text-center">
            Admin<span className="text-white">Panel</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path 
                  ? 'bg-gold-500 text-dark-900 font-bold' 
                  : 'text-gray-300 hover:bg-dark-700 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-dark-700">
          <button 
            onClick={() => {
              authService.logout();
              router.push('/login');
            }}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-dark-700 hover:text-red-300 rounded-lg transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-dark-900">
        <header className="bg-dark-800 border-b border-dark-700 p-4 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl font-semibold capitalize">
            {navItems.find(i => i.path === pathname)?.name || 'Quản trị viên'}
          </h1>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-dark-900 font-bold">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
