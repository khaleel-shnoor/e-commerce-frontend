export const coupons = [
  { id: 'SAVE10', code: 'SAVE10', discount: 10, type: 'percent', minOrder: 50, expires: '2025-12-31', used: false },
  { id: 'WELCOME20', code: 'WELCOME20', discount: 20, type: 'percent', minOrder: 100, expires: '2025-08-31', used: true },
  { id: 'FLAT15', code: 'FLAT15', discount: 15, type: 'fixed', minOrder: 75, expires: '2025-06-30', used: false },
];

export const addresses = [
  {
    id: 'addr-1',
    label: 'Home',
    name: 'Alex Morgan',
    street: '742 Evergreen Terrace',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    name: 'Alex Morgan',
    street: '350 Fifth Avenue, Suite 4200',
    city: 'New York',
    state: 'NY',
    zip: '10118',
    country: 'USA',
    isDefault: false,
  },
];

export const notifications = [
  { id: 1, title: 'Order Shipped', message: 'Your order ORD-1005 has been shipped.', read: false, date: '2025-05-17' },
  { id: 2, title: 'Flash Sale', message: 'Up to 30% off selected items. Ends tonight.', read: false, date: '2025-05-16' },
  { id: 3, title: 'Review Reminder', message: 'Share your thoughts on NOIR Classic Tee.', read: true, date: '2025-05-14' },
];

export const supportTickets = [
  { id: 'TKT-001', subject: 'Delayed delivery', status: 'open', priority: 'high', user: 'Alex Morgan', date: '2025-05-16' },
  { id: 'TKT-002', subject: 'Refund request', status: 'in_progress', priority: 'medium', user: 'Jordan Lee', date: '2025-05-15' },
  { id: 'TKT-003', subject: 'Product inquiry', status: 'resolved', priority: 'low', user: 'Taylor Kim', date: '2025-05-12' },
];

export const cmsPages = [
  { id: 1, title: 'About Us', slug: 'about', status: 'published', updated: '2025-04-01' },
  { id: 2, title: 'Shipping Policy', slug: 'shipping', status: 'published', updated: '2025-03-15' },
  { id: 3, title: 'Returns', slug: 'returns', status: 'draft', updated: '2025-05-10' },
];

export const banners = [
  { id: 1, title: 'Summer Collection', position: 'hero', status: 'active', clicks: 4280 },
  { id: 2, title: 'Flash Sale Banner', position: 'sidebar', status: 'active', clicks: 1860 },
  { id: 3, title: 'New Arrivals', position: 'footer', status: 'inactive', clicks: 920 },
];
