import { DashboardLayout } from './DashboardLayout';
import { SellerVerificationGate } from '../components/seller/SellerVerificationGate';
import { useAuth } from '../context/AuthContext';
import { sellerNav } from '../lib/nav';

export function SellerLayout() {
  const { sellerIsActive } = useAuth();

  return (
    <DashboardLayout
      links={sellerNav}
      title="Seller Panel"
      basePath="/seller"
      navDisabled={!sellerIsActive}
      wrapContent={(content) => <SellerVerificationGate>{content}</SellerVerificationGate>}
    />
  );
}
