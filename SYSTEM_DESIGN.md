# 🏗️ GATE Master: System Design & Architecture

This document outlines the architectural design and data flow of the **GATE Master** application.

---

## 1. High-Level Architecture

The application follows a **Client-Side Heavy (Single Page Application)** architecture. Since it doesn't require a backend for basic features, all logic, state management, and data persistence happen within the user's browser.

```mermaid
graph TD
    User((User))
    UI[Frontend UI - HTML/CSS]
    Logic[JS Logic Engine - script.js]
    Storage[(LocalStorage)]
    API[External API - Google Gemini]
    Libs[Libraries - Chart.js, Particles.js]

    User -->|Interacts| UI
    UI -->|Triggers Events| Logic
    Logic -->|Saves/Reads| Storage
    Logic -->|Fetches Quiz| API
    Logic -->|Updates Data| Libs
    Libs -->|Renders UI| UI
```

---

## 2. Core Modules

### A. Quiz Engine
- **Responsibility**: Manages the quiz lifecycle (Start -> Question -> Answer -> Result).
- **Data Flow**: Pulls from `quizData` (Static) or Gemini API (Dynamic), calculates scores, and feeds results to the Storage Module.

### B. Gamification & XP System
- **Responsibility**: Calculates user Level, XP, and Streaks based on history.
- **Logic**: XP = Correct Answers * 10. Level = Floor(XP / 100) + 1.

### C. Analytics Module
- **Responsibility**: Visualizes performance history.
- **Library**: Uses **Chart.js** to map `quizHistory` from LocalStorage onto a line chart.

### D. AI Integration Layer
- **Responsibility**: Communicates with the Gemini Pro model.
- **Flow**: User Input -> Prompt Engineering -> Fetch -> JSON Parsing -> Quiz Injection.

---

## 3. Data Schema (LocalStorage)

The application uses key-value pairs in `localStorage` to persist state:

| Key | Format | Purpose |
|-----|--------|---------|
| `userName` | String | Stores user display name. |
| `quizHistory` | JSON Array | Array of objects `{subject, score, date}`. |
| `userStreak` | Integer | Consecutive days of activity. |
| `lastActiveDate` | Date String | Last date the user attempted a quiz. |
| `syllabusCompleted` | JSON Array | List of completed topics. |
| `theme` | String | 'light' or 'dark' preference. |

---

## 4. UI/UX Flow

```mermaid
sequenceDiagram
    participant U as User
    participant L as Landing Page
    participant Q as Quiz Engine
    participant S as Storage
    participant R as Result Page

    U->>L: Browse Subjects
    L->>U: Show AI Recommendation
    U->>L: Select Subject
    L->>Q: Initialize Quiz
    Q->>U: Show Question & Start Timer
    U->>Q: Submit Answer
    Q->>U: Show Feedback & Explanation
    Q->>Q: Repeat for N Questions
    Q->>S: Save History
    Q->>R: Display Final Score
    R->>U: Show XP Gained & Confetti
```

---

## 5. External Dependencies

1. **Google Gemini API**: For dynamic content generation.
2. **Chart.js**: For performance visualization.
3. **SweetAlert2**: For interactive popups and settings.
4. **Particles.js**: For aesthetic background animations.
5. **Canvas Confetti**: For gamification celebrations.

---

## 6. Scalability & Future Scope

- **Backend Integration**: Move `localStorage` to a **Node.js/MongoDB** backend for cross-device sync.
- **PWA (Progressive Web App)**: Add Service Workers for true offline capability.
- **Multiplayer Mode**: Implement **WebSockets** for real-time head-to-head quizzes.
- **Deep Analytics**: Predict user performance based on historical trends using ML.
