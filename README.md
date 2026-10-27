# 🔍 AI Mystery Room

An interactive, AI-powered mystery investigation game built with React, Vite, Node.js, Express, MongoDB, and the Google Gemini API. Players step into the shoes of a detective: examine crime scenes, interview suspects, uncover hidden clues, request strategic hints, and accuse the culprit to solve the case!

---

## 🚀 Features

- **Dynamic Mystery Generation**: AI-generated stories, suspects, motives, alibis, clues, and hidden culprits tailored by difficulty level (Easy, Medium, Hard).
- **Interactive Investigation Room**:
  - Suspect profiles with interrogation dialogues and alibis.
  - Interactive clue cards with discovery mechanics.
  - Contextual hints with score penalties for strategic problem-solving.
- **Accusation & Verdict**:
  - Secure backend validation (culprit identity is protected until final accusation).
  - Detailed case debriefing with complete breakdown, culprit motive, and performance score.
- **Modern & Immersive UI**: Dark detective noir aesthetic with glassmorphism, responsive design, and celebratory particle animations.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + Vite
  - React Router DOM
  - Lucide React (Icons)
  - Canvas Confetti
  - Axios
- **Backend**:
  - Node.js + Express (ES Modules)
  - MongoDB + Mongoose
  - Google Gemini API (`@google/genai` / `@google/generative-ai`)
  - Zod & CORS

---

## 📁 Project Structure

```text
AI-Mystery-Room/
├── client/                 # Frontend React + Vite application
│   ├── public/             # Static assets
│   ├── src/                # React source code (components, pages, styles)
│   ├── package.json
│   └── vite.config.js
├── server/                 # Backend Node.js + Express API
│   ├── src/                # Express controllers, models, routes, and services
│   ├── .env.example        # Environment variable template
│   └── package.json
├── spec.md                 # Project technical specification
├── .gitignore              # Git ignore rules for root, client, and server
└── README.md               # Project documentation
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)
- [Google Gemini API Key](https://aistudio.google.com/)

---

### 1. Server Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/ai-mystery-room
   GEMINI_API_KEY=your_gemini_api_key_here
   CLIENT_URL=http://localhost:5173
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

### 2. Client Setup

1. Open a separate terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend app will run on `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cases` | Generate a new mystery using Gemini |
| `GET` | `/api/cases/:id` | Retrieve an active mystery investigation |
| `POST` | `/api/cases/:id/clues/:clueId/discover` | Unlock/discover a specific clue |
| `POST` | `/api/cases/:id/hints` | Request a strategic hint |
| `POST` | `/api/cases/:id/accuse` | Submit the final accusation |
| `GET` | `/api/cases/:id/result` | Retrieve the completed mystery case debrief |

---

## 📜 License

This project is open source and available under the [ISC License](LICENSE).
