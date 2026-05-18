import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  return (
    <PageWrapper title="Add Product" breadcrumbs={[{ label: 'Products', href: '/seller/products' }, { label: 'Add' }]}>
      <form
        className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          addToast('Product created', 'success');
          navigate('/seller/products');
        }}
      >
        <Input label="Product Name" name="name" required />
        <Textarea label="Description" name="description" required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price" name="price" type="number" required />
          <Input label="Stock" name="stock" type="number" required />
        </div>
        <Select
          label="Category"
          name="category"
          options={[
            { value: 'apparel', label: 'Apparel' },
            { value: 'footwear', label: 'Footwear' },
          ]}
        />
        <Button type="submit">Create Product</Button>
      </form>
    </PageWrapper>
  );
}
