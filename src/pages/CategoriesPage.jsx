import { useEffect, useState } from 'react';
import { CategoryCard } from '../components/product/CategoryCard';
import { PageWrapper } from '../components/common/PageWrapper';
import { categoriesApi } from '../lib/api';
import { placeholderImage } from '../lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi
      .list()
      .then((data) => setCategories(data.items || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper
      title="Categories"
      subtitle="Browse"
      breadcrumbs={[{ label: 'Categories' }]}
      loading={loading}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={{
              ...c,
              image: placeholderImage(400, 500, c.name),
              productCount: 'Shop',
            }}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
