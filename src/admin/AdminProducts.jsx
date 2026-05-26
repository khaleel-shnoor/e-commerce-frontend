import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { adminApi } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { useToast } from '../context/ToastContext';

const TABS = [
  { label: 'Pending Review', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'All Products', value: '' },
];

export default function AdminProducts() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.listProducts({
        status: activeTab || undefined,
        search: query || undefined,
      });
      setProducts(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      addToast(err.message || 'Failed to load products', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, query, addToast]);

  useEffect(() => {
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  const setStatus = async (productId, status) => {
    setUpdatingId(productId);
    try {
      const updated = await adminApi.updateProductStatus(productId, status);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, ...updated } : p)),
      );
      addToast(
        status === 'active'
          ? 'Product approved and published'
          : `Product set to ${status}`,
        'success',
      );
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <PageWrapper title="Product Moderation" loading={loading}>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setQuery('');
            }}
            className={[
              'px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors',
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search product name or SKU"
        className="max-w-md mb-6"
      />

      {!loading && products.length === 0 ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm">
            {activeTab === 'pending'
              ? 'No products are currently awaiting review.'
              : 'No products found.'}
          </p>
        </section>
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-3">{total} product{total !== 1 ? 's' : ''}</p>
          <DataTable
            columns={[
              { key: 'product', label: 'Product' },
              { key: 'store', label: 'Store' },
              { key: 'price', label: 'Price' },
              { key: 'stock', label: 'Stock' },
              { key: 'status', label: 'Status' },
              { key: 'actions', label: 'Actions', className: 'text-right' },
            ]}
            data={products}
            loading={loading}
            renderRow={(p) => {
              const busy = updatingId === p.id;
              return (
                <>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.primary_image_url ? (
                        <img
                          src={p.primary_image_url}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-border flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0" />
                      )}
                      <div>
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="font-medium text-sm leading-tight hover:text-primary transition-colors"
                        >
                          {p.name}
                        </Link>
                        {p.category_name && (
                          <p className="text-xs text-muted-foreground">{p.category_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium">{p.store_name}</p>
                  </td>
                  <td className="p-4 text-sm">{formatCurrency(p.price)}</td>
                  <td className="p-4 text-sm">
                    {p.quantity_available != null ? p.quantity_available : '—'}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link to={`/admin/products/${p.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                      {p.status !== 'active' && (
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => setStatus(p.id, 'active')}
                        >
                          Approve
                        </Button>
                      )}
                      {p.status !== 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => setStatus(p.id, 'draft')}
                        >
                          Reject
                        </Button>
                      )}
                      {p.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => setStatus(p.id, 'inactive')}
                        >
                          Unpublish
                        </Button>
                      )}
                    </div>
                  </td>
                </>
              );
            }}
          />
        </>
      )}
    </PageWrapper>
  );
}
