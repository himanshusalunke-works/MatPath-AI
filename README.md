# मतपथ AI (MatPath AI) 🗳️

**Empowering Every Indian Voter through AI-Driven Guidance.**

MatPath AI is a premium, multilingual platform designed to modernize the Indian voting experience. By combining heritage-inspired design with cutting-edge Google Cloud and AI technologies, we provide voters with a personalized, step-by-step journey from registration to the polling booth.

---

## ✨ Features

- **🏆 Personalized Voter Journey**: A dynamic dashboard that tracks your readiness based on your registration status and local constituency.
- **🎙️ Multilingual AI Voice Assistant**: Ask questions in your native language (Hindi, Marathi, Tamil, or English) and receive instant voice responses.
- **📍 Polling Booth Finder**: Integrated maps to help you locate your assigned polling station and get directions instantly.
- **📅 Interactive Election Timeline**: Stay informed about critical milestones, from registration deadlines to result declarations, tailored to your location.
- **📚 Premium Education Module**: A visually engaging, step-by-step guide to the voting process, complete with audio narration.
- **🌍 Full Internationalization (i18n)**: 100% localized interface across 4 major Indian languages.

---

## 🚀 Google Cloud & Google Features Integration

MatPath AI leverages the power of the Google ecosystem to provide a secure, scalable, and accessible experience:

- **🔥 Firebase Authentication**: Secure user login via Google Sign-In and Email/Password, ensuring a seamless onboarding experience.
- **☁️ Cloud Firestore**: Real-time NoSQL database used to persist user profiles, voter journey progress, and personalized settings.
- **🗺️ Google Maps Platform**: Interactive maps with customized markers for polling booths, providing real-time location services and routing.
- **🎤 Google Cloud Speech-to-Text**: Powers the "Listen & Speak" feature, accurately converting regional Indian languages into text for our AI.
- **🔊 Google Cloud Text-to-Speech**: Delivers high-fidelity, natural-sounding voice responses in multiple Indian accents and languages.
- **⚡ Google Cloud Run**: Fully managed serverless deployment for both the React frontend and Node.js backend, ensuring high availability and automatic scaling.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS (V4), Vite, Framer Motion, i18next.
- **Backend**: Node.js, Express, Groq SDK (Llama 3.3).
- **DevOps**: Docker, Google Cloud Run, GitHub Actions.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Firebase Project
- Google Cloud Service Account (with STT/TTS enabled)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/himanshusalunke-works/MatPath-AI.git
   cd MatPath-AI
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with GROQ_API_KEY and Firebase credentials
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with VITE_FIREBASE_* keys
   npm run dev
   ```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🤝 Acknowledgments

- Built for the **Google Cloud x AI Hackathon**.
- Inspired by the rich cultural heritage of India and the spirit of democracy.
