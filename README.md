<!-- Project banner placeholder -->
<div align="center">
  <img src="banner-placeholder.png" alt="Mock Interview Platform Banner" width="100%" />
</div>

# Mock Interview Platform

An AI-powered mock interview platform where users can practice DSA, System Design, HR and Behavioural interviews. The AI generates questions based on topic and difficulty, evaluates answers and gives detailed feedback with scores.

<!-- Badges for tech stack -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

## Features

- User registration and login
- Choose interview topic (DSA / System Design / HR / Behavioural)
- Choose difficulty (Easy / Medium / Hard)
- AI generates questions one by one
- User submits answer and gets AI feedback with score out of 10
- Session summary at the end with all questions, answers and scores
- Dashboard showing past interview sessions

## Screenshots

<!-- Screenshots placeholder -->
*Screenshots coming soon...*

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** JWT
- **AI:** AI API for question generation and feedback

## Folder Structure

```text
mock-interview-platform/
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middlewares/      # Express middlewares
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic and AI integration
│   │   └── index.js          # Entry point
│   ├── prisma/               # Prisma schema and migrations
│   └── package.json
└── frontend/                 # Next.js frontend
    ├── src/
    │   ├── app/              # Next.js App Router pages
    │   ├── components/       # Reusable React components
    │   ├── lib/              # Utility functions
    │   ├── services/         # API calls to backend
    │   └── styles/           # Global styles
    ├── public/               # Static assets
    ├── tailwind.config.ts    # Tailwind CSS configuration
    └── package.json
```
*(Note: Adjust the folder structure according to your actual project setup)*

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mock-interview-platform
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the **backend** directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/mock_interview_db"
JWT_SECRET="your_jwt_secret_key"
AI_API_KEY="your_ai_api_key"
FRONTEND_URL="http://localhost:3000"
```

Create a `.env.local` file in the **frontend** directory:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/user/profile` | Get user profile | Yes |
| POST | `/api/interviews/start` | Start a new interview session | Yes |
| POST | `/api/interviews/question` | Get next AI question | Yes |
| POST | `/api/interviews/answer` | Submit answer and get feedback | Yes |
| POST | `/api/interviews/end` | End interview and get summary | Yes |
| GET | `/api/interviews/history` | Get user's past interviews | Yes |

