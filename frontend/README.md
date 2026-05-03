# 🎨 MatPath AI Frontend

The frontend for MatPath AI is a high-performance React application built with **React 19**, **Vite**, and **Tailwind CSS v4**.

## 🚀 Key Features

- **Personalized Dashboard**: Track your voter readiness and upcoming election milestones.
- **Multilingual AI Chat**: Interactive assistant supporting English, Hindi, Marathi, and Tamil.
- **Polling Booth Locator**: Integrated Google Maps for finding your polling station.
- **Voter Education**: Step-by-step guides with premium interactive UI components.
- **Smart Timeline**: Personalized election dates based on your location.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS for premium effects
- **Animation**: Framer Motion & CSS keyframes
- **State Management**: React Context API
- **Authentication**: Firebase Auth (Google & Phone)
- **i18n**: react-i18next
- **Icons**: Heroicons

## 📦 Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=https://your-backend-url/v1
   VITE_FIREBASE_API_KEY=...
   ...
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Build & Deploy

To build the application for production:
```bash
npm run build
```

The application is containerized using Docker and deployed to **Google Cloud Run**.
