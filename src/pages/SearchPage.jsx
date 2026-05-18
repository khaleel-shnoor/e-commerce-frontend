import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { PageWrapper } from '../components/common/PageWrapper';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';
import { usePageLoading } from '../hooks/usePageLoading';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [query, setQuery] = useState(q);
  const navigate = useNavigate();
  const loading = usePageLoading();
  const results = q ? searchProducts(q) : [];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <PageWrapper title="Search" breadcrumbs={[{ label: 'Search' }]} loading={loading}>
      <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} className="max-w-xl mb-8" />
      {q && results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We couldn't find anything matching "${q}". Try different keywords.`}
        />
      ) : (
        <>
          {q && <p className="text-sm text-muted-foreground mb-6">{results.length} results for "{q}"</p>}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
