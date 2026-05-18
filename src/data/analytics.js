export const revenueChartData = [
  { month: 'Jan', revenue: 42000, orders: 312 },
  { month: 'Feb', revenue: 38000, orders: 280 },
  { month: 'Mar', revenue: 51000, orders: 398 },
  { month: 'Apr', revenue: 47000, orders: 356 },
  { month: 'May', revenue: 62000, orders: 445 },
  { month: 'Jun', revenue: 58000, orders: 412 },
];

export const adminStats = {
  totalRevenue: 458200,
  totalOrders: 2847,
  totalUsers: 12480,
  totalSellers: 186,
  growth: {
    revenue: 12.4,
    orders: 8.2,
    users: 15.6,
    sellers: 4.1,
  },
};

export const sellerStats = {
  revenue: 42800,
  orders: 186,
  products: 42,
  conversion: 3.8,
  growth: { revenue: 18.2, orders: 9.4 },
};

export const topProducts = [
  { id: 1, name: 'NOIR Classic Tee', sales: 428, revenue: 21400 },
  { id: 3, name: 'FORM Slim Trouser', sales: 312, revenue: 43680 },
  { id: 5, name: 'PURE Wool Coat', sales: 186, revenue: 74400 },
  { id: 7, name: 'LINEA Merino Knit', sales: 264, revenue: 31680 },
];

export const recentCustomers = [
  { id: 1, name: 'Alex Morgan', email: 'alex@example.com', spent: 1240, orders: 8 },
  { id: 2, name: 'Jordan Lee', email: 'jordan@example.com', spent: 890, orders: 5 },
  { id: 3, name: 'Taylor Kim', email: 'taylor@example.com', spent: 2100, orders: 12 },
  { id: 4, name: 'Casey Brooks', email: 'casey@example.com', spent: 560, orders: 3 },
];

export const activityFeed = [
  { id: 1, type: 'order', message: 'New order #ORD-1012 received', time: '2 min ago' },
  { id: 2, type: 'user', message: 'New seller application from LINEA Collective', time: '15 min ago' },
  { id: 3, type: 'review', message: 'Review pending moderation on Product #7', time: '1 hr ago' },
  { id: 4, type: 'payment', message: 'Payout processed for NOIR Studio', time: '2 hrs ago' },
  { id: 5, type: 'order', message: 'Order #ORD-1008 marked as delivered', time: '3 hrs ago' },
];

export const brandLogos = ['NOIR', 'ESSENCE', 'FORM', 'LINEA', 'MONO', 'PURE'];
