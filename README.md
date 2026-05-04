# SmartCrop — Smart Agricultural Decision Support System

A full-stack web application built to help Indian farmers make smarter decisions using real-time soil data, AI-powered crop advisory, disease detection, and a direct farmer marketplace.

---

## What This Project Does

Farming in India still relies heavily on guesswork — when to irrigate, which crop to grow, whether a disease is spreading. SmartCrop brings together live sensor data, weather forecasts, and AI guidance into one simple dashboard that any farmer can use.

---

## Features

### Dashboard
- Live soil data cards — moisture, temperature, and pH updated every 5 seconds via WebSocket
- Smart alerts when soil moisture drops below safe levels
- Market price trends for Wheat, Mustard, and Rice using interactive charts
- AI recommendations for crop selection, irrigation, and pest watch
- Quick access links to all modules

### Crop Advisory
- Current weather display with humidity, wind speed, and UV index
- 7-day weather forecast
- Actionable advisories — when to spray, when to pause irrigation, harvest windows
- Crop calendar showing sowing and harvest periods for Rabi and Kharif seasons

### Crop Disease Detection
- Upload a plant leaf photo by clicking, dragging and dropping, or pasting a screenshot directly with Ctrl+V
- Simulated AI analysis with confidence score
- Results include disease name, treatment strategy with specific chemical dosages, and prevention tips
- Covers Early Blight, Powdery Mildew, Leaf Rust, and healthy plant detection

### AI Chatbot
- Supports 12 Indian languages — English, Hindi, Punjabi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Odia, and Urdu
- Covers farming topics including weather, crop selection, pest control, market prices, irrigation, and fertilizers
- Voice input using the Web Speech API with language-specific recognition
- Quick question chips for fast interaction
- Responses based on real MSP 2024-25 government data

### Farmer Marketplace
- 12 crop listings across 7 categories — Grains, Pulses, Oilseeds, Spices, Vegetables, Cash Crops, Fiber
- Search by crop name or location, filter by category, sort by price or rating
- Add new listings with a form — saved permanently in browser storage
- Contact seller via WhatsApp message or call — works on both desktop and mobile, no API key needed

### Farm Management
- Task manager — add, complete, and delete farm tasks with priority levels and due dates
- Field tracker — view crop health, soil moisture, growth stage, and next recommended action for each field

### Authentication
- Secure register and login with JWT tokens
- Passwords hashed using bcrypt
- User data saved to a local JSON file — persists across server restarts
- Protected routes — dashboard is only accessible after login

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Charts | Recharts |
| Routing | React Router v7 |
| Backend | Node.js, Express.js |
| Real-time | Socket.io |
| Auth | JWT, bcryptjs |
| Storage | JSON file (backend), localStorage (frontend) |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm

### Installation

Clone the repository:
```bash
git clone https://github.com/antra1947/Smart-Agricultural-Decision-Support-System.git
cd Smart-Agricultural-Decision-Support-System
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Project

Open two terminals.

Terminal 1 — start the backend:
```bash
cd backend
node server.js
```

Terminal 2 — start the frontend:
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

On Windows PowerShell use a semicolon instead of `&&`:
```powershell
cd backend; node server.js
```

---

## Project Structure

```
smartcap/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Auth logic
│   ├── middleware/     # JWT protection
│   ├── models/         # User model with file persistence
│   ├── routes/         # API routes
│   ├── data/           # users.json (auto-created on first run)
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── components/ # Layout, Navbar, Sidebar, ProtectedRoute
        ├── context/    # Auth context
        ├── pages/      # All page components
        └── main.jsx    # App entry point
```

---

## Team

| Name | Role |
|------|------|
| Antra | Backend, Authentication, Full Stack Integration |
| Laveesha | Dashboard, Layout, UI/UX |
| Ayushi | AI Chatbot, Multi-language Support |
| Smita | Disease Detection, Image Processing |
| Shweta | Marketplace, Farm Management |

---

## License

This project was built as a capstone submission. Feel free to use it as a reference or build on top of it.
