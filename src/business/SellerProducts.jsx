import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/ui/Button';
import { usePageLoading } from '../hooks/usePageLoading';
import { products } from '../data/products';
import { formatCurrency } from '../lib/utils';
import { Plus } from 'lucide-react';

export default function SellerProducts() {
  const loading = usePageLoading();
  const sellerProducts = products.filter((p) => p.sellerId === 'seller-1');

  return (
    <PageWrapper
      title="Products"
      loading={loading}
      actions={
        <Link to="/seller/products/add">
          <Button><Plus className="h-4 w-4" /> Add Product</Button>
        </Link>
      }
    >
      <DataTable
        columns={[
          { key: 'name', label: 'Product' },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Stock' },
          { key: 'status', label: 'Status' },
        ]}
        data={sellerProducts}
        loading={loading}
        renderRow={(p) => (
          <>
            <td className="p-4">
              <Link to={`/seller/products/edit/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
            </td>
            <td className="p-4">{formatCurrency(p.price)}</td>
            <td className="p-4">{p.stock}</td>
            <td className="p-4">{p.inStock ? 'In Stock' : 'Out of Stock'}</td>
          </>
        )}
      />
    </PageWrapper>
  );
}
