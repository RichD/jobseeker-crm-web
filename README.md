# JobSeeker CRM Web

A modern React + TypeScript frontend for tracking job applications, built with Vite and Tailwind CSS.

**Live Demo:** https://jobseeker-crm-web-dusky.vercel.app

**Backend API:** https://github.com/RichD/jobseeker-crm-api

---

## Features

- 🔐 **User Authentication** - Secure signup and login with JWT tokens
- 📝 **Job Management** - Create, view, update, and delete job applications
- 🔍 **Search & Filter** - Search jobs by title/company and filter by status
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS 4
- ⚡ **Fast & Lightweight** - Built with Vite for instant HMR and optimized builds
- 🛡️ **Type-Safe** - Full TypeScript support for better DX and fewer bugs
- 🔄 **Protected Routes** - Automatic redirect to login for unauthenticated users
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

---

## Tech Stack

- **React** 19.2.0
- **TypeScript** 5.9.3
- **Vite** 7.2.4
- **React Router** 7.9.6
- **Tailwind CSS** 4.1.17
- **ESLint** for code quality
- **Deployment** Vercel

---

## Screenshots

<!-- Add screenshots here when ready -->

---

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running (see [jobseeker-crm-api](https://github.com/RichD/jobseeker-crm-api))

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RichD/jobseeker-crm-web.git
   cd jobseeker-crm-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend API URL
# For local development (if running backend locally):
VITE_API_URL=http://localhost:3000/api/v1

# For production (using deployed backend):
VITE_API_URL=https://jobseeker-crm-api-production.up.railway.app/api/v1
```

See `.env.example` for reference.

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RichD/jobseeker-crm-web)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub repository
3. Set environment variables:
   - `VITE_API_URL` - Your backend API URL
4. Deploy!

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to any static hosting:**
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Any CDN or static host

---

## Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

### Code Quality

```bash
# Check for linting issues
npm run lint

# Type checking (via build)
npm run build
```

---

## Project Structure

```
jobseeker-crm-web/
├── src/
│   ├── components/
│   │   ├── JobForm.tsx       # Create/Edit job form
│   │   ├── Jobs.tsx           # Job list with search/filter
│   │   ├── Login.tsx          # Login page
│   │   ├── Signup.tsx         # Signup page
│   │   ├── Navbar.tsx         # Navigation bar
│   │   └── ProtectedRoute.tsx # Auth guard component
│   ├── utils/
│   │   └── api.ts             # API helper with auth handling
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind imports
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## Features in Detail

### Authentication
- JWT-based authentication with automatic token refresh
- Tokens stored in localStorage
- Protected routes redirect to login when unauthenticated
- Automatic logout on 401 responses

### Job Management
- **Create:** Add new job applications with all details
- **Read:** View job list and individual job details
- **Update:** Edit job information inline
- **Delete:** Remove job applications

### Search & Filter
- **Search:** Real-time search by job title or company name
- **Filter:** Filter jobs by status (saved, applied, interviewing, offer, rejected)
- Both can be combined for precise results

### User Experience
- Clean, modern UI with Tailwind CSS
- Responsive design for all screen sizes
- Loading states for async operations
- Empty states when no jobs exist
- External links to original job postings

---

## API Integration

This frontend consumes the [JobSeeker CRM API](https://github.com/RichD/jobseeker-crm-api). All API calls include:

- JWT token in Authorization header
- Automatic 401 handling (redirects to login)
- Centralized API utility (`src/utils/api.ts`)

Example API call:
```typescript
import { apiFetch } from "../utils/api";

const response = await apiFetch(`${API_URL}/jobs`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ job: jobData }),
});
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linter and type check:
   ```bash
   npm run lint
   npm run build
   ```
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Use Tailwind CSS utility classes (avoid custom CSS)
- Run ESLint before committing
- Ensure TypeScript compilation succeeds

---

## Future Enhancements

- [ ] Pagination UI controls
- [ ] Sorting by different fields (date, title, company)
- [ ] Date range filtering
- [ ] Bulk operations (delete, status update)
- [ ] Dark mode toggle
- [ ] Job application statistics/analytics
- [ ] Export jobs to CSV/PDF
- [ ] Email notifications for status changes

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Related Projects

- **Backend API:** [jobseeker-crm-api](https://github.com/RichD/jobseeker-crm-api) - Ruby on Rails REST API

---

## Support

- 🐛 [Report a bug](https://github.com/RichD/jobseeker-crm-web/issues)
- 💡 [Request a feature](https://github.com/RichD/jobseeker-crm-web/issues)

---

**Built with ❤️ using React + TypeScript + Vite**
