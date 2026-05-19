import { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';

function displayName(seller) {
  return seller.full_name?.trim() || seller.email;
}

export default function AdminSellers() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSellers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.listSellers({ search: query || undefined });
      setSellers(data.items || []);
    } catch (err) {
      addToast(err.message || 'Failed to load sellers', 'error');
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }, [query, addToast]);

  useEffect(() => {
    const timer = setTimeout(loadSellers, 300);
    return () => clearTimeout(timer);
  }, [loadSellers]);

  return (
    <PageWrapper title="Seller Management" loading={loading}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search store, name, or email"
        className="max-w-md mb-6"
      />
      {sellers.length === 0 && !loading ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <p className="text-muted-foreground text-sm">
            No seller profiles in the database yet. Sellers appear here when a user registers
            with the seller role or a seller profile is created.
          </p>
        </section>
      ) : (
        <DataTable
          columns={[
            { key: 'store', label: 'Store' },
            { key: 'owner', label: 'Owner' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Seller status' },
            { key: 'account', label: 'Account' },
          ]}
          data={sellers}
          loading={loading}
          emptyTitle="No sellers found"
          renderRow={(seller) => (
            <>
              <td className="p-4 font-medium">{seller.store_name}</td>
              <td className="p-4">{displayName(seller)}</td>
              <td className="p-4 text-muted-foreground">{seller.email}</td>
              <td className="p-4">
                <StatusBadge status={seller.status} />
              </td>
              <td className="p-4">
                <StatusBadge status={seller.user_is_active ? 'active' : 'inactive'} />
              </td>
            </>
          )}
        />
      )}
    </PageWrapper>
  );
}
