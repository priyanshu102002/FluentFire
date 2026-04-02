# Daily English Practice

A modern web application for daily English language practice with streak tracking and interactive challenges. Built with **Next.js**, **Firebase**, and **TypeScript**.

## Overview

**Daily English Practice** helps users improve their English skills through:
- 🎯 **Daily Challenges**: 5 fill-in-the-blank questions every day
- 🔥 **Streak Tracking**: Maintain consecutive day streaks
- 🔐 **Secure Authentication**: Google Sign-In via Firebase
- ⚡ **Real-time Progress**: Track completion status across devices
- 🎨 **Modern UI**: Dark-themed interface with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16.2.2** (App Router) - React framework with file-based routing
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **React Hooks** - State management
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful iconography

### Backend
- **Next.js API Routes** - Serverless backend
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User security

### Development Tools
- **Turbopack** - Ultra-fast bundler
- **ESLint** - Code quality
- **PostCSS** - CSS processing

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── api/                       # Backend API routes
│   │   ├── user/                  # User profile endpoints
│   │   └── progress/              # Progress tracking endpoints
│   ├── (auth)/                    # Authentication pages
│   │   └── login/                 # Login page
│   ├── (protected)/               # Protected routes (require auth)
│   │   ├── dashboard/             # User dashboard
│   │   └── challenge/             # Daily challenge
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Home page (redirect)
│   └── globals.css                # Global styles
│
├── server/                        # Backend utilities
│   ├── errors.ts                  # Error handling
│   ├── db.ts                      # Database operations
│   └── index.ts                   # Exports
│
├── components/                    # React components
│   ├── QuestionCard.tsx           # Question display
│   ├── HintBox.tsx                # Hint system
│   ├── ProgressBar.tsx            # Progress indicator
│   └── ProtectedRoute.tsx         # Route protection
│
├── contexts/                      # React contexts
│   └── AuthContext.tsx            # Authentication state
│
└── lib/                           # Shared utilities
    ├── firebase.ts                # Firebase config
    ├── questions.ts               # Question data
    ├── user-client.ts             # User API client
    ├── progress-client.ts         # Progress API client
    └── utils.ts                   # Utility functions
```

See [`src/STRUCTURE.md`](src/STRUCTURE.md) for detailed structure documentation.

## Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- **Firebase Project** with:
  - Firestore Database
  - Authentication (Google Sign-In)
  - Environment variables configured

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd daily-english-practice
npm install
```

### 2. Configure Firebase

#### Create a `.env` file in the project root:
```bash
cp .env.example .env
```

#### Update `.env` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_ID=your_database_id
```

### 3. Configure Firestore Security Rules

Go to [Firebase Console](https://console.firebase.google.com):
1. Select your project → **Firestore Database**
2. Click **Security** tab
3. Paste the appropriate rules (see [Security Rules](#security-rules) section)
4. Click **Publish**

### 4. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Git Workflow

```bash
# Create a new feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature
```

## Security Rules

### Development (Testing Only)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
⚠️ **Never use in production!**

### Production (Secure)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only user can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Daily progress - only authenticated user can read/write their own progress
    match /daily_progress/{docId} {
      allow read, write: if request.auth != null && 
                            docId.split('_')[0] == request.auth.uid;
    }
  }
}
```

## API Documentation

### User Endpoints

#### GET `/api/user`
Get user profile by userId
```
GET /api/user?userId=8qzAdCFGCJew4tt17SsEgziWAgI3
```
**Response:**
```json
{
  "email": "user@example.com",
  "streak": 5,
  "lastCompletedDate": "2026-04-02"
}
```

#### POST `/api/user`
Create a new user profile
```
POST /api/user
Content-Type: application/json

{
  "userId": "8qzAdCFGCJew4tt17SsEgziWAgI3",
  "email": "user@example.com"
}
```

#### PUT `/api/user`
Update user streak
```
PUT /api/user
Content-Type: application/json

{
  "userId": "8qzAdCFGCJew4tt17SsEgziWAgI3",
  "completedAll": true
}
```

### Progress Endpoints

#### GET `/api/progress`
Get today's progress
```
GET /api/progress?userId=8qzAdCFGCJew4tt17SsEgziWAgI3
```
**Response:**
```json
{
  "userId": "8qzAdCFGCJew4tt17SsEgziWAgI3",
  "date": "2026-04-02",
  "currentQuestionIndex": 3,
  "completed": false
}
```

#### POST `/api/progress`
Initialize daily progress
```
POST /api/progress
Content-Type: application/json

{
  "userId": "8qzAdCFGCJew4tt17SsEgziWAgI3"
}
```

#### PUT `/api/progress`
Update progress
```
PUT /api/progress
Content-Type: application/json

{
  "userId": "8qzAdCFGCJew4tt17SsEgziWAgI3",
  "currentQuestionIndex": 3,
  "completed": false
}
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your environment variables in the Vercel dashboard.

### Deploy to Other Platforms

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform

3. **Update Firestore Security Rules** to production rules

4. **Deploy:**
   - **Netlify**: Connect your Git repo
   - **Railway**: Push your code and deploy
   - **AWS**: Use Amplify or EC2
   - **Self-hosted**: Run `npm start`

## Troubleshooting

### API endpoints returning 500 errors
→ Check Firestore Security Rules in Firebase Console

### "Permission denied" errors
→ Switch to production security rules (see [Security Rules](#security-rules))

### Google Sign-In not working
→ Add `localhost:3000` and your domain to authorized domains in Firebase Console

### Build errors with imports
→ Ensure `@/` path alias resolves to `src/` in `tsconfig.json`

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/improvement`
3. Commit changes: `git commit -m "feat: add improvement"`
4. Push to branch: `git push origin feature/improvement`
5. Open a pull request

## License

This project is open source and available under the MIT License.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Support

For issues, bug reports, or feature requests, please open an [issue](https://github.com/your-repo/issues).

---

**Happy coding! 🚀**
