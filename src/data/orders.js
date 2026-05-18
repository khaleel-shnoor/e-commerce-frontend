import { products } from './products';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const orders = Array.from({ length: 12 }, (_, i) => {
  const product = products[i % products.length];
  const status = statuses[i % statuses.length];
  const qty = 1 + (i % 3);

  return {
    id: `ORD-${1000 + i}`,
    userId: 'user-1',
    status,
    date: new Date(2025, 4 - (i % 5), 10 + i).toISOString(),
    items: [
      {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: qty,
        size: 'M',
        color: 'Black',
      },
    ],
    subtotal: product.price * qty,
    shipping: 12,
    tax: Math.round(product.price * qty * 0.08),
    total: product.price * qty + 12 + Math.round(product.price * qty * 0.08),
    shippingAddress: {
      name: 'Alex Morgan',
      street: '742 Evergreen Terrace',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    trackingNumber: status === 'shipped' || status === 'delivered' ? `TRK${900000 + i}` : null,
  };
});

export function getOrderById(id) {
  return orders.find((o) => o.id === id);
}
