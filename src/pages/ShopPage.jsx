import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { PageWrapper } from '../components/common/PageWrapper';
import { FilterChips, Filters } from '../components/common/Filters';
import { Pagination } from '../components/common/Pagination';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { productsApi, categoriesApi } from '../lib/api';
import { mapApiProduct } from '../lib/product-mapper';
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
];

const PAGE_SIZE = 12;

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get('category');
  const [sort, setSort] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const categoryId = useMemo(() => {
    if (!categoryParam) return null;
    const bySlug = categories.find((c) => c.slug === categoryParam);
    const byId = categories.find((c) => c.id === categoryParam);
    return (bySlug || byId)?.id || categoryParam;
  }, [categoryParam, categories]);

  useEffect(() => {
    categoriesApi
      .list()
      .then((data) => setCategories(data.items || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const offset = (page - 1) * PAGE_SIZE;
    productsApi
      .list({
        category_id: categoryId || undefined,
        sort,
        limit: PAGE_SIZE,
        offset,
      })
      .then((data) => {
        setProducts((data.items || []).map(mapApiProduct));
        setTotal(data.total || 0);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [categoryId, sort, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const filterConfig = [
    {
      name: 'sort',
      label: 'Sort by',
      value: sort,
      options: sortOptions.map((o) => ({ value: o.value, label: o.label })),
    },
  ];

  const setCategory = (val) => {
    setPage(1);
    const next = new URLSearchParams(params);
    if (val) next.set('category', val);
    else next.delete('category');
    setParams(next);
  };

  return (
    <PageWrapper title="Shop" subtitle="Collection" breadcrumbs={[{ label: 'Shop' }]} loading={false}>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <Filters
            filters={filterConfig}
            onChange={(name, val) => {
              if (name === 'sort') {
                setSort(val);
                setPage(1);
              }
            }}
          />
          <h3 className="font-heading text-sm tracking-wide mt-8 mb-4">Categories</h3>
          <FilterChips
            options={[
              { value: '', label: 'All' },
              ...categories.map((c) => ({ value: c.slug, label: c.name })),
            ]}
            active={categoryParam || ''}
            onChange={setCategory}
          />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{total} products</p>
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {products.length === 0 && !loading ? (
            <p className="text-center text-muted-foreground py-16">
              No products available yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-12"
          />
        </div>
      </div>

      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <Filters
          filters={filterConfig}
          onChange={(name, val) => name === 'sort' && setSort(val)}
        />
      </Drawer>
    </PageWrapper>
  );
}
