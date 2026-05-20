import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { productsApi, categoriesApi } from '../lib/api';
import { mapApiProduct } from '../lib/product-mapper';
import { testimonials } from '../data/reviews';
import { brandLogos } from '../data/analytics';
import { placeholderImage } from '../lib/utils';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/product/CategoryCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePageLoading } from '../hooks/usePageLoading';
import { ProductCardSkeleton } from '../components/common/Skeleton';

export default function HomePage() {
  const loading = usePageLoading();
  const [shopProducts, setShopProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productsApi
      .list({ limit: 16, sort: 'newest' })
      .then((data) => setShopProducts((data.items || []).map(mapApiProduct)))
      .catch(() => setShopProducts([]));
    categoriesApi
      .list()
      .then((data) => setCategories(data.items || []))
      .catch(() => setCategories([]));
  }, []);

  const featured = shopProducts.slice(0, 4);
  const trending = shopProducts.slice(4, 8);
  const newArrivals = shopProducts.slice(8, 12);
  const flashSale = shopProducts.filter((p) => p.isFlashSale).slice(0, 4);

  return (
  <>
      <section className="relative min-h-[85vh] flex items-center">
        <img
          src={placeholderImage(1920, 1080, 'SHNOOR')}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="container mx-auto px-4 relative z-10 py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Spring / Summer 2025</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading tracking-wide max-w-3xl leading-none mb-6">
            TIMELESS MONOCHROME
          </h1>
          <p className="text-muted-foreground max-w-lg mb-8 text-lg">
            Discover curated essentials designed for the modern minimalist. Premium quality, refined silhouettes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <Button size="lg">
                Shop Collection
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="lg">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <SectionHeader title="Featured" subtitle="Curated" actionLabel="View All" actionHref="/shop" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader title="Categories" subtitle="Explore" actionLabel="All Categories" actionHref="/categories" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((c) => (
              <CategoryCard
                key={c.id}
                category={{
                  ...c,
                  image: placeholderImage(400, 500, c.name),
                  productCount: '—',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <SectionHeader title="Trending Now" subtitle="Popular" actionLabel="Shop Trending" actionHref="/shop" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <SectionHeader title="New Arrivals" subtitle="Just In" actionLabel="See New" actionHref="/shop?filter=new" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-6 w-6" />
            <SectionHeader title="Flash Sale" subtitle="Limited" className="mb-0 flex-1" actionLabel="Shop Sale" actionHref="/shop?filter=sale" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {flashSale.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <SectionHeader title="What People Say" subtitle="Testimonials" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="rounded-xl border border-border bg-card p-6">
              <p className="text-muted-foreground mb-6">&ldquo;{t.content}&rdquo;</p>
              <footer className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-12">
        <div className="container mx-auto px-4 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          {brandLogos.map((brand) => (
            <span key={brand} className="font-heading text-xl tracking-widest">
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="rounded-xl border border-border bg-secondary p-8 md:p-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading tracking-wide mb-2">Stay in the loop</h2>
          <p className="text-muted-foreground mb-6">Exclusive drops, early access, and style inspiration.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" placeholder="your@email.com" className="flex-1" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}

