# 🗺️ FCAHPT Campus Navigate

> The official interactive campus navigation system for the **Federal College of Animal Health and Production Technology, Vom** — Plateau State, Nigeria.

---

## ✨ Features

- 🗺️ **Interactive Google Map** with satellite & road map toggle
- 📍 **Categorized Pins** with emoji icons (Academic 🎓, Clinic 🏥, Hostel 🛏️, Admin 🏛️, Facility 📍)
- 🔍 **Smart Search** with instant results
- 🏷️ **Category Filter Chips** to filter locations by type
- 🧭 **Dijkstra Pathfinding** for real campus road network routing
- 🔘 **Google Maps-style Action Buttons** (Directions, Share, Copy Coords)
- 🌙 **Dark / Light Mode** toggle
- 🔐 **Admin Dashboard** to manage the road network map
- ☁️ **Firebase Firestore** for real-time road network data

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/fcahpt-campus-map.git
cd fcahpt-campus-map
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example env file and fill in your own keys:
```bash
cp .env.example .env.local
```

Then open `.env.local` and add your keys:
| Variable | Where to get it |
|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | [Google Cloud Console](https://console.cloud.google.com/) |
| `VITE_FIREBASE_API_KEY` & others | [Firebase Console](https://console.firebase.google.com/) |

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Security

- **API keys are stored in `.env.local`** which is excluded from version control via `.gitignore`.
- **Never commit `.env.local`** or any file containing real API keys.
- The `.env.example` file is safe to commit — it contains only placeholder values.

---

## 🏗️ Tech Stack

| Tech | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Tailwind CSS | Styling |
| Google Maps API | Interactive map |
| Firebase Auth | Admin authentication |
| Firebase Firestore | Road network database |
| Dijkstra Algorithm | Campus pathfinding |
| Framer Motion | Animations |

---

## 👤 Admin Access

Navigate to `/admin` to log in as an administrator and use the **Road Network Editor** to draw nodes and edges across the campus map.

---

## 📄 License

© 2025 FCAHPT, Vom. All rights reserved.
