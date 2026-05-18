import { categories } from '../data/categories';
import { CategoryCard } from '../components/product/CategoryCard';
import { PageWrapper } from '../components/common/PageWrapper';
import { usePageLoading } from '../hooks/usePageLoading';

export default function CategoriesPage() {
  const loading = usePageLoading();

  return (
    <PageWrapper
      title="Categories"
      subtitle="Browse"
      breadcrumbs={[{ label: 'Categories' }]}
      loading={loading}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </PageWrapper>
  );
}

