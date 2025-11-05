# HackathonWallah MVP Development Plan

This document outlines the minimum viable product (MVP) requirements for the HackathonWallah platform, focusing on core features essential for basic hackathon operations. The MVP includes user registration, hackathon creation, registration, team formation, and project submission.

## 🎯 Phase 0: Core Requirements (MVP Scope)

### 0.1 Define MVP Requirements

- [ ] Identify target users (Students, Organizers)
- [ ] Define MVP scope: Registration, basic team formation, project submission
- [ ] Document core business requirements and constraints

### 0.2 Basic Design System

- [ ] Create color palette (primary, secondary, neutral)
- [ ] Define typography (font family, headings, body)
- [ ] Set up 8px grid system for spacing
- [ ] Design core components: Buttons, inputs, cards, navigation

### 0.3 Technical Stack (MVP)

- [ ] **Frontend**: Next.js 14+, React 18+, TypeScript
- [ ] **Backend**: Supabase (PostgreSQL + Auth + Storage)
- [ ] **Styling**: Tailwind CSS + Shadcn/ui components
- [ ] **Payment**: Basic registration (no payment processing for MVP)

## 🛠️ Phase 1: Environment & Foundation Setup

### 1.1 Project Initialization

- ✅ Create new Next.js project with TypeScript
- ✅ Configure project structure and folders
- ✅ Set up environment variables template
- ✅ Install essential dependencies

### 1.2 Core Dependencies Installation

```bash
# Core framework and build tools
- [ ] next@latest
- [ ] react@^18.0.0
- [ ] react-dom@^18.0.0
- [ ] typescript@^5.0.0

# UI and styling
- [ ] tailwindcss@^3.3.0
- [ ] autoprefixer@^10.4.0
- [ ] postcss@^8.4.0

# UI Components
- [ ] @shadcn/ui components
- [ ] lucide-react@^0.263.0

# State management and data fetching
- [ ] zustand@^4.4.0
- [ ] axios@^1.5.0

# Form handling and validation
- [ ] react-hook-form@^7.45.0
- [ ] zod@^3.22.0

# Development tools
- [ ] eslint@^8.48.0
- [ ] prettier@^3.0.0
```

### 1.3 Project Structure Creation

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form-specific components
│   └── features/         # Feature-specific components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   └── utils.ts          # Utility functions
├── types/                # TypeScript definitions
└── hooks/                # Custom React hooks
```

### 1.4 Environment Configuration

- ✅ Create .env.example file
- ✅ Set up development environment variables
- ✅ Configure Supabase URL and anon key

**Environment Variables**

```
# Database
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 🗄️ Phase 2: Database & Backend Setup

### 2.1 Supabase Project Configuration

- ✅ Create Supabase account and project for HackathonWallah
- ✅ Configure project settings and API keys
- ✅ Enable Row Level Security (RLS) policies
- ✅ Configure authentication providers (Email, Google, GitHub)

### 2.2 Core Database Schema

- ✅ **Users table**: profiles, roles
- ✅ **Hackathons table**: details, timeline, rules
- ✅ **Teams table**: members, project info
- ✅ **Submissions table**: project details, links
- ✅ **Relational tables**: User-Hackathon registrations, Team-Project relationships

### 2.3 Supabase Client Setup

- ✅ Install Supabase JavaScript client
- ✅ Create Supabase client configuration
- ✅ Set up environment variables
- ✅ Test database connection

## 🎨 Phase 3: Core Frontend Development

### 3.1 Landing Page Development

- [ ] Hero section with headline and CTA buttons
- [ ] Featured hackathons section with cards
- [ ] How It Works section (Register → Form Team → Build → Submit)
- [ ] Basic statistics section
- [ ] Footer with company info

### 3.2 Core Components

- [ ] **Navigation**: Header with logo, navigation links, user menu
- [ ] **Cards**: HackathonCard, UserCard, ProjectCard
- [ ] **Forms**: Custom Input, Select, File upload
- [ ] **Loading states**: Skeleton loaders, spinners

### 3.3 Responsive Design

- [ ] Mobile-first CSS approach
- [ ] Tablet breakpoints
- [ ] Desktop optimization

## 🔐 Phase 4: Authentication & User Management

### 4.1 Authentication System Setup

- [ ] Configure Supabase Auth with Email provider
- [ ] Set up email verification process
- [ ] Create auth helper functions
- [ ] Implement login/logout handlers

### 4.2 User Registration & Login

- [ ] Create registration and login forms with validation
- [ ] Email verification process
- [ ] Social login integration (optional for MVP)

### 4.3 User Profile Management

- [ ] Create user profile form (basic info, skills)
- [ ] Profile display for participants
- [ ] Basic onboarding flow

### 4.4 Basic Dashboard

- [ ] Personalized welcome message
- [ ] Quick action buttons
- [ ] Recent activity feed
- [ ] Upcoming hackathons preview

## 🎯 Phase 5: Hackathon Management System (MVP)

### 5.1 Hackathon Creation Wizard

- [ ] Basic information form (title, description, banner)
- [ ] Timeline configuration (registration, hackathon dates, submission deadline)
- [ ] Team size limits
- [ ] Basic rules (code of conduct, submission requirements)

### 5.2 Organizer Dashboard

- [ ] Overview of registrations and participants (basic count)
- [ ] Edit hackathon details
- [ ] View participant list

### 5.3 Hackathon Discovery & Registration

- [ ] Browse hackathons with filter by date and category
- [ ] Hackathon detail page with registration button
- [ ] Registration form (basic user info confirmation)
- [ ] Registration confirmation

### 5.4 Team Formation System

- [ ] Create new team interface (name, description, required skills)
- [ ] Browse available teams and join requests
- [ ] Team leader approval process
- [ ] Basic team dashboard (members list)

### 5.5 Basic Project Submission

- [ ] Submission form (project title, description, links, demo)
- [ ] File upload integration (if needed)
- [ ] Submission deadline enforcement
- [ ] Basic submission confirmation

## 🧪 Phase 6: Testing & Launch

### 6.1 Basic Testing

- [ ] Unit tests for core components
- [ ] Integration tests for auth flow
- [ ] Manual testing of registration and submission flows

### 6.2 MVP Launch

- [ ] Set up basic deployment (Vercel)
- [ ] Domain configuration
- [ ] Launch preparation checklist
