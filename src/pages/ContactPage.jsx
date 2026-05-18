import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { usePageLoading } from '../hooks/usePageLoading';

export default function ContactPage() {
  const { addToast } = useToast();
  const loading = usePageLoading();

  return (
    <PageWrapper title="Contact Us" subtitle="Get in touch" breadcrumbs={[{ label: 'Contact' }]} loading={loading}>
      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">
        <div>
          <p className="text-muted-foreground mb-6">
            Have a question? We would love to hear from you. Send us a message and we will respond within 24 hours.
          </p>
          <address className="not-italic space-y-2 text-sm">
            <p>hello@shnoor.com</p>
            <p>+1 (555) 123-4567</p>
            <p>350 Fifth Avenue, New York, NY 10118</p>
          </address>
        </div>
        <form
          className="space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            addToast('Message sent successfully', 'success');
          }}
        >
          <Input label="Name" name="name" required placeholder="Your name" />
          <Input label="Email" name="email" type="email" required placeholder="your@email.com" />
          <Textarea label="Message" name="message" required placeholder="How can we help?" />
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </div>
    </PageWrapper>
  );
}
