'use client';

import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-sm">
          <h3 className="text-gray-400 text-sm font-medium">Tổng Sản Phẩm</h3>
          <p className="text-3xl font-bold mt-2">124</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium">+12%</span>
            <span className="text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-sm">
          <h3 className="text-gray-400 text-sm font-medium">Đơn Hàng Mới</h3>
          <p className="text-3xl font-bold mt-2">38</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium">+5%</span>
            <span className="text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>
        
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-sm">
          <h3 className="text-gray-400 text-sm font-medium">Doanh Thu (Tháng)</h3>
          <p className="text-3xl font-bold mt-2 text-gold-500">450.5M ₫</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-500 font-medium">-2%</span>
            <span className="text-gray-500 ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Chào mừng đến với Trang Quản Trị</h2>
        <p className="text-gray-400">
          Sử dụng thanh menu bên trái để điều hướng đến các tính năng quản lý.
        </p>
      </div>
    </div>
  );
}
