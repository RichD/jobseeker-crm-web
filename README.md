# JobSeeker CRM Web

A React + TypeScript frontend demonstrating modern SPA architecture.

**Portfolio project** built to explore React 19, TypeScript, Vite, and Tailwind CSS 4.

---

## Technical Demonstrations

**Frontend Architecture:**
- React 19 with functional components and hooks
- TypeScript for type safety
- React Router 7 with protected routes
- JWT authentication flow
- Centralized API client with error handling

**Modern Tooling:**
- Vite 7 for fast development and builds
- Tailwind CSS 4 utility-first styling
- ESLint for code quality
- Hot Module Replacement (HMR)

**UX Patterns:**
- Protected route authentication
- Loading and error states
- Search and filter functionality
- Responsive design

---

## Tech Stack

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- React Router 7.9.6
- Tailwind CSS 4.1.17
- ESLint

---

## Scope

**What's included:**
- User signup/login
- JWT token management
- Job list with search/filter
- Create/edit/delete jobs
- Protected routes
- Responsive layout

**Intentionally kept simple** to demonstrate core React patterns and TypeScript integration.

---

## Quick Start

### Prerequisites
- Node.js 18+
- Backend API running ([jobseeker-crm-api](https://github.com/RichD/jobseeker-crm-api))

### Installation

```bash
git clone https://github.com/RichD/jobseeker-crm-web.git
cd jobseeker-crm-web

npm install
cp .env.example .env  # Edit with your API URL
npm run dev

# App available at http://localhost:5173
```

---

## Environment Variables

```bash
# Backend API URL
VITE_API_URL=http://localhost:3000/api/v1
```

See `.env.example` for reference.

---

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Project Structure

```
jobseeker-crm-web/
├── src/
│   ├── components/
│   │   ├── JobForm.tsx       # Create/Edit form
│   │   ├── Jobs.tsx          # Job list
│   │   ├── Login.tsx         # Login page
│   │   ├── Signup.tsx        # Signup page
│   │   ├── Navbar.tsx        # Navigation
│   │   └── ProtectedRoute.tsx # Auth guard
│   ├── utils/
│   │   └── api.ts            # API client
│   ├── App.tsx               # Routes
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind
├── .env.example              # Config template
├── vite.config.ts            # Vite config
├── tailwind.config.ts        # Tailwind config
└── tsconfig.json             # TypeScript config
```

---

## Features

**Authentication:**
- JWT-based authentication
- Token stored in localStorage
- Auto-redirect on 401 responses
- Protected route wrapper

**Job Management:**
- Create/edit/delete jobs
- Real-time search by title/company
- Filter by application status
- External job posting links

**UI/UX:**
- Clean Tailwind styling
- Responsive design
- Loading states
- Empty states
- Form validation

---

## API Integration

Uses centralized API client (`src/utils/api.ts`) that handles:
- JWT token injection
- Error handling
- 401 auto-logout
- JSON serialization

Example:
```typescript
import { apiFetch } from "../utils/api";

const response = await apiFetch(`${API_URL}/jobs`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ job: jobData }),
});
```

---

## Related Projects

**Backend API:** [jobseeker-crm-api](https://github.com/RichD/jobseeker-crm-api) - Rails REST API

---

## License

MIT License

---

**Built to explore React 19 + TypeScript + Vite**
