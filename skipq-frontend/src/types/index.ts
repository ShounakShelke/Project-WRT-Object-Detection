export type UserRole = 'customer' | 'guard' | 'admin';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  barcode: string;
  image: string;
  aisle: string;
  shelf: string;
  weight?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Receipt {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  grandTotal: number;
  timestamp: Date;
  customerId: string;
  status: 'pending' | 'verified' | 'flagged';
  qrCode: string;
}

export interface VerificationItem extends CartItem {
  mlVerified: boolean;
  manuallyVerified: boolean;
  confidence?: number;
}

export interface VerificationSession {
  receiptId: string;
  receipt: Receipt;
  items: VerificationItem[];
  videoUploaded: boolean;
  mlProcessed: boolean;
  status: 'pending' | 'processing' | 'ready' | 'approved' | 'flagged';
  guardId: string;
  timestamp: Date;
}

export interface Guard {
  id: string;
  name: string;
  shift: string;
  verificationsToday: number;
}

export interface DashboardStats {
  dailyCheckouts: number;
  mlAccuracy: number;
  flaggedUsers: number;
  avgVerificationTime: string;
  totalRevenue: number;
  manualVerifications: number;
  autoVerifications: number;
}

export interface ActivityLog {
  id: string;
  guardName: string;
  action: string;
  receiptId: string;
  timestamp: Date;
  status: 'approved' | 'flagged' | 'manual';
}
