// src/app/page.tsx

// 1. Định nghĩa cấu trúc dữ liệu giống y hệt Entity bên Spring Boot
interface Guitar {
  id: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

// 2. Hàm gọi API từ Backend (Chạy trên Server để tối ưu SEO)
async function fetchGuitars() {
  // Gọi API lấy trang đầu tiên, 10 sản phẩm. 'no-store' giúp data luôn mới nhất.
  const res = await fetch('http://localhost:8080/api/guitars?page=0&size=10', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Lấy dữ liệu thất bại');
  }

  return res.json();
}

// Hàm format tiền tệ VNĐ cho đẹp mắt
const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// 3. Component Giao diện chính
export default async function Home() {
  // Lấy dữ liệu từ Backend
  const data = await fetchGuitars();
  // Vì backend trả về đối tượng Page, danh sách đàn nằm trong mảng 'content'
  const guitars: Guitar[] = data.content;

  return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Tiêu đề Shop */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">🎸 Anh Dũng Guitar Shop</h1>
            <p className="text-gray-600 text-lg">Khám phá những giai điệu tuyệt vời nhất</p>
          </header>

          {/* Lưới sản phẩm (Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-6">
            {guitars.length === 0 ? (
                <p className="text-center col-span-3 text-gray-500">Chưa có cây đàn nào trong kho.</p>
            ) : (
                guitars.map((guitar) => (
                    <div key={guitar.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
                      {/* Khung ảnh giả lập */}
                      <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                        <span className="text-6xl">🎸</span>
                        <span className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                    {guitar.brand}
                  </span>
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">{guitar.name}</h2>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-2xl font-extrabold text-orange-600">{formatVND(guitar.price)}</p>
                          <p className="text-sm text-gray-500">Kho: {guitar.quantity}</p>
                        </div>

                        {/* Nút bấm */}
                        <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex justify-center items-center gap-2">
                          🛒 Thêm vào giỏ hàng
                        </button>
                      </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </main>
  );
}