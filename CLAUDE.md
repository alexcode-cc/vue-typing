# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 Typing Practice - A web-based typing practice application with difficulty levels, real-time statistics, and local leaderboard persistence.

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management (Pinia)

All application state is centralized in `src/stores/typingStore.js`. Key patterns:
- Uses Composition API `defineStore` with setup syntax
- State is reactive with `ref()`, computed values with `computed()`
- Actions are synchronous functions for state mutations
- Computed values (wpm, accuracy, timeElapsed) are read-only

**Important State:**
- `difficulty` - Current difficulty level ('easy', 'medium', 'hard')
- `currentText` - The text to type (50 chars for easy, 30 for medium, 20 for hard)
- `userInput` - User's typed input
- `isTyping` - Whether typing session is active
- `startTime/endTime` - Timestamps for timing session

**Computed Logic:**
- `wpm` = (words / minutes) - words are space-separated segments
- `accuracy` = (correctChars / totalChars) * 100
- `timeElapsed` - seconds since start

### Data Flow

1. **Difficulty Selection** → `selectDifficulty(level)` in store
2. **Generate Text** → `generateText(difficulty)` pulls from `WORD_LIBRARIES`
3. **Typing Input** → User types in textarea → `updateInput(val)` in store
4. **Real-time Display** → TypingBox.vue watches `displayText` computed property
5. **Completion** → When `userInput.length === currentText.length`, store calls `endTyping()`
6. **Persistence** → `endTyping()` saves to localStorage keys `typingStatsHistory` and `typingLeaderboard`

### Component Structure

- **App.vue** - Layout container with grid layout (2:1 ratio)
- **TypingBox.vue** - Main typing interface, handles input/display
- **StatsPanel.vue** - Displays computed stats (WPM, accuracy, timer)
- **DifficultySelector.vue** - Radio buttons for difficulty levels
- **Leaderboard.vue** - Reads from store's `getLeaderboard()` and displays top 10 per difficulty

### Data Storage

All data persisted in localStorage:
- `typingStatsHistory` - Array of {date, difficulty, wpm, accuracy, time}
- `typingLeaderboard` - Object keyed by difficulty with arrays of entries

### Word Libraries

Located in `src/data/wordLibraries.js`:
- `WORD_LIBRARIES` - Object with easy/medium/hard word arrays
- `DIFFICULTY_CONFIG` - Labels, char counts, and color config for UI

### Styling

Tailwind CSS with a zinc/dark theme. Key utility classes:
- `bg-zinc-900/50` - Semi-transparent dark backgrounds
- `border-zinc-700/50` - Subtle borders
- `text-zinc-400/600` - Muted text colors
- `animate-pulse` - Cursor animation in TypingBox

### Key Computed Properties in Components

**TypingBox.vue:**
- `displayText` - Maps currentText and userInput to arrays of {char, status} for color-coded display
- Status: 'correct' (green), 'incorrect' (red), 'pending' (zinc-600), 'cursor' (pulse)