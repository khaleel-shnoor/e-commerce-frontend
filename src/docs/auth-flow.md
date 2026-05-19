# Frontend Authentication Flow

## Overview

Authentication uses the backend JWT API. Tokens persist in `localStorage` via `auth-storage.js`.

## Login (email/password)

1. User submits `/login` form
2. `authApi.login()` → POST `/api/v1/auth/login`
3. Store `access_token` + `refresh_token`
4. `applyUser()` from response or GET `/auth/me`
5. Redirect to `location.state.from` or role dashboard

## Register

1. POST `/auth/register` with email, password, full_name
2. Store tokens, redirect to `/account`
3. Verification email logged on backend (dev)

## Google OAuth

1. "Continue with Google" → full redirect to `GET /api/v1/auth/google/login`
2. Google consent → backend callback
3. Backend redirects to `/auth/callback?access_token=...&refresh_token=...`
4. `OAuthCallbackPage` calls `loginWithTokens()` → `/account` (or role path)

## Token refresh

`apiRequest()` on 401:

1. POST `/auth/refresh` with stored refresh token
2. Update localStorage
3. Retry original request once

## Logout

`logout()` → POST `/auth/logout` + clear localStorage

## Protected routes

`ProtectedRoute` checks `isAuthenticated` and `allowedRoles`. Shows loading while `AuthContext` bootstraps from stored access token.

## Environment

```env
VITE_API_URL=http://localhost:8000
```

## Role → dashboard

| Role | Path |
|------|------|
| customer | `/account` |
| seller | `/seller` |
| admin | `/admin` |
