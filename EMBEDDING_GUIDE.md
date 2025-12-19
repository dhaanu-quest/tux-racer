# TuxRacer Embedding Guide

This guide shows you how to embed TuxRacer.js into different types of applications.

## Table of Contents
- [Quick Start](#quick-start)
- [Vanilla HTML/JavaScript](#vanilla-htmljavascript)
- [React](#react)
- [Vue.js](#vuejs)
- [Angular](#angular)
- [Next.js](#nextjs)
- [Electron Desktop App](#electron-desktop-app)
- [Mobile Apps (Cordova/Capacitor)](#mobile-apps)

---

## Quick Start

### Step 1: Build the Game

```bash
cd tux-racer-js-main
npm install
npm run build
```

This creates a `dist` folder with all the game files.

### Step 2: Host the Game Files

Copy the `dist` folder to your web server or app's public directory.

### Step 3: Embed with iframe

```html
<iframe 
  src="/path/to/dist/index.html?course=bunny-hill" 
  width="800" 
  height="600"
  frameborder="0">
</iframe>
```

---

## Vanilla HTML/JavaScript

### Basic Embedding

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App with TuxRacer</title>
  <style>
    #game-frame {
      width: 100%;
      height: 600px;
      border: none;
    }
  </style>
</head>
<body>
  <h1>Play TuxRacer</h1>
  
  <!-- Embed the game -->
  <iframe 
    id="game-frame" 
    src="./tuxracer/index.html?course=bunny-hill">
  </iframe>

  <script>
    const iframe = document.getElementById('game-frame');
    
    iframe.addEventListener('load', () => {
      const gameWindow = iframe.contentWindow;
      
      // Configure score tracking
      gameWindow.TuxRacerScoreTracker.configure({
        onScoreSubmit: (score) => {
          console.log('Score:', score);
          // Send to your backend
          saveScore(score);
        }
      });
    });

    function saveScore(score) {
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(score)
      });
    }
  </script>
</body>
</html>
```

---

## React

### Option 1: Using iframe Component

```jsx
import React, { useEffect, useRef, useState } from 'react';

function TuxRacerGame() {
  const iframeRef = useRef(null);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const iframe = iframeRef.current;
    
    const handleLoad = () => {
      const gameWindow = iframe.contentWindow;
      
      // Configure score tracking
      gameWindow.TuxRacerScoreTracker.configure({
        onScoreSubmit: (scoreData) => {
          console.log('Score received:', scoreData);
          setScores(prev => [...prev, scoreData]);
          
          // Send to backend
          fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scoreData)
          });
        },
        logToConsole: true
      });
    };

    iframe.addEventListener('load', handleLoad);
    
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className="game-container">
      <h1>TuxRacer Game</h1>
      
      <iframe
        ref={iframeRef}
        src="/tuxracer/index.html?course=bunny-hill"
        width="100%"
        height="600px"
        frameBorder="0"
        title="TuxRacer Game"
      />

      <div className="scores">
        <h2>Recent Scores</h2>
        {scores.map((score, idx) => (
          <div key={idx}>
            Course: {score.course} | Time: {score.timeSeconds}s | Items: {score.itemsCollected}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TuxRacerGame;
```

### Option 2: Reusable Component

```jsx
// TuxRacer.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TuxRacer = ({ course = 'bunny-hill', environment = 'sunny', onScore, width = '100%', height = '600px' }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    
    const handleLoad = () => {
      const gameWindow = iframe.contentWindow;
      
      if (gameWindow.TuxRacerScoreTracker) {
        gameWindow.TuxRacerScoreTracker.configure({
          onScoreSubmit: onScore,
          logToConsole: process.env.NODE_ENV === 'development'
        });
      }
    };

    iframe?.addEventListener('load', handleLoad);
    
    return () => {
      iframe?.removeEventListener('load', handleLoad);
    };
  }, [onScore]);

  const gameUrl = `/tuxracer/index.html?course=${course}&environment=${environment}`;

  return (
    <iframe
      ref={iframeRef}
      src={gameUrl}
      width={width}
      height={height}
      frameBorder="0"
      title="TuxRacer Game"
      style={{ display: 'block' }}
    />
  );
};

TuxRacer.propTypes = {
  course: PropTypes.string,
  environment: PropTypes.string,
  onScore: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default TuxRacer;
```

Usage:
```jsx
import TuxRacer from './components/TuxRacer';

function App() {
  const handleScore = (scoreData) => {
    console.log('Score:', scoreData);
    // Save to your backend
  };

  return (
    <div>
      <TuxRacer 
        course="bunny-hill" 
        environment="night"
        onScore={handleScore}
      />
    </div>
  );
}
```

---

## Vue.js

### Vue 3 Composition API

```vue
<template>
  <div class="tuxracer-container">
    <h1>TuxRacer Game</h1>

    <iframe
      ref="gameFrame"
      :src="gameUrl"
      width="100%"
      height="600px"
      frameborder="0"
      @load="onGameLoad"
    />

    <div v-if="lastScore" class="score-display">
      <h2>Last Score</h2>
      <p>Course: {{ lastScore.course }}</p>
      <p>Time: {{ lastScore.timeSeconds.toFixed(2) }}s</p>
      <p>Items: {{ lastScore.itemsCollected }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  course: { type: String, default: 'bunny-hill' },
  environment: { type: String, default: 'sunny' }
});

const emit = defineEmits(['score']);
const gameFrame = ref(null);
const lastScore = ref(null);

const gameUrl = computed(() =>
  `/tuxracer/index.html?course=${props.course}&environment=${props.environment}`
);

const onGameLoad = () => {
  const gameWindow = gameFrame.value?.contentWindow;

  if (gameWindow?.TuxRacerScoreTracker) {
    gameWindow.TuxRacerScoreTracker.configure({
      onScoreSubmit: handleScore,
      logToConsole: true
    });
  }
};

const handleScore = async (scoreData) => {
  lastScore.value = scoreData;
  emit('score', scoreData);

  // Send to backend
  await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData)
  });
};
</script>
```

---

## Angular

```typescript
// tuxracer.component.ts
import { Component, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tuxracer',
  template: `
    <iframe #gameFrame [src]="gameUrl" width="100%" height="600px"
            frameborder="0" (load)="onGameLoad()"></iframe>
  `
})
export class TuxracerComponent {
  @ViewChild('gameFrame') gameFrame!: ElementRef<HTMLIFrameElement>;
  @Input() course = 'bunny-hill';
  @Output() scoreSubmitted = new EventEmitter();

  constructor(private http: HttpClient) {}

  get gameUrl() {
    return `/tuxracer/index.html?course=${this.course}`;
  }

  onGameLoad() {
    const gameWindow = this.gameFrame.nativeElement.contentWindow as any;

    if (gameWindow?.TuxRacerScoreTracker) {
      gameWindow.TuxRacerScoreTracker.configure({
        onScoreSubmit: (scoreData: any) => {
          this.scoreSubmitted.emit(scoreData);
          this.http.post('/api/scores', scoreData).subscribe();
        }
      });
    }
  }
}
```

---

## Next.js

```jsx
// app/game/page.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function GamePage() {
  const iframeRef = useRef(null);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleLoad = () => {
      iframe?.contentWindow?.TuxRacerScoreTracker?.configure({
        onScoreSubmit: async (scoreData) => {
          setScores(prev => [...prev, scoreData]);

          await fetch('/api/scores', {
            method: 'POST',
            body: JSON.stringify(scoreData)
          });
        }
      });
    };

    iframe?.addEventListener('load', handleLoad);
    return () => iframe?.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div>
      <iframe ref={iframeRef} src="/tuxracer/index.html"
              className="w-full h-[600px]" />
    </div>
  );
}
```

---

## Electron Desktop App

```javascript
// main.js
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

```html
<!-- index.html -->
<iframe id="game" src="./tuxracer/index.html"></iframe>

<script>
  document.getElementById('game').addEventListener('load', (e) => {
    e.target.contentWindow.TuxRacerScoreTracker.configure({
      onScoreSubmit: (score) => {
        // Save to local storage or file
        localStorage.setItem('scores', JSON.stringify(score));
      }
    });
  });
</script>
```

---

## Available Courses & Environments

### Courses
- `bunny-hill`
- `frozen-river`
- `challenge-one`
- `path-of-daggers`
- (check `src/game/course/course-configs.ts` for full list)

### Environments
- `sunny` (default)
- `night`
- `cloudy`

### Example URLs
```
/tuxracer/index.html?course=frozen-river&environment=night
/tuxracer/index.html?course=bunny-hill&environment=cloudy
```

---

## Quick Checklist

- [ ] Build the game: `npm run build`
- [ ] Copy `dist` folder to your app's public directory
- [ ] Embed using `<iframe>`
- [ ] Wait for iframe `load` event
- [ ] Configure `TuxRacerScoreTracker`
- [ ] Handle score submissions
- [ ] Test on your target platform

---

## Troubleshooting

**Q: TuxRacerScoreTracker is undefined**
A: Make sure you wait for the iframe `load` event before accessing it.

**Q: Scores not being received**
A: Check browser console for errors. Ensure the callback is configured before the game ends.

**Q: Game not loading**
A: Check the path to the dist folder. Use browser DevTools Network tab to debug.

**Q: CORS errors**
A: Serve the game from the same domain or configure CORS headers properly.

