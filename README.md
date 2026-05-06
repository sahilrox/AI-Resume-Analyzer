# 🔍 SkillScan AI

AI-powered resume analyzer that evaluates a resume against a job description using **LLMs and semantic matching**.

---

## ✨ Features

* 📄 Upload resume (PDF)
* 🔍 AI-based resume analysis using LLMs
* 📊 Match score (0–100)
* 🔗 Semantic similarity scoring
* ⚠️ Missing skills detection
* 💪 Strengths identification
* 🧠 Actionable improvement suggestions
* 🌐 Full-stack deployed application

---

## 🧱 Tech Stack

### Frontend

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS

### Backend

* .NET 8 Web API
* Clean Architecture
* Dependency Injection

### AI & Processing

* OpenAI API (LLM + embeddings)
* Resume parsing service (Python + FastAPI)

### Deployment

* Frontend → Vercel
* Backend → Render (Docker)
* Parser → Render (Python service)

---

## 🏗️ Architecture

User → Frontend (Next.js) → Backend (.NET API)
                  ↘ Resume Parser (Python)
                  ↘ OpenAI API

---

## 📸 Demo

👉 Live App: https://ai-resume-analyzer-peach-iota.vercel.app/
👉 API: https://ai-resume-analyzer-f1nd.onrender.com/

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/AI-Resume-Analyzer.git
cd AI-Resume-Analyzer
```

---

### 2. Frontend

```bash
cd frontend/resume-analyzer-ui
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

### 3. Backend (.NET)

```bash
cd backend/ResumeAnalyzer.API
dotnet restore
dotnet run
```

Add to `appsettings.json`:

```json
"OpenAI": {
  "ApiKey": "your-api-key"
}
```

---

### 4. Resume Parser (Python)

```bash
cd parser
pip install -r requirements.txt
uvicorn app:app --reload
```

---

## 🚀 Deployment Guide

### Frontend (Vercel)

* Root Directory: `frontend/resume-analyzer-ui`
* Add environment variable:

  * `NEXT_PUBLIC_API_URL`

---

### Backend (Render)

* Use Docker deployment
* Add environment variable:


### Parser (Render - Python)

* Runtime: Python 3
* Start command:

```bash
uvicorn app:app --host 0.0.0.0 --port 10000
```

---

## 🔍 Key Highlights

* Full-stack system with microservices
* LLM integration with structured JSON output
* Semantic similarity using embeddings
* Clean and responsive UI
* Deployed across multiple services

---

## 🧠 Future Improvements

* 📊 Skill gap visualization (charts)
* 📄 Export analysis as PDF
* 🌙 Dark mode
* 🔍 RAG-based job recommendations

---

## 👨‍💻 Author

Sahil Nayak
Software Engineer | Full Stack | AI/ML

---
