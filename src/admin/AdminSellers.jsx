import { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
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
  const [updatingId, setUpdatingId] = useState(null);

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

  const setStatus = async (sellerId, status) => {
    setUpdatingId(sellerId);
    try {
      const updated = await adminApi.updateSellerStatus(sellerId, status);
      setSellers((prev) =>
        prev.map((s) => (s.id === sellerId ? { ...s, ...updated } : s)),
      );
      addToast(`Seller marked as ${status}`, 'success');
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

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
            No seller profiles yet. They appear when a user registers as a seller.
          </p>
        </section>
      ) : (
        <DataTable
          columns={[
            { key: 'store', label: 'Store' },
            { key: 'owner', label: 'Owner' },
            { key: 'email', label: 'Email' },
            { key: 'verified', label: 'Email' },
            { key: 'status', label: 'Seller status' },
            { key: 'actions', label: 'Actions' },
          ]}
          data={sellers}
          loading={loading}
          emptyTitle="No sellers found"
          renderRow={(seller) => {
            const busy = updatingId === seller.id;
            return (
              <>
                <td className="p-4 font-medium">{seller.store_name}</td>
                <td className="p-4">{displayName(seller)}</td>
                <td className="p-4 text-muted-foreground">{seller.email}</td>
                <td className="p-4">
                  <StatusBadge status={seller.user_is_verified ? 'verified' : 'pending'} />
                </td>
                <td className="p-4">
                  <StatusBadge status={seller.status} />
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {seller.status !== 'approved' && (
                      <Button
                        size="sm"
                        disabled={busy || !seller.user_is_verified}
                        onClick={() => setStatus(seller.id, 'approved')}
                        title={
                          seller.user_is_verified
                            ? 'Activate seller'
                            : 'User must verify email first'
                        }
                      >
                        Approve
                      </Button>
                    )}
                    {seller.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => setStatus(seller.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    )}
                    {seller.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => setStatus(seller.id, 'suspended')}
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                </td>
              </>
            );
          }}
        />
      )}
    </PageWrapper>
  );
}
