import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { categoriesApi, sellerProductsApi } from '../lib/api';

const statusOptions = [
  { value: 'draft', label: 'Draft (hidden)' },
  { value: 'active', label: 'Active (visible to customers)' },
];

export default function SellerAddProduct() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    categoriesApi
      .list()
      .then((data) => setCategories(data.items || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.image?.files?.[0];
    if (!file) {
      addToast('Please upload a product image', 'error');
      return;
    }

    const formData = new FormData(form);
    if (!formData.get('category_id')) formData.delete('category_id');
    const compare = formData.get('compare_at_price');
    if (!compare) formData.delete('compare_at_price');

    setSubmitting(true);
    try {
      await sellerProductsApi.create(formData);
      addToast('Product created', 'success');
      navigate('/seller/products');
    } catch (err) {
      addToast(err.message || 'Failed to create product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper
      title="Add Product"
      breadcrumbs={[{ label: 'Products', href: '/seller/products' }, { label: 'Add' }]}
    >
      <form
        className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <Input label="Product Name" name="name" required placeholder="Classic Oxford Shirt" />
        <Textarea label="Description" name="description" placeholder="Product details for customers" />
        <Input label="SKU" name="sku" placeholder="SHIRT-001" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price" name="price" type="number" step="0.01" min="0.01" required />
          <Input
            label="Compare at price"
            name="compare_at_price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Original price (optional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Stock quantity"
            name="quantity_available"
            type="number"
            min="0"
            defaultValue="0"
            required
          />
          <Select label="Status" name="status" options={statusOptions} defaultValue="draft" />
        </div>
        <Select
          label="Category"
          name="category_id"
          options={[
            { value: '', label: 'No category' },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Product image</label>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            onChange={handleImageChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
          />
          <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, or GIF — max 10 MB. Stored on Cloudinary.</p>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-48 w-48 rounded-xl border border-border object-cover"
            />
          )}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Uploading…' : 'Create Product'}
        </Button>
      </form>
    </PageWrapper>
  );
}
