export interface CartItem {
  id: string;
  slug: string;
  title: string;
  modelName: string;
  price: string;
  salePrice?: string;
  onSale?: boolean;
  image?: {
    url: string;
    imgix_url: string;
  };
  quantity: number;
  selectedSize?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Get cart from localStorage
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], totalItems: 0, totalPrice: 0 };
  }

  try {
    const cartData = localStorage.getItem('trek-cart');
    if (cartData) {
      const cart = JSON.parse(cartData) as Cart;
      return cart;
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }

  return { items: [], totalItems: 0, totalPrice: 0 };
}

// Save cart to localStorage
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('trek-cart', JSON.stringify(cart));
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

// Calculate cart totals
export function calculateCartTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.onSale && item.salePrice ? 
      parseFloat(item.salePrice.replace(/[$,]/g, '')) : 
      parseFloat(item.price.replace(/[$,]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  return { totalItems, totalPrice };
}

// Add item to cart
export function addToCart(item: Omit<CartItem, 'quantity'>, size?: string): Cart {
  const cart = getCart();
  const existingItemIndex = cart.items.findIndex(
    cartItem => cartItem.id === item.id && cartItem.selectedSize === size
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    const existingItem = cart.items[existingItemIndex];
    if (existingItem) {
      existingItem.quantity += 1;
    }
  } else {
    // Add new item
    const newItem: CartItem = {
      ...item,
      quantity: 1,
      selectedSize: size,
    };
    cart.items.push(newItem);
  }

  // Recalculate totals
  const totals = calculateCartTotals(cart.items);
  cart.totalItems = totals.totalItems;
  cart.totalPrice = totals.totalPrice;

  saveCart(cart);
  return cart;
}

// Remove item from cart
export function removeFromCart(itemId: string, size?: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(
    item => !(item.id === itemId && item.selectedSize === size)
  );

  // Recalculate totals
  const totals = calculateCartTotals(cart.items);
  cart.totalItems = totals.totalItems;
  cart.totalPrice = totals.totalPrice;

  saveCart(cart);
  return cart;
}

// Update item quantity
export function updateCartItemQuantity(itemId: string, quantity: number, size?: string): Cart {
  const cart = getCart();
  const itemIndex = cart.items.findIndex(
    item => item.id === itemId && item.selectedSize === size
  );

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      if (item) {
        item.quantity = quantity;
      }
    }

    // Recalculate totals
    const totals = calculateCartTotals(cart.items);
    cart.totalItems = totals.totalItems;
    cart.totalPrice = totals.totalPrice;

    saveCart(cart);
  }

  return cart;
}

// Clear cart
export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], totalItems: 0, totalPrice: 0 };
  saveCart(emptyCart);
  return emptyCart;
}

// Format price for display
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}