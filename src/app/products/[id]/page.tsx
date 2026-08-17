'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchGuitarById } from '@/services/api';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';
import { Guitar, Category, Brand } from '@/types';
import { formatVND } from '@/lib/utils';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNew = id === 'new';

  const [guitar, setGuitar] = useState<Guitar | null>(null);
  const [editedGuitar, setEditedGuitar] = useState<Guitar | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'info' | 'specs'>('info');

  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [uploading, setUploading] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<{ name?: boolean; price?: boolean; quantity?: boolean }>({});
  const [shakeField, setShakeField] = useState<{ name?: boolean; price?: boolean; quantity?: boolean }>({});

  const defaultImages = [
    "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550291652-6cb90046361f?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1924&auto=format&fit=crop"
  ];

  useEffect(() => {
    // Check Admin Role
    const user = authService.getUser();
    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      setIsAdmin(true);
      loadSpecsData();
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    if (isNew) {
      // Verify admin rights for new product creation
      const user = authService.getUser();
      if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
        alert('Bạn không có quyền truy cập trang này!');
        router.push('/');
        return;
      }
      
      const newGuitarObj: Guitar = {
        id: 0,
        name: 'Tên sản phẩm mới',
        price: 1000000,
        quantity: 10,
        thumbnail: '',
        description: 'Nhập mô tả chi tiết của đàn guitar tại đây...',
        woodType: 'Gỗ Mahogany',
        color: 'Màu gỗ tự nhiên',
        stringCount: 6,
        status: 'DRAFT',
        category: undefined,
        brand: undefined
      };
      setGuitar(newGuitarObj);
      setEditedGuitar(newGuitarObj);
      setEditMode(true);
      setLoading(false);
    } else {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await fetchGuitarById(Number(id));
      setGuitar(data);
      setEditedGuitar({ ...data });
    } catch (err) {
      console.error("Failed to load product details", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecsData = async () => {
    try {
      const [cats, brs] = await Promise.all([
        adminService.getCategories(),
        adminService.getBrands()
      ]);
      setCategories(cats);
      setBrands(brs);
    } catch (err) {
      console.error("Failed to load metadata categories/brands", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-lg font-medium animate-pulse">Đang tải chi tiết sản phẩm...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!guitar || !editedGuitar) {
    return (
      <main className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-red-500">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-400">Sản phẩm này có thể không tồn tại hoặc bạn không có quyền xem bản nháp.</p>
            <Link href="/" className="inline-block bg-gold-500 hover:bg-gold-400 text-dark-900 px-6 py-3 rounded-lg font-bold transition-colors">
              Quay lại Trang Chủ
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const mainImage = editedGuitar.thumbnail || defaultImages[editedGuitar.id % 4];

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < (editedGuitar.quantity || 10)) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm "${editedGuitar.name}" vào giỏ hàng!`);
  };

  // Admin Actions
  const handleToggleEditMode = () => {
    if (editMode) {
      // Revert changes
      setEditedGuitar({ ...guitar });
      setErrors({});
    }
    setEditMode(!editMode);
  };

  const handleFieldChange = (field: keyof Guitar, value: any) => {
    setEditedGuitar(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });

    // Clear error
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const triggerShake = (field: 'name' | 'price' | 'quantity') => {
    setShakeField(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setShakeField(prev => ({ ...prev, [field]: false }));
    }, 500);
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: boolean; price?: boolean; quantity?: boolean } = {};
    let isValid = true;

    if (!editedGuitar.name || editedGuitar.name.trim() === '') {
      newErrors.name = true;
      isValid = false;
      triggerShake('name');
    }
    if (editedGuitar.price === undefined || editedGuitar.price < 0) {
      newErrors.price = true;
      isValid = false;
      triggerShake('price');
    }
    if (editedGuitar.quantity === undefined || editedGuitar.quantity < 0) {
      newErrors.quantity = true;
      isValid = false;
      triggerShake('quantity');
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert('Vui lòng kiểm tra lại thông tin bị lỗi màu đỏ!');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare body payloads (strip nested object structures if needed, send IDs instead)
      const payload = {
        name: editedGuitar.name,
        price: editedGuitar.price,
        quantity: editedGuitar.quantity,
        thumbnail: editedGuitar.thumbnail,
        description: editedGuitar.description,
        woodType: editedGuitar.woodType,
        color: editedGuitar.color,
        stringCount: editedGuitar.stringCount,
        status: editedGuitar.status || 'DRAFT',
        category: editedGuitar.category ? { id: editedGuitar.category.id } : null,
        brand: editedGuitar.brand ? { id: editedGuitar.brand.id } : null
      } as any;

      if (isNew) {
        const created = await adminService.addGuitar(payload);
        alert('Tạo sản phẩm mới thành công!');
        router.push(`/products/${created.id}`);
      } else {
        const updated = await adminService.updateGuitar(editedGuitar.id, payload);
        setGuitar(updated);
        setEditedGuitar({ ...updated });
        setEditMode(false);
        alert('Cập nhật sản phẩm thành công!');
      }
    } catch (err) {
      console.error(err);
      alert('Thao tác thất bại. Vui lòng kiểm tra lại kết nối backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploadClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrl = await adminService.uploadImage(files[0]);
      handleFieldChange('thumbnail', uploadedUrl);
    } catch (err) {
      alert('Tải ảnh lên thất bại!');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900 flex flex-col">
      <Navbar />

      {/* Admin Control Bar */}
      {isAdmin && (
        <div className="fixed top-20 left-0 right-0 bg-dark-950 border-b border-dark-700 py-3 px-6 z-40 flex flex-wrap justify-between items-center gap-4 shadow-xl backdrop-blur-md bg-opacity-90">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Thanh công cụ Quản trị:</span>
            <div className="flex items-center bg-dark-800 rounded-full p-1 border border-dark-600">
              <button
                onClick={() => setEditMode(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!editMode ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Chế độ Xem
              </button>
              <button
                onClick={() => setEditMode(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${editMode ? 'bg-gold-500 text-dark-900 shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Chế độ Sửa
              </button>
            </div>
            
            {editMode && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Trạng thái:</span>
                <select
                  value={editedGuitar.status || 'DRAFT'}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="DRAFT">Nháp (Draft)</option>
                  <option value="PUBLISHED">Công khai (Published)</option>
                </select>
              </div>
            )}

            {!editMode && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${editedGuitar.status === 'PUBLISHED' ? 'bg-green-500/20 border border-green-500/40 text-green-400' : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400'}`}>
                {editedGuitar.status === 'PUBLISHED' ? 'Đã Xuất Bản' : 'Nháp'}
              </span>
            )}
          </div>

          {editMode && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleEditMode}
                className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSave}
                className="bg-gold-500 hover:bg-gold-400 text-dark-900 px-5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                {isNew ? 'Tạo mới sản phẩm' : 'Lưu thay đổi'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`flex-grow pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full ${isAdmin ? 'pt-40' : 'pt-32'}`}>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gold-500 transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="hover:text-gold-500 transition-colors cursor-pointer">{editedGuitar.category?.name || 'Guitars'}</span>
          <span>/</span>
          <span className="text-gray-200 truncate max-w-xs">{editedGuitar.name}</span>
        </div>

        {/* Product Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Column 1: Image Showcase */}
          <div className="space-y-6">
            <div 
              onClick={handleImageUploadClick}
              className={`aspect-square bg-dark-800 rounded-3xl overflow-hidden border relative shadow-2xl group transition-all ${editMode ? 'border-dashed border-gold-500/60 cursor-pointer hover:border-gold-500' : 'border-dark-700'}`}
            >
              {uploading ? (
                <div className="absolute inset-0 bg-dark-900/80 flex flex-col items-center justify-center space-y-3 z-10">
                  <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400">Đang tải ảnh lên...</span>
                </div>
              ) : null}

              {editedGuitar.thumbnail ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${mainImage})` }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 px-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                  </svg>
                  <span className="text-sm">Chưa có hình ảnh đại diện</span>
                  {editMode && <span className="text-xs text-gold-500 mt-1">Nhấp để tải lên (800x800)</span>}
                </div>
              )}

              {editMode && editedGuitar.thumbnail && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-gold-500 mb-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Đổi hình ảnh</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 via-transparent to-transparent pointer-events-none" />
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Sub-images if any */}
            {!editMode && guitar.images && guitar.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {guitar.images.map((img) => (
                  <div key={img.id} className="aspect-square bg-dark-800 rounded-xl overflow-hidden border border-dark-700 cursor-pointer hover:border-gold-500/50 transition-all relative">
                    <img src={img.url} alt="sub-img" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Product details & purchasing */}
          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Category & Brand Selectors */}
              <div className="flex flex-wrap gap-3 items-center">
                {editMode ? (
                  <>
                    <div className="flex items-center space-x-1.5 bg-dark-800 border border-dark-700 px-3 py-1 rounded-full">
                      <span className="text-xs text-gray-400 font-bold uppercase">Hãng:</span>
                      <select
                        value={editedGuitar.brand?.id || ''}
                        onChange={(e) => {
                          const selected = brands.find(b => b.id === Number(e.target.value));
                          handleFieldChange('brand', selected || null);
                        }}
                        className="bg-transparent text-xs font-bold text-gold-500 focus:outline-none uppercase"
                      >
                        <option value="" className="bg-dark-800 text-white">Chọn thương hiệu</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id} className="bg-dark-800 text-white">{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-dark-800 border border-dark-700 px-3 py-1 rounded-full">
                      <span className="text-xs text-gray-400 font-bold uppercase">Dòng:</span>
                      <select
                        value={editedGuitar.category?.id || ''}
                        onChange={(e) => {
                          const selected = categories.find(c => c.id === Number(e.target.value));
                          handleFieldChange('category', selected || null);
                        }}
                        className="bg-transparent text-xs font-bold text-blue-400 focus:outline-none uppercase"
                      >
                        <option value="" className="bg-dark-800 text-white">Chọn danh mục</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id} className="bg-dark-800 text-white">{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="px-3 py-1 bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                      {editedGuitar.brand?.name || 'Đặc Quyền'}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                      {editedGuitar.category?.name || 'Guitar'}
                    </span>
                  </>
                )}
              </div>

              {/* Product Title */}
              <div>
                {editMode ? (
                  <div className={`relative ${shakeField.name ? 'animate-shake' : ''}`}>
                    <input
                      type="text"
                      value={editedGuitar.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      placeholder="Nhập tên sản phẩm..."
                      className={`w-full text-3xl sm:text-4xl font-extrabold text-white leading-tight bg-dark-800/50 hover:bg-dark-800 border focus:bg-dark-800 focus:outline-none rounded-xl px-4 py-2 transition-all ${errors.name ? 'border-red-500' : 'border-dashed border-gold-500/40 focus:border-gold-500'}`}
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500 absolute -bottom-5 left-1 font-semibold">Tên sản phẩm không được trống!</span>
                    )}
                  </div>
                ) : (
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                    {editedGuitar.name}
                  </h1>
                )}
              </div>

              {/* Rating Star / Inventory info */}
              <div className="flex items-center space-x-3 text-sm text-gray-400 pt-2">
                <div className="flex text-gold-500">
                  {"★★★★★".split("").map((star, idx) => (
                    <span key={idx}>{star}</span>
                  ))}
                </div>
                <span>|</span>
                <span>5.0 (42 Đánh giá)</span>
                <span>|</span>
                
                {editMode ? (
                  <div className={`flex items-center space-x-1.5 ${shakeField.quantity ? 'animate-shake' : ''}`}>
                    <span className="text-xs font-medium">Số lượng kho:</span>
                    <input
                      type="number"
                      value={editedGuitar.quantity}
                      onChange={(e) => handleFieldChange('quantity', Number(e.target.value))}
                      min="0"
                      className={`w-20 bg-dark-800 border rounded px-2 py-0.5 text-white font-bold text-xs focus:outline-none focus:border-gold-500 ${errors.quantity ? 'border-red-500' : 'border-dark-600'}`}
                    />
                  </div>
                ) : (
                  <span className={editedGuitar.quantity > 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                    {editedGuitar.quantity > 0 ? `Còn hàng (${editedGuitar.quantity})` : 'Hết hàng'}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="p-6 bg-dark-800/60 rounded-2xl border border-dark-700/80 shadow-md">
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block mb-1">Giá Độc Quyền</span>
                {editMode ? (
                  <div className={`flex items-center space-x-2 relative ${shakeField.price ? 'animate-shake' : ''}`}>
                    <input
                      type="number"
                      value={editedGuitar.price}
                      onChange={(e) => handleFieldChange('price', Number(e.target.value))}
                      min="0"
                      step="1000"
                      className={`text-2xl font-black text-gold-500 bg-dark-900 border focus:outline-none rounded-lg px-3 py-1.5 w-full ${errors.price ? 'border-red-500' : 'border-dark-600 focus:border-gold-500'}`}
                    />
                    <span className="font-extrabold text-gold-500">VNĐ</span>
                    {errors.price && (
                      <span className="text-xs text-red-500 absolute -bottom-5 left-1 font-semibold">Giá trị phải lớn hơn hoặc bằng 0!</span>
                    )}
                  </div>
                ) : (
                  <div className="text-3xl sm:text-4xl font-black text-gold-500 tracking-tight">
                    {formatVND(editedGuitar.price)}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Quantity Selector & Buying triggers */}
            {!editMode && (
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
            )}

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
                  {editMode ? (
                    <textarea
                      value={editedGuitar.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="Mô tả chi tiết sản phẩm..."
                      rows={5}
                      className="w-full bg-dark-850 hover:bg-dark-800 focus:bg-dark-800 border border-dashed border-gold-500/40 focus:border-gold-500 focus:outline-none rounded-xl p-4 text-white text-sm transition-all"
                    />
                  ) : editedGuitar.description ? (
                    <p className="whitespace-pre-line">{editedGuitar.description}</p>
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
                        <td className="py-3 text-white">
                          {editMode ? (
                            <select
                              value={editedGuitar.brand?.id || ''}
                              onChange={(e) => {
                                const selected = brands.find(b => b.id === Number(e.target.value));
                                handleFieldChange('brand', selected || null);
                              }}
                              className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-white focus:outline-none focus:border-gold-500 text-xs w-full max-w-[200px]"
                            >
                              <option value="">Không có</option>
                              {brands.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                              ))}
                            </select>
                          ) : (
                            editedGuitar.brand?.name || 'N/A'
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Danh Mục</td>
                        <td className="py-3 text-white">
                          {editMode ? (
                            <select
                              value={editedGuitar.category?.id || ''}
                              onChange={(e) => {
                                const selected = categories.find(c => c.id === Number(e.target.value));
                                handleFieldChange('category', selected || null);
                              }}
                              className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-white focus:outline-none focus:border-gold-500 text-xs w-full max-w-[200px]"
                            >
                              <option value="">Không có</option>
                              {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          ) : (
                            editedGuitar.category?.name || 'N/A'
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Loại Gỗ (Wood Type)</td>
                        <td className="py-3 text-white">
                          {editMode ? (
                            <input
                              type="text"
                              value={editedGuitar.woodType || ''}
                              onChange={(e) => handleFieldChange('woodType', e.target.value)}
                              placeholder="Nhập loại gỗ..."
                              className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-white text-xs w-full max-w-[200px] focus:outline-none focus:border-gold-500"
                            />
                          ) : (
                            editedGuitar.woodType || 'Gỗ cao cấp tuyển chọn'
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Màu Sắc</td>
                        <td className="py-3 text-white">
                          {editMode ? (
                            <input
                              type="text"
                              value={editedGuitar.color || ''}
                              onChange={(e) => handleFieldChange('color', e.target.value)}
                              placeholder="Nhập màu sắc..."
                              className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-white text-xs w-full max-w-[200px] focus:outline-none focus:border-gold-500"
                            />
                          ) : (
                            editedGuitar.color || 'Tự nhiên'
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-dark-800/40 transition-colors">
                        <td className="py-3 font-semibold text-gray-400">Số Dây Đàn</td>
                        <td className="py-3 text-white">
                          {editMode ? (
                            <input
                              type="number"
                              value={editedGuitar.stringCount || 6}
                              onChange={(e) => handleFieldChange('stringCount', Number(e.target.value))}
                              min="1"
                              className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-white text-xs w-full max-w-[200px] focus:outline-none focus:border-gold-500"
                            />
                          ) : (
                            (editedGuitar.stringCount || 6) + ' Dây'
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!editMode && <Footer />}
    </main>
  );
}
