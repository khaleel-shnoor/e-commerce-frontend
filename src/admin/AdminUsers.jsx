import { PageWrapper } from '../components/common/PageWrapper';
import { DataTable } from '../components/common/DataTable';
import { SearchBar } from '../components/common/SearchBar';
import { usePageLoading } from '../hooks/usePageLoading';
import { users } from '../data/users';
import { useState } from 'react';
import { StatusBadge } from '../components/ui/Badge';

export default function AdminUsers() {
  const loading = usePageLoading();
  const [query, setQuery] = useState('');
  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.includes(query),
  );

  return (
    <PageWrapper title="User Management" loading={loading}>
      <SearchBar value={query} onChange={setQuery} className="max-w-md mb-6" />
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ]}
        data={filtered}
        loading={loading}
        renderRow={(user) => (
          <>
            <td className="p-4 font-medium">{user.name}</td>
            <td className="p-4 text-muted-foreground">{user.email}</td>
            <td className="p-4 capitalize">{user.role}</td>
            <td className="p-4"><StatusBadge status={user.status} /></td>
          </>
        )}
      />
    </PageWrapper>
  );
}
