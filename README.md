# Srorn Frontend

React + Vite frontend for the Srorn support and management system.

The frontend calls the backend through `/api` by default. In local development,
Vite proxies `/api` to the FastAPI server.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Environment

- `VITE_API_BASE_URL`: API base URL. Use `/api` for the Vite/nginx proxy or a full URL such as `http://localhost:8000/api`.
- `VITE_API_PROXY_TARGET`: local Vite proxy target, usually `http://localhost:8000`.

## Project Structure

```text
src/
  api/              Shared HTTP client and token helpers
  components/       Reusable UI components
  context/          React context state providers
  hooks/            Reusable React hooks
  layouts/          App layout shells
  lang/             i18n setup
  providers/        Global provider composition
  routes/           Router, guards, and route configuration
  services/         Feature service wrappers around API calls
  utils/            Shared pure helpers
  views/            Page-level screens grouped by feature
```

## Implementation Rules

- Use `@/` imports for app code, for example `@/services/studentService`.
- Put reusable UI in `src/components`; keep page-only UI beside the page in `src/views`.
- Put new protected routes in `src/routes/routeConfig.jsx` with the required permission.
- Use `src/api/axiosClient.js` as the only Axios instance, and keep it inside service files.
- Put endpoint-specific wrappers in `src/services`; views should call services, not Axios directly.

## Add A New Page

1. Create the page in `src/views/<feature>/<PageName>.jsx`.
2. Add a lazy import and route entry in `src/routes/routeConfig.jsx`.
3. Set the route permission with the backend permission key.
4. Add or reuse a service in `src/services`, then call that service from the page.
