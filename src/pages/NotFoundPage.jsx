import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-heading tracking-wide mb-4">404</p>
      <h1 className="text-2xl font-heading tracking-wide mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </section>
  );
}
