Here’s your **fully updated, clean, and hackathon-ready README** with the correct naming:

---

# 🗳️ MatPath AI (मत Path AI)

### *Empowering Every Indian Voter through AI-Driven Guidance*

<p align="center">
  🇮🇳 • 🤖 • 🗺️ • 🎙️ • ⚡
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Google%20Cloud-Run-orange?logo=google-cloud" />
  <img src="https://img.shields.io/badge/Firebase-Auth-yellow?logo=firebase" />
  <img src="https://img.shields.io/badge/Groq-AI-purple" />
</p>

---

## 🚀 Overview

**MatPath AI (मत Path AI)** is a multilingual, AI-powered civic platform designed to simplify the Indian election process.

It transforms complex voting procedures into a **personalized, interactive journey**, helping every citizen understand and confidently participate in elections.

---

## ✨ Features

### 🏆 Personalized Voter Journey
* Step-by-step guidance based on user profile
* Real-time progress tracking
* Smart readiness indicators

---

### 🎙️ Multilingual AI Voice Assistant
* Supports Hindi, Marathi, Tamil, and English
* Natural language interaction
* **Native Language Quick-Prompts**: Get started instantly with localized demo questions

---

### 🛡️ Privacy & Session Control
* **Manual Reset**: Clear history anytime via the chat menu
* **Auto-Purge**: Automatic history deletion on logout for maximum privacy
* Secure session-based Firestore synchronization

---

### 📍 Polling Booth Finder
* Interactive map integration with real-time location seeding
* Locate nearest polling station using EPIC ID or location
* Get directions via Google Maps API

---

### 📅 Interactive Election Timeline
* Personalized election schedule
* Important deadlines & reminders
* Location-based updates

---

### 📚 Guided Learning Module
* Step-by-step explanation of voting process
* **Interactive CTA**: Premium "Ready to Vote" card with dynamic animations
* Audio-assisted learning in 4 languages

---

### 🌍 Full Internationalization (i18n)
* Fully localized interface
* Multi-language support
* Accessibility-first design

---

## ☁️ Google Cloud Integration

MatPath AI is built using a scalable and secure Google Cloud ecosystem:

* 🔐 Firebase Authentication → Secure login (Google + Phone)
* 🗄️ Cloud Firestore → Real-time database
* 🗺️ Google Maps Platform → Polling booth & navigation
* 🎤 Speech-to-Text → Voice input
* 🔊 Text-to-Speech → Voice output
* ⚡ Cloud Run → Serverless deployment

---

## 🤖 AI Stack

* ⚡ Groq API (LLaMA 3 70B)
* Real-time conversational AI
* Multilingual system prompt guardrails
* Session-aware context memory

---

## 🛠️ Tech Stack

### Frontend
* React 19
* Tailwind CSS v4
* Vite
* Framer Motion
* i18next

### Backend
* Node.js / Express
* Groq SDK
* Firebase Admin SDK

### DevOps
* Docker
* Google Cloud Run
* GitHub Actions

---

## 🌐 Live Demo

* 🔗 **Frontend**
  [https://matpath-frontend-898253091340.us-central1.run.app](https://matpath-frontend-898253091340.us-central1.run.app)

* 🔗 **Backend**
  [https://matpath-backend-898253091340.us-central1.run.app](https://matpath-backend-898253091340.us-central1.run.app)

---

## 🧪 Testing

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

✔ Unit Tests
✔ API Tests
✔ Component Tests

---

## 📦 Installation & Setup

### Prerequisites

* Node.js (v18+)
* Firebase Project
* Google Cloud Project
* Groq API Key

---

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
GROQ_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project
GOOGLE_MAPS_API_KEY=your_key
```

```bash
npm run dev
```

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Security & Reliability

* API keys stored in environment variables
* Backend handles sensitive operations
* Firebase Authentication for secure access
* Cloud Run IAM-based authentication
* **API Rate Limiting:** Built-in `express-rate-limit` to prevent abuse and DDoS.
* **Strict CORS & Payload Limits:** Explicitly secured cross-origin requests and capped JSON bodies (`10kb`) for enhanced stability.

---

## 🏆 Why This Project Stands Out

* ⚡ **Ultra-fast AI** with Groq
* ♿ **Accessibility-first** (voice + multilingual ARIA labels)
* ☁️ **Fully serverless architecture**
* 🇮🇳 **India-focused civic impact**
* 🧩 **Clean modular design** with robust `PropTypes` and JSDoc validation.
* 🚀 **Highly Optimized React:** Critical components use `React.memo` for maximum rendering efficiency.
* 🧪 **Comprehensive Testing:** Frontend utilizes Vitest for component-level stability.

---

## 🎯 One-Line Pitch

> *MatPath AI (मत Path AI) guides every Indian citizen through the election process with clarity, speed, and accessibility using AI and Google Cloud.*

---

## 📄 License

MIT License

---

## 🤝 Acknowledgments

* Built for **Virtual Promptwars Hackathon**
* Inspired by India’s democratic spirit 🇮🇳

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🚀 Contribute
