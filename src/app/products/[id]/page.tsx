'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchGuitarById } from '@/services/api';
import { Guitar } from '@/types';
import { formatVND } from '@/lib/utils';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [guitar, setGuitar] = useState<Guitar | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'specs'>('info');

  const defaultImages = [
    "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550291652-6cb90046361f?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1924&auto=format&fit=crop"
  ];

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchGuitarById(Number(id));
        setGuitar(data);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-lg font-medium animate-pulse">Đang tải chi tiết tuyệt phẩm...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!guitar) {
    return (
      <main className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-red-500">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-400">Sản phẩm này có thể không tồn tại hoặc đã bị gỡ bỏ.</p>
            <Link href="/" className="inline-block bg-gold-500 hover:bg-gold-400 text-dark-900 px-6 py-3 rounded-lg font-bold transition-colors">
              Quay lại Trang Chủ
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Lấy ảnh hiển thị chính
  const mainImage = guitar.thumbnail || defaultImages[guitar.id % 4];

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < (guitar.quantity || 10)) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm "${guitar.name}" vào giỏ hàng!`);
  };

  return (
    <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900 flex flex-col">
      <Navbar />

      <div className="flex-grow pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gold-500 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="hover:text-gold-500 transition-colors cursor-pointer">{guitar.category?.name || 'Guitars'}</span>
          <span>/</span>
          <span className="text-gray-200 truncate max-w-xs">{guitar.name}</span>
        </div>

        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Column 1: Image Showcase */}
          <div className="space-y-6">
            <div className="aspect-square bg-dark-800 rounded-3xl overflow-hidden border border-dark-700 relative shadow-2xl group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${mainImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 via-transparent to-transparent" />
            </div>

            {/* Sub-images if any */}
            {guitar.images && guitar.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {guitar.images.map((img) => (
                  <div key={img.id} className="aspect-square bg-dark-800 rounded-xl overflow-hidden border border-dark-700 cursor-pointer hover:border-gold-500/50 transition-all relative">
                    <img src={img.url} alt="sub-img" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Product purchasing options */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Category & Brand Labels */}
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs font-bold rounded-full uppercase tracking-wider">
                  {guitar.brand?.name || 'Exclusive'}
                </span>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  {guitar.category?.name || 'Guitar'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {guitar.name}
              </h1>

              {/* Rating Star Placeholder */}
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <div className="flex text-gold-500">
                  {"★★★★★".split("").map((star, idx) => (
                    <span key={idx}>{star}</span>
                  ))}
                </div>
                <span>|</span>
                <span>5.0 (42 Đánh giá)</span>
                <span>|</span>
                <span className={guitar.quantity > 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                  {guitar.quantity > 0 ? `Còn hàng (${guitar.quantity})` : 'Hết hàng'}
                </span>
              </div>

              {/* Price */}
              <div className="p-6 bg-dark-800/60 rounded-2xl border border-dark-700/80 shadow-md">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block mb-1">Giá Độc Quyền</span>
                <div className="text-3xl sm:text-4xl font-black text-gold-500 tracking-tight">
                  {formatVND(guitar.price)}
                </div>
              </div>
            </div>

            {/* Interactive Quantity Selector & Cart buttons */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <span className="text-gray-300 font-medium">Số lượng:</span>
                <div className="flex items-center bg-dark-800 border border-dark-700 rounded-lg p-1">
                  <button 
                    onClick={handleDecreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors font-bold text-lg"
                  >
                    &minus;
                  </button>
                  <span className="w-12 text-center font-bold text-lg text-white">{quantity}</span>
                  <button 
                    onClick={handleIncreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors font-bold text-lg"
                  >
                    &#43;
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-dark-800 hover:bg-dark-700 border border-gold-500/50 hover:border-gold-500 text-gold-500 font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
                
                <button 
                  onClick={() => alert(`Đặt mua trực tiếp thành công ${quantity} sản phẩm!`)}
                  className="flex-grow bg-gold-500 hover:bg-gold-400 text-dark-900 font-extrabold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] text-center"
                >
                  Mua Ngay
                </button>
              </div>
            </div>

            {/* Extra details (Tabs) */}
            <div className="border-t border-dark-700 pt-8">
              <div className="flex border-b border-dark-700/80 mb-6">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`pb-3 pr-6 font-bold transition-all relative ${activeTab === 'info' ? 'text-gold-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Mô Tả Sản Phẩm
                  {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500"></span>}
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 px-6 font-bold transition-all relative ${activeTab === 'specs' ? 'text-gold-500' : 'text-gray-400 hover:text-white'}`}
                >
                  Thông Số Kỹ Thuật
                  {activeTab === 'specs' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-500"></span>}
                </button>
              </div>

              {activeTab === 'info' ? (
                <div className="text-gray-300 leading-relaxed text-base min-h-[120px]">
                  {guitar.description ? (
                    <p className="whitespace-pre-line">{guitar.description}</p>
                  ) : (
                    <p className="italic text-gray-500">Tuyệt tác đàn Guitar cao cấp này hiện chưa được cập nhật mô tả chi tiết từ nhà sản xuất. Hãy liên hệ với chúng tôi để được tư vấn chuyên sâu nhất.</p>
                  )}
                </div>
              ) : (
                <div className="min-h-[120px]">
                  <table className="w-full text-left text-sm text-gray-300 divide-y divide-dark-700/50">
                    <tbody>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400 w-1/3">Thương Hiệu</td>
                        <td className="py-3 text-white">{guitar.brand?.name || 'N/A'}</td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Danh Mục</td>
                        <td className="py-3 text-white">{guitar.category?.name || 'N/A'}</td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Loại Gỗ (Wood Type)</td>
                        <td className="py-3 text-white">{guitar.woodType || 'Gỗ cao cấp tuyển chọn'}</td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Màu Sắc</td>
                        <td className="py-3 text-white">{guitar.color || 'Tự nhiên'}</td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Số Dây Đàn</td>
                        <td className="py-3 text-white">{guitar.stringCount || 6} Dây</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
