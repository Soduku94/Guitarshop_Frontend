export const formatVND = (price: number | null | undefined) => {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Liên hệ';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
