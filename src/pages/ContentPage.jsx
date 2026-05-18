import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';

const content = {
  about: {
    title: 'About Us',
    body: `SHNOOR is a premium monochrome fashion destination built for the modern minimalist. 
    We curate timeless essentials with exceptional craftsmanship and refined silhouettes. 
    Our mission is to elevate everyday style through intentional design and sustainable practices.`,
  },
  contact: {
    title: 'Contact Us',
    body: 'Reach our team at hello@shnoor.com or visit our flagship at 350 Fifth Avenue, New York.',
  },
  faq: {
    title: 'FAQ',
    body: 'Shipping: 3-5 business days. Returns: 30 days. Payments: All major cards accepted.',
  },
  terms: {
    title: 'Terms & Conditions',
    body: 'By using SHNOOR, you agree to our terms of service, privacy practices, and purchase policies.',
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'We respect your privacy. Your data is encrypted and never sold to third parties.',
  },
};

export default function ContentPage({ type }) {
  const loading = usePageLoading();
  const page = content[type];

  return (
    <PageWrapper title={page.title} breadcrumbs={[{ label: page.title }]} loading={loading}>
      <article className="prose prose-neutral max-w-3xl">
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{page.body}</p>
      </article>
    </PageWrapper>
  );
}
