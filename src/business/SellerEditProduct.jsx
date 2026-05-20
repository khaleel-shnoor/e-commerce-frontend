import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { categoriesApi, sellerProductsApi } from '../lib/api';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'archived', label: 'Archived' },
];

export default function SellerEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    Promise.all([sellerProductsApi.get(id), categoriesApi.list()])
      .then(([p, cats]) => {
        setProduct(p);
        setCategories(cats.items || []);
      })
      .catch((err) => addToast(err.message || 'Failed to load product', 'error'))
      .finally(() => setLoading(false));
  }, [id, addToast]);

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
    const formData = new FormData(form);

    if (!formData.get('category_id')) formData.delete('category_id');
    const compare = formData.get('compare_at_price');
    if (!compare) formData.delete('compare_at_price');

    const file = form.image?.files?.[0];
    if (!file) formData.delete('image');

    setSubmitting(true);
    try {
      await sellerProductsApi.update(id, formData);
      addToast('Product updated', 'success');
      navigate('/seller/products');
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!product && !loading) {
    return (
      <PageWrapper title="Edit Product">
        <p className="text-muted-foreground">Product not found.</p>
      </PageWrapper>
    );
  }

  const currentImage =
    preview ||
    product?.images?.find((i) => i.is_primary)?.url ||
    product?.images?.[0]?.url ||
    product?.primary_image_url ||
    null;

  return (
    <PageWrapper
      title="Edit Product"
      loading={loading}
      breadcrumbs={[{ label: 'Products', href: '/seller/products' }, { label: 'Edit' }]}
    >
      {product && (
        <form
          className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <Input label="Product Name" name="name" required defaultValue={product.name} />
          <Textarea
            label="Description"
            name="description"
            defaultValue={product.description || ''}
          />
          <Input label="SKU" name="sku" defaultValue={product.sku || ''} />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={product.price}
            />
            <Input
              label="Compare at price"
              name="compare_at_price"
              type="number"
              step="0.01"
              defaultValue={product.compare_at_price || ''}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock"
              name="quantity_available"
              type="number"
              min="0"
              defaultValue={product.quantity_available ?? 0}
            />
            <Select
              label="Status"
              name="status"
              options={statusOptions}
              defaultValue={product.status}
            />
          </div>
          <Select
            label="Category"
            name="category_id"
            options={[
              { value: '', label: 'No category' },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            defaultValue={product.category_id || ''}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Product image</label>
            {currentImage && (
              <img
                src={currentImage}
                alt={product.name}
                className="h-48 w-48 rounded-xl border border-border object-cover"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to keep the current image. New uploads replace the primary photo on Cloudinary.
            </p>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      )}
    </PageWrapper>
  );
}
