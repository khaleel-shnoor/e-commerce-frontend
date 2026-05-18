import { DashboardLayout } from './DashboardLayout';
import { adminNav } from '../lib/nav';

export function AdminLayout() {
  return <DashboardLayout links={adminNav} title="Admin Panel" basePath="/admin" />;
}
