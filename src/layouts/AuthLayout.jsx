import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-between p-12 bg-primary text-primary-foreground">
        <Link to="/" className="text-3xl font-heading tracking-widest">
          SHNOOR
        </Link>
        <blockquote>
          <p className="text-4xl font-heading tracking-wide leading-tight mb-4">
            ELEVATE YOUR EVERYDAY
          </p>
          <p className="text-primary-foreground/70 text-sm max-w-md">
            Premium monochrome fashion for those who appreciate refined simplicity.
          </p>
        </blockquote>
        <p className="text-xs text-primary-foreground/50">&copy; SHNOOR</p>
      </aside>
      <main className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden text-2xl font-heading tracking-widest mb-8 block">
            SHNOOR
          </Link>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

