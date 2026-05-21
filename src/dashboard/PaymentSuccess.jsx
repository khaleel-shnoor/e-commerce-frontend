import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { Button } from '../components/ui/Button';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <PageWrapper>
      <section className="text-center py-12 max-w-md mx-auto">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h1 className="text-3xl font-heading tracking-wide mb-2">Order Placed!</h1>
        {orderNumber && (
          <p className="font-mono text-sm bg-secondary px-4 py-2 rounded-lg inline-block mb-4">
            {orderNumber}
          </p>
        )}
        <p className="text-muted-foreground mb-8">
          Your order has been placed successfully and will be delivered within 5–7 business days.
          You can track its status in your orders page.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/account/orders"><Button>View Orders</Button></Link>
          <Link to="/shop"><Button variant="outline">Continue Shopping</Button></Link>
        </div>
      </section>
    </PageWrapper>
  );
}
