# Folder Structure

```
src/
├── components/     # Reusable UI
│   ├── ui/         # Buttons, inputs, modals
│   ├── layout/     # Navbar, footer, sidebar
│   ├── product/    # Product & category cards
│   ├── common/     # Shared utilities (table, pagination)
│   └── charts/     # Chart components
├── pages/          # Public pages
├── dashboard/      # Customer account pages
├── business/       # Seller panel pages
├── admin/          # Admin panel pages
├── layouts/        # Route layouts
├── routes/         # Routing config
├── context/        # Global state
├── data/           # Dummy JSON data
├── hooks/          # Custom hooks
├── lib/            # Utils & nav config
├── assets/         # Static assets
└── docs/           # Documentation
```

## Adding a Page

1. Create component in the appropriate folder (`pages/`, `dashboard/`, etc.)
2. Import in `routes/AppRoutes.jsx`
3. Add `<Route>` inside the correct layout group
