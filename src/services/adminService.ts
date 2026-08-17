import { Guitar } from '@/types';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/api/guitars';

const getHeaders = () => {
  const token = authService.getToken();
  console.log('[adminService] Current JWT Token:', token ? `${token.substring(0, 15)}... (Độ dài: ${token.length})` : 'NULL (Không tìm thấy token)');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const adminService = {
  async getAllGuitars(page = 0, size = 100): Promise<Guitar[]> {
    const res = await fetch(`${API_URL}?page=${page}&size=${size}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch guitars');
    const data = await res.json();
    return data.content || [];
  },

  async getGuitarById(id: number): Promise<Guitar> {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch guitar');
    return res.json();
  },

  async addGuitar(guitar: Omit<Guitar, 'id'>): Promise<Guitar> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(guitar),
    });
    if (!res.ok) throw new Error('Failed to add guitar');
    return res.json();
  },

  async updateGuitar(id: number, guitar: Partial<Guitar>): Promise<Guitar> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(guitar),
    });
    if (!res.ok) throw new Error('Failed to update guitar');
    return res.json();
  },

  async deleteGuitar(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete guitar');
  },

  async getCategories(): Promise<any[]> {
    const res = await fetch('http://localhost:8080/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getBrands(): Promise<any[]> {
    const res = await fetch('http://localhost:8080/api/brands');
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const token = authService.getToken();
    const res = await fetch('http://localhost:8080/api/uploads', {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw new Error('Tải lên ảnh thất bại');
    const data = await res.json();
    return data.url;
  }
};
