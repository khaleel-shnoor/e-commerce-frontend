import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar, MobileSidebarNav } from '../components/layout/Sidebar';

export function DashboardLayout({ links, title, basePath, wrapContent, navDisabled = false }) {
  const content = <Outlet />;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar links={links} title={title} basePath={basePath} disabled={navDisabled} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <MobileSidebarNav links={links} basePath={basePath} disabled={navDisabled} />
            {wrapContent ? wrapContent(content) : content}
          </div>
        </main>
      </div>
    </div>
  );
}
