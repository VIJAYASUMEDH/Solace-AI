# 🌿 Solace AI — Your Personal Wellness Companion

Solace AI is an AI-powered wellness companion designed to help users reflect on their emotions, track their moods, maintain a personal journal, and practice guided breathing exercises.

Built with React Native, Expo, Node.js, and Google's Gemini API, Solace aims to provide a friendly and supportive digital space for everyday emotional well-being.

## ✨ Features

- **AI Companion:** Chat with an AI wellness companion for supportive conversations.
- **Mood Tracking:** Record your moods and review your recent mood history.
- **Personal Journal:** Write, save, and delete personal journal entries.
- **Saved User Memory:** Save your name, communication preferences, and personal preferences to personalize AI responses.
- **Guided Breathing:** Follow an animated breathing exercise with timed inhale, hold, exhale, and rest phases.
- **Persistent Storage:** Save personal information and entries locally using AsyncStorage.
- **Cross-Platform Navigation:** Navigate between Home, Journal, Companion, and Profile screens.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application framework |
| Expo | Development and app tooling |
| TypeScript | Type-safe application development |
| Expo Router | Application navigation |
| AsyncStorage | Local data persistence |
| Node.js | Backend runtime |
| Express.js | Backend API |
| Google Gemini API | AI-powered conversations |

## 📁 Project Structure

```text
Solace/
├── src/
│   ├── app/
│   │   ├── index.tsx
│   │   ├── journal.tsx
│   │   ├── companion.tsx
│   │   ├── profile.tsx
│   │   └── _layout.tsx
│   └── components/
├── server/
│   ├── index.js
│   └── package.json
├── assets/
├── package.json
├── app.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Git
- Expo-compatible development environment
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Solace
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the backend

Open a separate terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace the placeholder with your own Gemini API key.

**Important:** Never commit your `.env` file or publish your API key.

### 4. Start the backend

From the `server` directory:

```bash
npm start
```

The backend runs on port 3000 by default.

### 5. Start the frontend

Open another terminal in the project root:

```bash
npm start
```

Follow the Expo instructions to open the application in your browser or a compatible mobile development environment.

For mobile testing, make sure the frontend is configured to reach the backend using your computer's network address when necessary.

## 🔐 Privacy and Safety

- User profile memory, mood history, chat history, and journal entries are stored locally using AsyncStorage.
- Saved profile memory can be deleted independently of conversation history.
- The Gemini API key belongs in the backend environment file, never in frontend code.
- Solace AI is a wellness companion, not a medical professional or a substitute for professional mental health care.
- Avoid entering highly sensitive personal information.

## 🎯 Project Goal

The goal of Solace AI is to explore how artificial intelligence can support everyday emotional reflection and wellness through accessible, personalized digital experiences.

## 🔮 Future Improvements

- More detailed mood analytics and visualizations.
- Additional guided breathing and mindfulness exercises.
- Improved privacy controls and secure data management.
- User authentication and optional cloud synchronization.
- More personalization and accessibility features.

## 👨‍💻 Developer

**Sumedh**

Aspiring AI Engineer | Learning and building with Python, AI, and machine learning.

---

*Built with curiosity, learning, and the intention to make everyday wellness more accessible.* 🌿