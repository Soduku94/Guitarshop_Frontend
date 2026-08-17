import { Guitar } from '@/types';
import { authService } from './authService';

const getHeaders = () => {
  const token = authService.getToken();
  return {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Fallback data in case backend is not running
const fallbackGuitars: Guitar[] = [
  { id: 1, name: "Fender Stratocaster American Professional II", brand: { id: 1, name: "Fender" }, price: 45000000, quantity: 5, thumbnail: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Gibson Les Paul Standard '50s", brand: { id: 2, name: "Gibson" }, price: 68000000, quantity: 2, thumbnail: "https://images.unsplash.com/photo-1550291652-6cb90046361f?q=80&w=1964&auto=format&fit=crop" },
  { id: 3, name: "Martin D-28 Acoustic", brand: { id: 3, name: "Martin" }, price: 75000000, quantity: 3, thumbnail: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Taylor 814ce Builder's Edition", brand: { id: 4, name: "Taylor" }, price: 82000000, quantity: 1, thumbnail: "https://images.unsplash.com/photo-1550985616-10810253b84d?q=80&w=1924&auto=format&fit=crop" },
];

export async function fetchGuitars(): Promise<Guitar[]> {
  try {
    const res = await fetch('http://localhost:8080/api/guitars?page=0&size=4', {
      cache: 'no-store',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.content || fallbackGuitars;
  } catch (error) {
    console.log("Using fallback data because backend is unavailable.");
    return fallbackGuitars;
  }
}

export async function fetchGuitarById(id: number): Promise<Guitar> {
  try {
    const res = await fetch(`http://localhost:8080/api/guitars/${id}`, {
      cache: 'no-store',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (error) {
    console.log(`Using fallback for guitar ${id} because backend is unavailable.`);
    const fallback = fallbackGuitars.find(g => g.id === id) || fallbackGuitars[0];
    return fallback;
  }
}
