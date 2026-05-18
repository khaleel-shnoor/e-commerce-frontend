import { DashboardLayout } from './DashboardLayout';
import { sellerNav } from '../lib/nav';

export function SellerLayout() {
  return <DashboardLayout links={sellerNav} title="Seller Panel" basePath="/seller" />;
}
