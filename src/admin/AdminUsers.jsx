import { useCallback, useEffect, useState } from 'react';
import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/ui/Badge';
import { adminApi } from '../lib/api';
import { useToast } from '../context/ToastContext';

function displayName(user) {
  return user.full_name?.trim() || user.email;
}

function primaryRole(roles) {
  if (!roles?.length) return 'customer';
  if (roles.includes('admin')) return 'admin';
  if (roles.includes('seller')) return 'seller';
  return roles[0];
}

export default function AdminUsers() {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.listUsers({ search: query || undefined });
      setUsers(data.items || []);
    } catch (err) {
      addToast(err.message || 'Failed to load users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [query, addToast]);

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  return (
    <PageWrapper title="User Management" loading={loading}>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search by name, email, or phone"
        className="max-w-md mb-6"
      />
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
          { key: 'verified', label: 'Verified' },
        ]}
        data={users}
        loading={loading}
        emptyTitle="No users found"
        renderRow={(user) => (
          <>
            <td className="p-4 font-medium">{displayName(user)}</td>
            <td className="p-4 text-muted-foreground">{user.email}</td>
            <td className="p-4 capitalize">{primaryRole(user.roles)}</td>
            <td className="p-4">
              <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
            </td>
            <td className="p-4">
              <StatusBadge status={user.is_verified ? 'active' : 'pending'} />
            </td>
          </>
        )}
      />
    </PageWrapper>
  );
}
