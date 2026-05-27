'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService } from '@/services/adminService';
import { Guitar } from '@/types';
import { formatVND } from '@/lib/utils';

export default function AdminProductsPage() {
  const [guitars, setGuitars] = useState<Guitar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuitars();
  }, []);

  const fetchGuitars = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllGuitars();
      setGuitars(data);
    } catch (error) {
      console.error('Failed to fetch guitars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await adminService.deleteGuitar(id);
        fetchGuitars(); // Refresh list
      } catch (error) {
        alert('Xóa thất bại');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Sản phẩm</h2>
        <Link 
          href="/admin/products/new"
          className="bg-gold-500 hover:bg-gold-400 text-dark-900 px-4 py-2 rounded-lg font-bold transition-colors"
        >
          + Thêm Mới
        </Link>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-dark-900 border-b border-dark-700 text-gray-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Sản Phẩm</th>
                <th className="px-6 py-4">Thương Hiệu</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Kho</th>
                <th className="px-6 py-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Đang tải dữ liệu...</td>
                </tr>
              ) : guitars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Không có sản phẩm nào.</td>
                </tr>
              ) : (
                guitars.map((guitar) => (
                  <tr key={guitar.id} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400">#{guitar.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {guitar.thumbnail ? (
                          <img src={guitar.thumbnail} alt={guitar.name} className="w-10 h-10 object-cover rounded mr-3 bg-dark-700" />
                        ) : (
                          <div className="w-10 h-10 bg-dark-700 rounded mr-3 flex items-center justify-center text-gray-500 text-xs">No img</div>
                        )}
                        <span className="font-medium text-white">{guitar.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{guitar.brand?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gold-500 font-medium">{formatVND(guitar.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${guitar.quantity > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {guitar.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link href={`/admin/products/${guitar.id}`} className="text-blue-400 hover:text-blue-300 transition-colors">Sửa</Link>
                      <button onClick={() => handleDelete(guitar.id)} className="text-red-400 hover:text-red-300 transition-colors">Xóa</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
