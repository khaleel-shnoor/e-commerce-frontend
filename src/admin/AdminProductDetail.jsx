import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageWrapper } from '../components/common/PageWrapper';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePageLoading } from '../hooks/usePageLoading';
import { useToast } from '../context/ToastContext';
import { adminApi } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import { ArrowLeft, Box, Package, Store, Tag, Calendar, Hash } from 'lucide-react';

function InfoRow({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="text-muted-foreground w-32 shrink-0">{label}</span>
      <span className="font-medium break-all">{value}</span>
    </div>
  );
}

function SectionCard({ title, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-border bg-card p-6 space-y-4 ${className}`}>
      {title && (
        <h3 className="font-heading tracking-wide text-sm font-semibold text-foreground/80 uppercase">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

export default function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pageLoading = usePageLoading();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    adminApi.getProduct(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          const primary = data.images?.find((i) => i.is_primary) ?? data.images?.[0] ?? null;
          setActiveImage(primary?.url ?? null);
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Product not found'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const setStatus = async (status) => {
    if (!product) return;
    setUpdatingStatus(true);
    try {
      const updated = await adminApi.updateProductStatus(id, status);
      setProduct((prev) => ({ ...prev, status: updated.status }));
      addToast(
        status === 'active' ? 'Product approved and published' : `Product set to ${status}`,
        'success',
      );
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const isLoading = pageLoading || loading;

  if (!isLoading && (error || !product)) {
    return (
      <PageWrapper title="Product Not Found">
        <p className="text-muted-foreground mb-4">{error || 'This product does not exist.'}</p>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          Back to Products
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={product?.name || 'Product Detail'}
      breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: product?.name }]}
      loading={isLoading}
    >
      {product && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left: product content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            {product.images?.length > 0 && (
              <SectionCard>
                <div className="space-y-3">
                  {/* Main image */}
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-muted-foreground/40" />
                    )}
                  </div>
                  {/* Thumbnail strip */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {product.images.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImage(img.url)}
                          className={[
                            'h-16 w-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors',
                            activeImage === img.url
                              ? 'border-primary'
                              : 'border-border hover:border-primary/50',
                          ].join(' ')}
                        >
                          <img
                            src={img.url}
                            alt={img.alt_text || product.name}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Product details */}
            <SectionCard title="Product Details">
              <div className="space-y-3">
                <InfoRow label="Name" value={product.name} />
                <InfoRow label="Slug" value={product.slug} />
                <InfoRow label="SKU" value={product.sku} />
                <InfoRow label="Category" value={product.category_name} />
                <InfoRow label="Brand" value={product.brand_name} />
                <InfoRow label="Price" value={formatCurrency(product.price)} />
                {product.compare_at_price && (
                  <InfoRow
                    label="Compare at"
                    value={formatCurrency(product.compare_at_price)}
                  />
                )}
                <InfoRow
                  label="Stock"
                  value={
                    product.quantity_available != null
                      ? `${product.quantity_available} units`
                      : 'Not tracked'
                  }
                />
                <InfoRow label="Listed on" value={formatDate(product.created_at)} />
                <InfoRow label="Last updated" value={formatDate(product.updated_at)} />
              </div>

              {product.description && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </SectionCard>

            {/* Seller's other products */}
            <SectionCard title={`Other products by ${product.seller.store_name}`}>
              {product.seller_products.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This seller has no other products.
                </p>
              ) : (
                <div className="space-y-2">
                  {product.seller_products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/admin/products/${p.id}`}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors group"
                    >
                      {p.primary_image_url ? (
                        <img
                          src={p.primary_image_url}
                          alt={p.name}
                          className="h-10 w-10 rounded-md object-cover border border-border flex-shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex-shrink-0 flex items-center justify-center">
                          <Box className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(p.price)}
                          {p.quantity_available != null && ` · ${p.quantity_available} in stock`}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </Link>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-4">
            {/* Status & actions */}
            <SectionCard title="Moderation">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusBadge status={product.status} />
              </div>
              <div className="space-y-2 pt-2">
                {product.status !== 'active' && (
                  <Button
                    className="w-full"
                    disabled={updatingStatus}
                    onClick={() => setStatus('active')}
                  >
                    Approve & Publish
                  </Button>
                )}
                {product.status !== 'draft' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled={updatingStatus}
                    onClick={() => setStatus('draft')}
                  >
                    Reject (return to draft)
                  </Button>
                )}
                {product.status === 'active' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled={updatingStatus}
                    onClick={() => setStatus('inactive')}
                  >
                    Unpublish
                  </Button>
                )}
                {product.status === 'draft' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled={updatingStatus}
                    onClick={() => setStatus('pending')}
                  >
                    Move to Pending
                  </Button>
                )}
              </div>
            </SectionCard>

            {/* Seller info */}
            <SectionCard title="Seller">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{product.seller.store_name}</p>
                    <p className="text-xs text-muted-foreground">@{product.seller.store_slug}</p>
                  </div>
                </div>

                <div className="pt-1 border-t border-border space-y-2">
                  <InfoRow label="Owner" value={product.seller.full_name || '—'} />
                  <InfoRow label="Email" value={product.seller.email} />
                  <InfoRow label="Joined" value={formatDate(product.seller.joined_at)} />
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground w-32 shrink-0">Account</span>
                    <StatusBadge status={product.seller.status} />
                  </div>
                </div>

                {product.seller.description && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                      Store bio
                    </p>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      {product.seller.description}
                    </p>
                  </div>
                )}

                <Link to={`/admin/sellers`}>
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    View in Sellers
                  </Button>
                </Link>
              </div>
            </SectionCard>

            {/* Quick stats for this seller */}
            <SectionCard title="Seller Portfolio">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/60 p-3 text-center">
                  <p className="text-xl font-bold">{product.seller_products.length + 1}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Products</p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3 text-center">
                  <p className="text-xl font-bold">
                    {product.seller_products.filter((p) => p.status === 'active').length +
                      (product.status === 'active' ? 1 : 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Live Products</p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3 text-center">
                  <p className="text-xl font-bold">
                    {product.seller_products.filter((p) => p.status === 'pending').length +
                      (product.status === 'pending' ? 1 : 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Pending Review</p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3 text-center">
                  <p className="text-xl font-bold">
                    {product.seller_products.filter((p) => p.status === 'draft').length +
                      (product.status === 'draft' ? 1 : 0)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Drafts</p>
                </div>
              </div>
            </SectionCard>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/admin/products')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </aside>
        </div>
      )}
    </PageWrapper>
  );
}
