export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  availableQuantity: number;
  modelPath: string;
  position: [number, number, number];
}

export interface Purchase {
  id: string;
  productId: string;
  serialNumber: number;
  customerEmail: string;
  stripeSessionId: string;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'shipped';
}