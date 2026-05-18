import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function CategoryCard({ category, className }) {
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={cn(
        'group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/30',
        className,
      )}
    >
      <figure className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/60 to-transparent p-6">
          <h3 className="text-2xl font-heading text-background tracking-wide">{category.name}</h3>
          <p className="text-sm text-background/80">{category.productCount} products</p>
        </figcaption>
      </figure>
    </Link>
  );
}

