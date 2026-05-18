import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { Button } from '../components/ui/Button';

export default function PaymentFailed() {
  return (
    <PageWrapper>
      <section className="text-center py-12">
        <XCircle className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-3xl font-heading tracking-wide mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">Something went wrong. Please try again or use a different payment method.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/account/checkout"><Button>Try Again</Button></Link>
          <Link to="/account/cart"><Button variant="outline">Back to Cart</Button></Link>
        </div>
      </section>
    </PageWrapper>
  );
}
