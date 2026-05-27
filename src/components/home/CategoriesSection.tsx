import React from 'react';

export default function CategoriesSection() {
  const categories = [
    { title: "Guitar Điện", img: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop" },
    { title: "Guitar Thùng", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop" },
    { title: "Bass", img: "https://images.unsplash.com/photo-1514649923863-ceaf75b770ab?q=80&w=1974&auto=format&fit=crop" }
  ];

  return (
    <section id="categories" className="py-24 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Danh Mục <span className="text-gold-500">Nổi Bật</span></h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.img})` }}
              />
              <div className="absolute inset-0 bg-dark-900/40 group-hover:bg-dark-900/20 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 w-full p-8">
                <h3 className="text-2xl font-bold text-white group-hover:text-gold-500 transition-colors">{cat.title}</h3>
                <div className="w-0 h-0.5 bg-gold-500 mt-2 transition-all duration-300 group-hover:w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
