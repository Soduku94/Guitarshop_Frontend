import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=2070&auto=format&fit=crop')", filter: "brightness(0.4)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 via-transparent to-dark-900" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
        <span className="text-gold-500 font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-6 block">Tuyệt tác âm thanh</span>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
          Nơi Đam Mê <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-600">
            Chạm Lên Phím Đàn
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Khám phá bộ sưu tập nhạc cụ cao cấp từ các thương hiệu hàng đầu thế giới. 
          Mỗi cây đàn là một tác phẩm nghệ thuật, sẵn sàng cùng bạn thăng hoa.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#featured" className="px-8 py-4 bg-gold-500 hover:bg-gold-600 text-dark-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
            Khám phá ngay
          </a>
          <a href="#categories" className="px-8 py-4 bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500/10 font-bold rounded-lg transition-all duration-300 w-full sm:w-auto">
            Xem danh mục
          </a>
        </div>
      </div>
    </section>
  );
}
