import { DashboardLayout } from './DashboardLayout';
import { customerNav } from '../lib/nav';

export function CustomerLayout() {
  return <DashboardLayout links={customerNav} title="My Account" basePath="/account" />;
}
