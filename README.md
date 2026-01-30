# Arryde Admin Dashboard

Admin dashboard for the Arryde rideshare platform. Provides real-time oversight of drivers, riders, and rides with filtering, search, and live updates via GraphQL subscriptions.

## Tech Stack

- React 19 + Vite
- Apollo Client (GraphQL + WebSocket subscriptions)
- Tailwind CSS
- Zustand (state management)
- React Router v7

## Setup

```bash
npm install
npm run dev       # Development server (port 5173)
npm run build     # Production build
npm run preview   # Preview production build
```

## Environment Variables

**Development** (`.env.development`):
```
VITE_API_GRAPHQL_URI=http://localhost:3001/graphql
VITE_API_GRAPHQL_WS=ws://localhost:3001/graphql
```

**Production** (`.env.production`):
```
VITE_API_GRAPHQL_URI=https://rideshare-api-production.up.railway.app/graphql
VITE_API_GRAPHQL_WS=wss://rideshare-api-production.up.railway.app/graphql
```

## Features

- Admin login with JWT authentication and auto-refresh
- **Driver management** - Table with real-time duty/login/availability updates, search, filters, detail modals
- **Rider management** - Table with real-time ride flow/login/wait time updates, search, filters, detail modals
- **Ride management** - Table with real-time status updates (created, accepted, canceled, completed, expired), search, filters, detail modals
- **Dashboard** - Overview with driver/rider/ride counts and quick actions
- **Analytics** - Coming soon

## Related Projects

- [rideshare-api](https://github.com/yourusername/rideshare-api) - Backend GraphQL API
- [bham-rideshare](https://github.com/yourusername/bham-rideshare) - User-facing frontend
