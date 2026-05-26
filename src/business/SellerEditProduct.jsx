import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import { categoriesApi, sellerProductsApi } from '../lib/api';

// Sellers cannot self-approve. Only draft/pending/inactive are writable.
// If the product is currently active (admin-approved), the seller sees a read-only
// status badge and cannot demote it below inactive via this form.
const SELLER_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft (hidden)' },
  { value: 'pending', label: 'Submit for Review' },
  { value: 'inactive', label: 'Inactive (paused)' },
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
            {product.status === 'active' ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Status</p>
                <div className="flex items-center gap-2 h-9">
                  <StatusBadge status="active" />
                  <span className="text-xs text-muted-foreground">(admin-approved)</span>
                </div>
                <input type="hidden" name="status" value="active" />
              </div>
            ) : (
              <Select
                label="Status"
                name="status"
                options={SELLER_STATUS_OPTIONS}
                defaultValue={
                  SELLER_STATUS_OPTIONS.some((o) => o.value === product.status)
                    ? product.status
                    : 'draft'
                }
              />
            )}
          </div>
          {product.status === 'pending' && (
            <p className="text-xs text-amber-700 dark:text-amber-300 rounded-lg border border-amber-300/80 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-2">
              This product is awaiting admin review. Saving changes will not affect its pending
              status unless you change it to Draft.
            </p>
          )}
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
