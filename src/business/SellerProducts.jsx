import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { sellerProductsApi } from '../lib/api';
import { mapApiProduct } from '../lib/product-mapper';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { Info, Plus } from 'lucide-react';

export default function SellerProducts() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const pendingCount = products.filter((p) => p.status === 'pending').length;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await sellerProductsApi.list();
      setProducts((data.items || []).map(mapApiProduct));
    } catch (err) {
      addToast(err.message || 'Failed to load products', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageWrapper
      title="Products"
      loading={loading}
      actions={
        <Link to="/seller/products/add">
          <Button>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      }
    >
      {pendingCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-300/80 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 mb-4 text-sm text-amber-800 dark:text-amber-200">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            {pendingCount} product{pendingCount !== 1 ? 's are' : ' is'} awaiting admin review
            and will be published once approved.
          </span>
        </div>
      )}

      {products.length === 0 && !loading ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm mb-4">
            No products yet. Create your first listing for customers to see in the shop.
          </p>
          <Link to="/seller/products/add">
            <Button>Add Product</Button>
          </Link>
        </section>
      ) : (
        <DataTable
          columns={[
            { key: 'name', label: 'Product' },
            { key: 'price', label: 'Price' },
            { key: 'stock', label: 'Stock' },
            { key: 'status', label: 'Status' },
          ]}
          data={products}
          loading={loading}
          renderRow={(p) => (
            <>
              <td className="p-4">
                <Link
                  to={`/seller/products/edit/${p.id}`}
                  className="font-medium hover:underline"
                >
                  {p.name}
                </Link>
              </td>
              <td className="p-4">{formatCurrency(p.price)}</td>
              <td className="p-4">{p.stock}</td>
              <td className="p-4">
                <StatusBadge status={p.status} />
              </td>
            </>
          )}
        />
      )}
    </PageWrapper>
  );
}
