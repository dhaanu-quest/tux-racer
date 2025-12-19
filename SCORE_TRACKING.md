# Score Tracking Integration Guide

This guide explains how to integrate TuxRacer.js into your application and track user scores.

## Overview

The game now emits score data when a race ends, allowing you to capture:
- Race completion time (in milliseconds and seconds)
- Number of items collected (herring fish)
- Course name
- Whether the race was completed or aborted
- Timestamp

## Integration Methods

There are **three ways** to receive score data from the game:

### Method 1: Callback Function (Recommended)

Configure a callback function before the game loads:

```html
<iframe id="tux-racer" src="path/to/tuxracer/index.html"></iframe>

<script>
  // Wait for the game to load
  const iframe = document.getElementById('tux-racer');
  
  iframe.addEventListener('load', () => {
    // Access the game's window
    const gameWindow = iframe.contentWindow;
    
    // Configure score tracking
    gameWindow.TuxRacerScoreTracker.configure({
      onScoreSubmit: (scoreData) => {
        console.log('Race completed!', scoreData);
        
        // Send to your backend
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scoreData)
        });
      },
      logToConsole: true  // Optional: enable console logging
    });
  });
</script>
```

### Method 2: Custom Events

Listen for the `tuxracer:score` event:

```html
<iframe id="tux-racer" src="path/to/tuxracer/index.html"></iframe>

<script>
  const iframe = document.getElementById('tux-racer');
  
  iframe.addEventListener('load', () => {
    const gameWindow = iframe.contentWindow;
    
    // Listen for score events
    gameWindow.addEventListener('tuxracer:score', (event) => {
      const scoreData = event.detail;
      console.log('Score received:', scoreData);
      
      // Handle the score
      saveScore(scoreData);
    });
  });
  
  function saveScore(scoreData) {
    // Your score handling logic
    localStorage.setItem('lastScore', JSON.stringify(scoreData));
  }
</script>
```

### Method 3: Polling (Not Recommended)

Query the last score after the game ends:

```javascript
const iframe = document.getElementById('tux-racer');
const gameWindow = iframe.contentWindow;

// Poll for score
const lastScore = gameWindow.TuxRacerScoreTracker.getLastScore();
if (lastScore) {
  console.log('Last score:', lastScore);
}
```

## Score Data Format

The `ScoreData` object contains:

```typescript
interface ScoreData {
  course: string;           // e.g., "bunny-hill", "frozen-river"
  timeMs: number;           // Race time in milliseconds
  timeSeconds: number;      // Race time in seconds (timeMs / 1000)
  itemsCollected: number;   // Number of herring collected
  completed: boolean;       // true if completed, false if aborted
  timestamp: string;        // ISO timestamp, e.g., "2025-12-18T10:30:00.000Z"
}
```

### Example Score Data

```json
{
  "course": "bunny-hill",
  "timeMs": 45230,
  "timeSeconds": 45.23,
  "itemsCollected": 12,
  "completed": true,
  "timestamp": "2025-12-18T10:30:00.000Z"
}
```

## Configuration Options

```typescript
interface ScoreTrackerConfig {
  onScoreSubmit?: (scoreData: ScoreData) => void;  // Callback function
  dispatchEvents?: boolean;                         // Dispatch custom events (default: true)
  logToConsole?: boolean;                          // Log to console (default: false)
}
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Game App</title>
  <style>
    #tux-racer {
      width: 100%;
      height: 600px;
      border: none;
    }
    #scoreboard {
      margin-top: 20px;
      padding: 10px;
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <h1>Play TuxRacer</h1>
  <iframe id="tux-racer" src="./index.html?course=bunny-hill"></iframe>
  
  <div id="scoreboard">
    <h2>Last Score</h2>
    <div id="score-display">No scores yet</div>
  </div>

  <script>
    const iframe = document.getElementById('tux-racer');
    const scoreDisplay = document.getElementById('score-display');
    
    iframe.addEventListener('load', () => {
      const gameWindow = iframe.contentWindow;
      
      // Configure score tracking
      gameWindow.TuxRacerScoreTracker.configure({
        onScoreSubmit: handleScore,
        logToConsole: true
      });
    });
    
    function handleScore(scoreData) {
      // Display score
      scoreDisplay.innerHTML = `
        <p><strong>Course:</strong> ${scoreData.course}</p>
        <p><strong>Time:</strong> ${scoreData.timeSeconds.toFixed(2)}s</p>
        <p><strong>Items:</strong> ${scoreData.itemsCollected}</p>
        <p><strong>Status:</strong> ${scoreData.completed ? 'Completed' : 'Aborted'}</p>
      `;
      
      // Save to backend
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      })
      .then(response => response.json())
      .then(data => console.log('Score saved:', data))
      .catch(error => console.error('Error saving score:', error));
    }
  </script>
</body>
</html>
```

## Notes

- Scores are emitted when the race ends (either completed or aborted with ESC key)
- If the race is aborted, `completed` will be `false` and `timeMs` will be `0`
- The score tracker is available globally as `window.TuxRacerScoreTracker`
- Events are dispatched automatically unless you set `dispatchEvents: false`

