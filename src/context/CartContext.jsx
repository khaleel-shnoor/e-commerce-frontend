import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { wishlistApi } from '../lib/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();

  // ── Cart (local state — persisted to localStorage) ────────────────────────
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, options = {}) => {
    const { quantity = 1 } = options;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          image: product.primary_image_url || product.image || null,
          price: product.price,
          slug: product.slug,
          quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart_items');
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
    [items],
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  // ── Wishlist (backend-synced when authenticated, local otherwise) ─────────
  // wishlistItems: array of WishlistItemResponse objects from API
  // wishlistIds: Set<string> of product UUIDs for fast lookup
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const loadedUserRef = useRef(null);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    setWishlistLoading(true);
    try {
      const data = await wishlistApi.get();
      setWishlistItems(data.items || []);
    } catch {
      setWishlistItems([]);
    } finally {
      setWishlistLoading(false);
    }
  }, [user]);

  // Load wishlist when user changes
  useEffect(() => {
    if (user?.id !== loadedUserRef.current) {
      loadedUserRef.current = user?.id ?? null;
      refreshWishlist();
    }
  }, [user, refreshWishlist]);

  const wishlistIds = useMemo(
    () => new Set(wishlistItems.map((wi) => wi.product_id)),
    [wishlistItems],
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user) return;
      // Optimistic update
      const wasIn = wishlistIds.has(productId);
      if (wasIn) {
        setWishlistItems((prev) => prev.filter((wi) => wi.product_id !== productId));
      } else {
        setWishlistItems((prev) => [
          ...prev,
          {
            product_id: productId,
            id: productId,
            product_name: '',
            product_price: 0,
            product_image_url: null,
            product_slug: '',
            added_at: new Date().toISOString(),
          },
        ]);
      }
      try {
        await wishlistApi.toggle(productId);
        // Refresh to get accurate server state
        await refreshWishlist();
      } catch {
        // Revert on failure
        await refreshWishlist();
      }
    },
    [user, wishlistIds, refreshWishlist],
  );

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

  // wishlistProducts: full product objects from the API wishlist response
  const wishlistProducts = useMemo(
    () =>
      wishlistItems.map((wi) => ({
        id: wi.product_id,
        name: wi.product_name,
        price: wi.product_price,
        primary_image_url: wi.product_image_url,
        image: wi.product_image_url,
        slug: wi.product_slug,
      })),
    [wishlistItems],
  );

  const value = {
    items,
    itemCount,
    subtotal,
    wishlist: Array.from(wishlistIds),
    wishlistItems,
    wishlistProducts,
    wishlistLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    refreshWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
