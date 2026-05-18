import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'src');

const dashboardPageTemplate = (name, title, folder, extra = '') => `import { PageWrapper } from '../../components/common/PageWrapper';
import { usePageLoading } from '../../hooks/usePageLoading';
${extra}

export default function ${name}() {
  const loading = usePageLoading();

  return (
    <PageWrapper title="${title}" loading={loading}>
      <section className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground text-sm">
          ${title} content with dummy data. Connect to your API when ready.
        </p>
      </section>
    </PageWrapper>
  );
}
`;

const pages = {
  business: [
    ['SellerDashboard', 'Seller Dashboard', "import { StatsCard } from '../../components/common/StatsCard';\nimport { SimpleBarChart } from '../../components/charts/SimpleBarChart';\nimport { sellerStats, revenueChartData, topProducts } from '../../data/analytics';\nimport { formatCurrency } from '../../lib/utils';\nimport { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';"],
    ['SellerAnalytics', 'Analytics'],
    ['SellerOrders', 'Orders Management'],
    ['SellerProducts', 'Product Management'],
    ['SellerAddProduct', 'Add Product'],
    ['SellerEditProduct', 'Edit Product'],
    ['SellerInventory', 'Inventory'],
    ['SellerReviews', 'Reviews & Ratings'],
    ['SellerCoupons', 'Coupons'],
    ['SellerStore', 'Store Customization'],
    ['SellerWallet', 'Wallet & Earnings'],
    ['SellerTransactions', 'Transactions'],
    ['SellerShipping', 'Shipping Management'],
    ['SellerNotifications', 'Notifications'],
    ['SellerProfile', 'Seller Profile'],
    ['SellerSettings', 'Settings'],
  ],
  admin: [
    ['AdminDashboard', 'Admin Dashboard'],
    ['AdminUsers', 'User Management'],
    ['AdminSellers', 'Seller Management'],
    ['AdminProducts', 'Product Moderation'],
    ['AdminOrders', 'Orders Management'],
    ['AdminTransactions', 'Transactions'],
    ['AdminAnalytics', 'Analytics'],
    ['AdminReports', 'Reports'],
    ['AdminCategories', 'Categories Management'],
    ['AdminCoupons', 'Coupons Management'],
    ['AdminCms', 'CMS Management'],
    ['AdminBanners', 'Banner Management'],
    ['AdminNotifications', 'Notifications'],
    ['AdminSupport', 'Support Tickets'],
    ['AdminReviews', 'Reviews Moderation'],
    ['AdminSettings', 'Settings'],
  ],
  dashboard: [
    ['CustomerDashboard', 'Dashboard'],
    ['CustomerOrders', 'My Orders'],
    ['CustomerOrderDetails', 'Order Details'],
    ['CustomerWishlist', 'Wishlist'],
    ['CustomerCart', 'Cart'],
    ['CustomerCheckout', 'Checkout'],
    ['PaymentSuccess', 'Payment Success'],
    ['PaymentFailed', 'Payment Failed'],
    ['CustomerAddresses', 'Saved Addresses'],
    ['CustomerNotifications', 'Notifications'],
    ['CustomerCoupons', 'Coupons'],
    ['CustomerReviews', 'Reviews'],
    ['CustomerSettings', 'Settings'],
    ['CustomerProfile', 'Profile'],
  ],
};

for (const [folder, list] of Object.entries(pages)) {
  const dir = path.join(root, folder);
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, title, extraImport] of list) {
    const file = path.join(dir, `${name}.jsx`);
    if (fs.existsSync(file)) continue;
    const extra = extraImport ? `${extraImport}\n` : '';
    fs.writeFileSync(file, dashboardPageTemplate(name, title, folder, extra));
  }
}

console.log('Pages generated.');
