# Project Structure

## Overview
The project is now organized with a clear separation between frontend and backend code.

```
src/
├── app/                           # Next.js App Router
│   ├── api/                       # Backend API routes (REST endpoints)
│   │   ├── user/                  # User profile management
│   │   └── progress/              # Daily progress tracking
│   ├── (auth)/                    # Frontend auth pages
│   │   └── login/
│   ├── (protected)/               # Frontend protected pages
│   │   ├── dashboard/
│   │   └── challenge/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Home page (redirect)
│   └── globals.css                # Global styles
│
├── server/                        # Backend utilities (isolated)
│   ├── errors.ts                  # Error handling utilities
│   ├── db.ts                      # Database operations
│   └── index.ts                   # Server exports
│
├── components/                    # Frontend components (client-side)
│   ├── QuestionCard.tsx
│   ├── HintBox.tsx
│   ├── ProgressBar.tsx
│   └── ProtectedRoute.tsx
│
├── contexts/                      # Frontend React contexts
│   └── AuthContext.tsx            # Firebase authentication
│
└── lib/                           # Shared utilities
    ├── firebase.ts                # Firebase initialization
    ├── questions.ts               # Question data
    ├── user-client.ts             # Client-side user API calls
    ├── progress-client.ts         # Client-side progress API calls
    └── utils.ts                   # Utility functions

```

## Key Principles

### Backend (API Routes)
- Located in `src/app/api/`
- Use `server/` utilities for database operations
- Handle validation and business logic
- Return JSON responses

### Frontend (React Components)
- Located in `src/components/`, `src/contexts/`
- Use client-side API wrappers in `src/lib/`
- All client components marked with `'use client'`

### Shared Code
- `src/lib/` contains both frontend and backend utilities
- `src/server/` contains backend-only helpers
- Path alias `@/` resolves to `src/`

## Import Examples

```typescript
// Frontend - importing components
import { QuestionCard } from '@/components/QuestionCard';

// Frontend - importing contexts
import { useAuth } from '@/contexts/AuthContext';

// Frontend - importing client API wrappers
import { getUserProfile } from '@/lib/user-client';

// Backend - importing database utilities
import { getDocument, createDocument } from '@/server';

// Backend - importing shared utilities
import { db } from '@/lib/firebase';
```

## Adding New Features

### New API Endpoint
1. Create file: `src/app/api/[feature]/route.ts`
2. Import from `@/lib/firebase` and `@/server`
3. Implement GET/POST/PUT/DELETE handlers

### New Frontend Page
1. Create folder: `src/app/(route-group)/[page]/`
2. Add `page.tsx` with `'use client'` directive
3. Import components from `@/components`

### New Component
1. Create file: `src/components/ComponentName.tsx`
2. Add `'use client'` directive
3. Import hooks from `@/contexts` or `@/lib`
