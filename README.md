# 🚀 GATE Master: The Ultimate Preparatory App

**GATE Master** is an ultra-premium, feature-rich web application designed for GATE (Graduate Aptitude Test in Engineering) aspirants. It combines interactive learning, behavioral gamification, and AI-powered tools to create a comprehensive study ecosystem.

---

## 🌟 Key Features

### 1. 🧠 Intelligent Quiz System
- **Subject-Wise Quizzes**: Targeted practice for core subjects like OS, DBMS, Algorithms, and Engineering Mathematics.
- **Full Mock Tests**: Randomized 10-question tests pulling from a diverse pool to simulate the exam environment.
- **AI Quiz Generator**: Integrated with **Google Gemini AI** to generate fresh, unlimited questions on any custom topic.
- **Explanations & Feedback**: Instant feedback with detailed explanations for every correct or incorrect answer.

### 2. 🎮 Advanced Gamification
- **Leveling & XP System**: Earn experience points (XP) for every correct answer and level up your profile.
- **Daily Streaks**: Encourages consistency with a visual 🔥 streak tracker.
- **Performance Analytics**: Interactive line charts (Chart.js) to track your progress over time.
- **Leaderboard**: View your recent attempts and best scores at a glance.

### 3. 🛠️ Essential Study Tools
- **Scientific Calculator**: A built-in virtual scientific calculator, essential for GATE numerical problems.
- **Syllabus Tracker**: An interactive checklist to monitor your progress across the complete GATE curriculum.
- **Pomodoro Timer**: A focus-boosting study timer with break reminders.
- **Revision Flashcards**: Quick conceptual cards for last-minute revision of core topics like Dijkstra’s or ACID properties.

### 4. 📚 Resources
- **PDF Notes Viewer**: Integrated PDF reader to access subject-wise comprehensive notes without leaving the app.
- **Dark/Light Mode**: Premium dark-theme by default with a sleek high-contrast light mode option.

---

## 🛠️ Technology Stack

- **Core**: Semantic HTML5, CSS3 (Modern Glassmorphism Design), Vanilla JavaScript (ES6+).
- **Gamification**: [Canvas Confetti](https://github.com/catdad/canvas-confetti) for celebration effects.
- **Visuals**: [Particles.js](https://vincentgarreau.com/particles.js/) for a dynamic background.
- **Analytics**: [Chart.js](https://www.chartjs.org/) for real-time performance tracking.
- **UI/UX**: [SweetAlert2](https://sweetalert2.github.io/) for premium alerts and profile settings.
- **AI Power**: [Google Gemini 1.5 Flash API](https://aistudio.google.com/app/apikey) for on-the-fly quiz generation.

---

## 🚀 How It Works

1. **Dashboard**: Upon entry, users see their Level, XP, and AI-driven subject recommendations based on their performance.
2. **Learning Loop**:
   - Select a **Subject** to start a quiz.
   - Use the **Scientific Calculator** for numerical calculations.
   - If stumped, check the **Notes Section** for that subject.
3. **Tracking**: Every attempt is saved to `localStorage`, updating the **Performance Chart** and the **Syllabus Tracker**.
4. **AI Generation**: If users want to practice specific sub-topics (e.g., "SQL Joins"), they can use the AI Generator to fetch fresh questions dynamically via the Gemini API.

---

## 📦 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, or Edge recommended).
- (Optional) A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey) to enable AI Quiz features.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/itssonam-0/GATE-Quiz-Notes-App.git
   ```
2. Navigate to the project folder:
   ```bash
   cd GATE-Quiz-Notes-App
   ```
3. Open `index.html` in your browser.

---

## 🎨 Design Philosophy
The app uses a **Luxury Dark Theme** inspired by modern SaaS platforms. 
- **Glassmorphism**: Semi-transparent cards with backdrop-blur effects.
- **Responsive Geometry**: Fully fluid layout that adapts from Ultra-wide monitors down to mobile devices.
- **Interactive Feedback**: Sound effects, vibrations (simulated), and visual cues for every user action.

---

## 🤝 Contribution
Contributions are welcome! Feel free to open issues or submit pull requests to add more subjects or improve the UI.

---

## ✨ Developed with ❤️ by Sonam
Elevate your preparation. Master the GATE.
