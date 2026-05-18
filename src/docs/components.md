# Components Guide

## UI Primitives (`components/ui/`)

- `Button` — variants: primary, secondary, outline, ghost
- `Input`, `Textarea`, `Select`
- `Modal`, `Drawer`
- `Badge`, `StatusBadge`

## Layout (`components/layout/`)

- `Navbar` — search, cart, theme toggle
- `Footer` — site links
- `Sidebar` — dashboard navigation

## Common (`components/common/`)

- `PageWrapper` — title, breadcrumbs, loading skeleton
- `DataTable` — sortable table with empty/loading states
- `Pagination`, `SearchBar`, `Filters`
- `EmptyState`, `StatsCard`, `Skeleton`
- `ToastContainer`

## Product (`components/product/`)

- `ProductCard` — add to cart, wishlist
- `CategoryCard` — category grid item

## Usage

```jsx
import { PageWrapper } from '../components/common/PageWrapper';
import { Button } from '../components/ui/Button';

export default function MyPage() {
  return (
    <PageWrapper title="My Page" loading={false}>
      <Button>Action</Button>
    </PageWrapper>
  );
}
```
