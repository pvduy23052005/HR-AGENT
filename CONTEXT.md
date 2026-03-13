# CONTEXT — HR Agent (Intelligent Recruiting Assistant)

This repository is an end-to-end **Intelligent HR Assistant** platform that automates candidate screening, job matching, and candidate analysis using **Generative AI (Google Gemini)**, structured data extraction, and a modern full-stack UI.

---

## 🧠 High-Level Purpose

The app is designed to help HR/recruiters:

- **Automatically parse resumes (CVs)** (PDF / text) into structured JSON.
- **Discover potential candidates automatically** by sourcing from LinkedIn/GitHub and other public repositories using agentic browsing.
- **Store and manage candidates** and job postings.
- **Score candidate-job fit** using semantic / AI-based matching.
- **Generate and send outreach emails** (AI-written, scheduled, and sent) once a match is identified.
- **Provide quick insights** (summary, red flags, suggested interview questions).
- **Support a workflow**: Upload CV → Parse → Save → Analyze → Reach out.

---

## ✅ Main Features

### 1) CV Upload & Parsing (Data Structuring)

- Upload CV files (PDF / text) via the web UI.
- Uses **Google Gemini** (via `@google/genai`) to extract structured candidate data.
- Stores parsed candidate data in MongoDB.

### 2) Job Management

- Create, update, delete, and list job postings.
- Job postings are used as the reference for AI matching.

### 3) Candidate Management & Listing

- List candidates with summary profiles (top skills, contact info, CV link).
- Candidate detail profiles include education, experience, projects, and extracted skills.

### 4) AI-Assisted Candidate-Job Matching

- Given a candidate + a job posting, invoke **Gemini** using a prompt to:
  - Generate a **matching score**
  - Produce a short **summary**
  - Highlight **red flags**
  - Suggest **interview questions**

### 5) Candidate Sourcing (LinkedIn / GitHub)

- Use Nanobrowser agent flows to automatically search for profiles that match job criteria.
- Scrape public profile signals (open to work, tech stack, role/title) to build a candidate lead list.
- Enrich the candidate pool without manual searching.

### 6) Automated Outreach & Scheduling

- Generate personalized outreach emails using AI templates and candidate/job context.
- Schedule or send emails directly via integrated email service.
- Track outreach status and follow-ups in the platform.

### 7) Auth & Security

- Token-based authentication (JWT stored in HTTP-only cookie).
- Endpoints guarded with an auth middleware.

---

## 🏗️ Architecture Overview

This is a small monorepo with two main apps:

- `backend/` — Node.js + Express API server
- `frontend/` — React (Vite) client UI

Additionally, the repo contains tooling and references to Nanobrowser (browser extension agent flow) inside `nanobrowser/`, which is used for automated web browsing as part of the recruitment workflow.

### Backend (Core Logic)

- **Express** routes are in `backend/src/interface/http/routes`.
- **Use cases** implement business logic in `backend/src/application/use-cases`.
- **Domain entities** and type definitions are in `backend/src/domain/entities`.
- **Repositories** (MongoDB) are in `backend/src/infrastructure/database/repositories`.
- **External services** (Gemini, Cloudinary, email, token, password hashing) are in `backend/src/infrastructure/external-service`.
- **AI prompts** are stored in `backend/src/prompts/`.

### Frontend

- Uses **React + Vite** to render admin / client dashboards.
- Routes and pages are split between `frontend/src/pages/admin` and `frontend/src/pages/client`.
- Authentication handled via cookie-based token.

---

## 🧩 Key Directories (Quick Reference)

### Backend

- `src/index.ts` — server entrypoint
- `src/interface/http/routes` — REST API endpoints
- `src/application/use-cases` — business logic
- `src/infrastructure/external-service` — AI + cloud services
- `src/domain/entities` — data model classes + DTOs

### Frontend

- `src/pages/` — UI pages
- `src/components/` — reusable UI components
- `src/services/` — API clients / request helpers

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, Mongoose (MongoDB), Gemini (AI)
- **Frontend:** React, Vite, React Router, Axios
- **AI Engine:** Google Gemini (via `@google/genai`)
- **Storage:** MongoDB
- **File Upload:** Multer (in-memory)
- **Authentication:** JWT with HTTP-only cookie

---

## ⚙️ Environment Variables (Backend)

Backend expects the following variables (see `backend/.env.example`):

- `PORT` — server port (default 5050)
- `ACCESS_TOKEN_SECRET` — JWT signing secret
- `MONGODB_URI` — MongoDB connection string

- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — (optional) for file hosting
- `MAIL_USER`, `PASSWORD_USER` — (optional) for sending email / OTP

- `GEMINI_API_KEY` — required for AI calls
---

## 🧪 Key API Endpoints

### Auth
- `POST /auth/login` — login, returns JWT cookie
- `POST /auth/logout` — clear cookie

### Upload / CV
- `POST /upload/cv` — upload CV, parse via AI, create candidate record

### Job Management
- `GET /job` — list jobs
- `POST /job/create` — create job
- `PATCH /job/update/:id` — update job
- `DELETE /job/delete/:id` — delete job

### Candidate & AI
- `GET /candidates` — list candidate summaries
- `POST /ai` — analyze candidate vs. job and return AI assessment

_Last updated: March 2026_
