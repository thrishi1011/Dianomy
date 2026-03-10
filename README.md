# DIANOMY — Campus Last-Mile Delivery

**DIANOMY** is a student-driven, last-mile delivery platform designed specifically for the NITW campus. It bridges the gap between the campus gate and hostel rooms, allowing students to request and fulfill deliveries within their own community.

---

## 🚀 Vision
Built by students, for students. DIANOMY empowers the campus community by providing a seamless, secure, and efficient way to get packages delivered from the gate to the hostel, all while enabling students to earn or help others during their routine commutes.

## 🛠️ Tech Stack
- **Frontend**: Pure HTML5, CSS3 (Glassmorphism, Custom Properties, Responsive Design), and Vanilla JavaScript.
- **Backend-as-a-Service**: **Firebase** (Authentication & Cloud Firestore) for real-time data and secure access.
- **Interactive UI**: 
    - **Canvas API**: Dynamic particle backgrounds.
    - **Web Audio API**: Immersive UI sound effects.
    - **Animations**: Custom CSS keyframes and transitions for a premium feel.

## 📦 Project Structure
```text
dianomy/
├── frontend/
│   ├── css/
│   │   ├── main.css          # Layouts, resets, and utility classes
│   │   ├── animations.css    # UI motion and transitions
│   │   ├── responsive.css    # Mobile-first media queries
│   │   └── themes.css        # Adaptive dark/light theme tokens
│   ├── js/
│   │   ├── app.js            # Main entry & global state management
│   │   ├── router.js         # Custom hash-based SPA router
│   │   ├── auth.js           # Google Auth & student domain validation
│   │   ├── verify-phone.js   # Firebase Phone Auth / OTP logic
│   │   ├── dashboard.js      # Order management for Requesters
│   │   ├── offers.js         # Runner mode — find and accept orders
│   │   ├── profile.js        # Student profile & data persistence
│   │   ├── settings.js       # App preferences & sound controls
│   │   └── utils.js          # Shared helper functions
│   └── assets/               # SVGs, Icons, and visual assets
├── backend/
│   └── js/
│       ├── firebase-config.js # Firebase initialization & API keys
│       ├── storage.js        # Persistent state helpers
│       ├── data.js           # Firestore data models & interactions
│       └── notifications.js  # Real-time toast system
├── design/                   # Core Design System (Tokens & Components)
├── index.html                # Single Page Application Entry
├── .firebaserc               # Firebase project mapping
├── firebase.json             # Hosting & rules configuration
└── README.md                 # Project Documentation
```

## ✨ Key Features
- **Secure Campus Login**: Restricted authentication for `@student.nitw.ac.in` accounts using **Google Sign-in**.
- **Verified Deliveries**: Integrated **Phone Verification (OTP)** to ensure trust and reliability between users.
- **Dynamic Dashboard**: Requesters can post, track, and manage their delivery orders in real-time.
- **Runner Mode**: Students can switch to 'Runner' mode to browse available requests and earn rewards.
- **Smart Order Lifecycle**: Comprehensive tracking through `Accepted`, `Pending`, `Delivered`, and `Not Delivered` statuses.
- **Privacy-First Design**: Sensitive order details for delivered items are restricted to the involved parties.
- **Premium Experience**: A stunning **Dark Glassmorphism** interface with animated backgrounds and haptic-like sound feedback.

## 🛠️ Getting Started
DIANOMY is built as a lightweight SPA. Since it uses Firebase, a local web server is recommended for the best experience (to handle Auth redirects correctly).

1. Clone the repository.
2. Serve the root directory using a local server (e.g., VS Code Live Server).
3. Open the local URL in your browser.

---
© 2026 DIANOMY. **Efficiency. Community. Delivery.**
