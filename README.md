# DIANOMY — Campus Last-Mile Delivery

Student-driven last-mile delivery app. Gate to hostel, delivered by students.

## How to Run

Simply open `index.html` in your browser. No build tools, no `npm install`, no server required.

```
1. Double-click index.html
   — or —
   Open it in your browser via File > Open
```

## Project Structure

```
dianomy/
│
├── frontend/
│   ├── css/
│   │   ├── main.css          # Page layouts, reset, utilities
│   │   ├── animations.css    # Keyframes & transitions
│   │   ├── responsive.css    # Media queries
│   │   └── themes.css        # Dark/light theme tokens
│   ├── js/
│   │   ├── app.js            # Main entry, animated background, navbar
│   │   ├── router.js         # Hash-based SPA router
│   │   ├── auth.js           # Login / OTP page
│   │   ├── dashboard.js      # Delivery requests dashboard
│   │   ├── offers.js         # Runner mode (accept deliveries)
│   │   ├── profile.js        # User profile page
│   │   └── settings.js       # Sound effects & mute toggle
│   └── assets/
│       └── logo.svg          # App logo
│
├── backend/
│   └── js/
│       ├── storage.js        # SessionStorage auth helpers
│       ├── data.js           # Mock delivery data & user simulation
│       └── notifications.js  # Toast notification system
│
├── design/
│   ├── tokens.css            # Design tokens (colors, fonts, spacing)
│   └── components.css        # Reusable component styles
│
├── index.html                # Main entry point
├── .gitignore
└── README.md
```

## Technologies

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Glassmorphism, Gradients, Animations
- **Vanilla JavaScript** — No frameworks, no dependencies
- **Web Audio API** — UI sound effects
- **Canvas API** — Animated particle background

## Features

- 🎓 Campus email + OTP login (simulated)
- 📦 Post delivery requests
- 🏃 Runner mode — accept & deliver
- 👤 Auto-populated user profiles
- 🔊 Interactive sound effects
- ✨ Animated particle canvas background
- 🌙 Dark glassmorphism UI

© 2026 DIANOMY. Built by students, for students.
