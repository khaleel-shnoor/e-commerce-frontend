import { Link } from 'react-router-dom';

const footerLinks = {
  Shop: [
    { to: '/shop', label: 'All Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/shop?filter=new', label: 'New Arrivals' },
    { to: '/shop?filter=sale', label: 'Sale' },
  ],
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
  ],
  Legal: [
    { to: '/terms', label: 'Terms' },
    { to: '/privacy', label: 'Privacy' },
  ],
  Account: [
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
    { to: '/account', label: 'Dashboard' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-heading tracking-widest">
              SHNOOR
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Premium monochrome fashion for the modern minimalist. Timeless design, exceptional quality.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading text-sm tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SHNOOR. All rights reserved.</p>
          <p>Designed with precision. Built for scale.</p>
        </div>
      </div>
    </footer>
  );
}


