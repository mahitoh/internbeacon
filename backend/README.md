# InternBeacon Backend

A comprehensive internship platform backend built with Node.js, Express, and Prisma.

## Features

- User authentication (Students, Companies, Admin)
- Internship posting and application management
- AI-powered resume optimization
- One-click applications
- Progress tracking for students
- Real-time chat and messaging
- Matching algorithms
- Notifications system

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and API keys
```

3. Set up database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the server:
```bash
npm start
```

## AI Configuration

The backend supports multiple AI providers for resume optimization:

### Recommended: OpenAI
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Get your API key (new users get $5 free credit)
3. Set in `.env`:
```
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
```

### Alternative: Google Gemini
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set in `.env`:
```
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### Alternative: Hugging Face
1. Sign up at [Hugging Face](https://huggingface.co/)
2. Get API key
3. Set in `.env`:
```
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your_key_here
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/offers` - Create internship offer (companies)
- `POST /api/applications/apply` - Apply to internship
- `POST /api/applications/quick-apply` - One-click application
- `POST /api/ai/resume-optimize` - AI resume optimization
- `GET /api/progress/overall` - Student progress dashboard
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/rooms/:roomId/messages` - Send message

## Database Schema

Uses PostgreSQL with Prisma ORM. Key models:
- User, Student, Company
- Offer, Application
- ChatRoom, Message
- Notification, Match

Run `npx prisma studio` to view database.