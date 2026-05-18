import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { Button } from '../components/ui/Button';

export default function PaymentSuccess() {
  return (
    <PageWrapper>
      <section className="text-center py-12">
        <CheckCircle className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-3xl font-heading tracking-wide mb-2">Payment Successful</h1>
        <p className="text-muted-foreground mb-8">Thank you for your order. You will receive a confirmation email shortly.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/account/orders"><Button>View Orders</Button></Link>
          <Link to="/shop"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </section>
    </PageWrapper>
  );
}
