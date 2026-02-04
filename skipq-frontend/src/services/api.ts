import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const api = {
  // Check Backend Health
  healthCheck: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/health`);
      return res.data;
    } catch (error) {
      console.error("Health check failed", error);
      return { status: "offline", ml_engine: "none" };
    }
  },

  // Customer: Create Cart & Get QR
  createCart: async (items: { name: string; price: number; quantity: number }[]) => {
    // Transform items to backend format if needed
    // Backend expects { items: [{name: "toothpaste"}] } or similar
    const payload = {
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        id: item.id
      }))
    };
    const res = await axios.post(`${API_BASE_URL}/create-cart`, payload);
    return res.data; // { receiptId, qrString }
  },

  // Guard: Detect Items from Image
  detectItems: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const res = await axios.post(`${API_BASE_URL}/detect`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data; // Array of detections
  },

  // Guard: Verify Cart
  verifyCart: async (receiptId: string, detectedItems: any[]) => {
    const payload = {
      receiptId,
      detectedItems
    };
    const res = await axios.post(`${API_BASE_URL}/verify`, payload);
    return res.data;
  }
};
