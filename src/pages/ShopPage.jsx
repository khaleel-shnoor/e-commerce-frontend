import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';
import { PageWrapper } from '../components/common/PageWrapper';
import { FilterChips, Filters } from '../components/common/Filters';
import { Pagination } from '../components/common/Pagination';
import { usePageLoading } from '../hooks/usePageLoading';
import { usePagination } from '../hooks/usePagination';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const [params] = useSearchParams();
  const category = params.get('category');
  const filter = params.get('filter');
  const [sort, setSort] = useState('featured');
  const [filterOpen, setFilterOpen] = useState(false);
  const loading = usePageLoading();

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.categoryId === category);
    if (filter === 'new') list = list.filter((p) => p.isNew);
    if (filter === 'sale') list = list.filter((p) => p.isFlashSale);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest') list.sort((a, b) => b.id - a.id);
    return list;
  }, [category, filter, sort]);

  const { page, totalPages, paginatedItems, goToPage } = usePagination(filtered, 8);

  const filterConfig = [
    {
      name: 'sort',
      label: 'Sort by',
      value: sort,
      options: sortOptions.map((o) => ({ value: o.value, label: o.label })),
    },
  ];

  return (
    <PageWrapper
      title="Shop"
      subtitle="Collection"
      breadcrumbs={[{ label: 'Shop' }]}
      loading={loading}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <Filters
            filters={filterConfig}
            onChange={(name, val) => name === 'sort' && setSort(val)}
          />
          <h3 className="font-heading text-sm tracking-wide mt-8 mb-4">Categories</h3>
          <FilterChips
            options={[{ value: '', label: 'All' }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            active={category || ''}
            onChange={(val) => {
              const url = new URL(window.location.href);
              val ? url.searchParams.set('category', val) : url.searchParams.delete('category');
              window.history.pushState({}, '', url);
              window.location.reload();
            }}
          />
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {paginatedItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : paginatedItems.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} className="mt-12" />
        </div>
      </div>

      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <Filters filters={filterConfig} onChange={(name, val) => name === 'sort' && setSort(val)} />
      </Drawer>
    </PageWrapper>
  );
}
