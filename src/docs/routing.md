# Routing Architecture

## Layout Groups

| Layout | Path Prefix | Purpose |
|--------|-------------|---------|
| `PublicLayout` | `/` | Storefront with navbar + footer |
| `AuthLayout` | `/login`, `/register`, etc. | Auth screens |
| `CustomerLayout` | `/account` | Customer dashboard |
| `SellerLayout` | `/seller` | Seller panel |
| `AdminLayout` | `/admin` | Admin panel |

## Protected Routes

`ProtectedRoute` checks authentication and role via `AuthContext`.

```jsx
<Route path="account" element={
  <ProtectedRoute allowedRoles={['customer']}>
    <CustomerLayout />
  </ProtectedRoute>
}>
```

## Breadcrumbs

Pass items to `PageWrapper`:

```jsx
breadcrumbs={[
  { label: 'Shop', href: '/shop' },
  { label: 'Product Name' },
]}
```
