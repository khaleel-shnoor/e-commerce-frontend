import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar, MobileSidebarNav } from '../components/layout/Sidebar';

export function DashboardLayout({ links, title, basePath }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={links} title={title} basePath={basePath} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <MobileSidebarNav links={links} basePath={basePath} />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
