🧠 AI Interview App — Product README (Draft)
🚀 Overview

We’re building an AI-powered interview simulator that helps users practice interviews in a realistic, feedback-driven environment.

Users can:

Select interview domains (Frontend, Backend, Data, etc.)
Attempt AI-generated questions
Get evaluated answers + scores
Track progress over time
🎯 Mission

Help students and professionals practice smarter, not harder by simulating real interview scenarios with instant, actionable feedback.

⚙️ Tech Stack
Frontend: Next.js (App Router) + TypeScript
UI: shadcn/ui + Tailwind CSS
Icons: lucide-react
Backend: Next.js API routes
ORM: Prisma
Database: PostgreSQL
AI Engine: Grok API (question generation + evaluation)
🧩 Core Features
1. Landing Page
Hero section (CTA-driven)
Bento-style feature cards
Demo + Start Interview buttons
Clean, modern, animated UI
2. Authentication
Login / Signup flow
Redirect to dashboard
3. Dashboard
Select interview type:
Frontend
Backend
Data Analyst
DevOps
Design
Progress graph 📈
Past interview history (scores + trends)
4. Interview Flow
AI-generated questions
Answer input field
Reveal expected answer after submission
Score per question (/10)
Navigation:
Next / Previous
Exit (without saving)
5. Results Screen
Total score
Per-question breakdown
AI-generated feedback
Improvement suggestions
✨ UX Enhancements
Micro animations (hover, transitions, loaders)
Smooth state transitions
Minimal + distraction-free UI
🎨 Design System (VERY IMPORTANT — lock this first)
🌈 Color Scheme (Dark-first, premium feel)
Base
bg-primary: #0B0B0F (main background)
bg-secondary: #111116
border: #1F1F2B
Accent
primary: #7C5CFF (purple)
secondary: #00D4FF (cyan)
gradient: purple → cyan
Text
text-primary: #FFFFFF
text-secondary: #A1A1AA
text-muted: #6B7280

👉 vibe = Linear + Vercel + AI SaaS energy

🔤 Typography
Headings: Inter / Satoshi
Body: Inter
Optional fancy: Clash Display for hero
Scale
H1: text-5xl md:text-6xl font-bold
H2: text-3xl font-semibold
Body: text-base text-gray-400
🧱 Components System
1. Navbar
Logo (left)
Links (Features, Dashboard)
CTA (Login / Start)
2. Buttons
Primary → gradient + glow
Secondary → outline
3. Bento Cards (🔥 important)
Slight glassmorphism
Hover scale + glow
Icon + title + desc
4. Cards (Dashboard)
Rounded-2xl
Soft border
Subtle shadow
5. Graphs
Use recharts
Smooth curves
Gradient stroke
✨ Micro Animations
Hover → scale-105 + shadow-lg
Button → glow pulse
Page load → fade-in
Cards → stagger animation
Input focus → border glow
🧭 App Flow
Landing Page
   ↓
Login / Signup
   ↓
Dashboard
   ↓
Start Interview
   ↓
Interview Screen
   ↓
Results Page
🧩 Now Let’s Upgrade Your Landing Page (Structure)

Instead of your current minimal page, we’ll split into components:

/components
  Navbar.tsx
  Hero.tsx
  BentoFeatures.tsx
  Footer.tsx
🏗️ Final LP Structure
<Navbar />
<Hero />
<BentoFeatures />
<Footer />
💥 Hero Upgrade Idea
Gradient heading
Subtle animated background (blur blobs)
2 CTAs:
Start Interview
Watch Demo
🧊 Bento Cards Ideas
AI Generated Questions
Instant Feedback
Performance Analytics
Real Interview Simulation
🧠 Dashboard UI Plan

Sections:

Greeting + CTA
Interview Type Cards
Progress Graph
History List
🎯 Interview Screen Layout
[ Question ]

[ Answer Box ]

[ Submit ]

(after submit)
→ Expected Answer
→ Score

[ Prev ] [ Next ] [ Exit ]