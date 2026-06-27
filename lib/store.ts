import { create } from 'zustand'
import { validateCoupon } from './db'

export interface CartItem {
  id: string; // product id + (subscription ? '-sub' : '-one')
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isSubscription: boolean;
}

interface CartStore {
  items: CartItem[];
  cartOpen: boolean;
  couponCode: string;
  discount: number;
  couponError: string;
  couponType: string;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCartOpen: (open: boolean) => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; discount: number; shipping: number; total: number };
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  cartOpen: false,
  couponCode: '',
  discount: 0,
  couponError: '',
  couponType: '',

  addItem: (newItem) => set((state) => {
    const id = `${newItem.productId}-${newItem.isSubscription ? 'sub' : 'one'}`;
    const existing = state.items.find(item => item.id === id);
    let newItems;
    if (existing) {
      newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
      );
    } else {
      newItems = [...state.items, { ...newItem, id }];
    }
    return { items: newItems, cartOpen: true }; // Automatically open cart when item is added
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),

  setCartOpen: (open) => set({ cartOpen: open }),

  applyCoupon: async (code) => {
    if (!code.trim()) {
      set({ couponError: 'Please enter a coupon code.', discount: 0, couponCode: '' });
      return;
    }
    const totals = get().getTotals();
    const result = await validateCoupon(code, totals.subtotal);
    if (result.valid) {
      set({
        couponCode: code.toUpperCase(),
        discount: result.discount || 0,
        couponType: result.type || '',
        couponError: ''
      });
    } else {
      set({
        couponError: result.message || 'Invalid coupon.',
        discount: 0,
        couponCode: '',
        couponType: ''
      });
    }
  },

  removeCoupon: () => set({ couponCode: '', discount: 0, couponError: '', couponType: '' }),

  clearCart: () => set({ items: [], couponCode: '', discount: 0, couponError: '', couponType: '' }),

  getTotals: () => {
    const items = get().items;
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Recalculate dynamic coupon discount based on subtotal if coupon is percentage
    let currentDiscount = get().discount;
    if (get().couponCode && get().couponType === 'pct') {
      // 10% coupon hardcoded recalculation just in case
      currentDiscount = subtotal * 0.10;
      if (currentDiscount > 100) currentDiscount = 100; // max cap
    }

    const shippingThreshold = 350;
    // Standard shipping is ₹40, free if subtotal is above ₹350 or if coupon is free_shipping
    const hasFreeShippingCoupon = get().couponType === 'free_shipping';
    const shipping = (subtotal === 0 || subtotal >= shippingThreshold || hasFreeShippingCoupon) ? 0 : 40;
    
    const total = Math.max(0, subtotal - currentDiscount + shipping);

    return {
      subtotal,
      discount: currentDiscount,
      shipping,
      total
    };
  }
}));
