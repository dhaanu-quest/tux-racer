# TuxRacer Quick Start Guide

## 🚀 3-Step Integration

### Step 1: Build the Game
```bash
cd tux-racer-js-main
npm install
npm run build
```

### Step 2: Copy Files
Copy the `dist` folder to your app's public directory:
```
your-app/
  public/
    tuxracer/    ← Copy dist folder here and rename to 'tuxracer'
```

### Step 3: Embed & Track Scores
```html
<iframe id="game" src="/tuxracer/index.html?course=bunny-hill" 
        width="800" height="600"></iframe>

<script>
  const iframe = document.getElementById('game');
  
  iframe.addEventListener('load', () => {
    iframe.contentWindow.TuxRacerScoreTracker.configure({
      onScoreSubmit: (score) => {
        console.log('Score:', score);
        
        // Send to your backend
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(score)
        });
      }
    });
  });
</script>
```

---

## 📊 Score Data Format

```javascript
{
  course: "bunny-hill",        // Course name
  timeMs: 45230,               // Time in milliseconds
  timeSeconds: 45.23,          // Time in seconds
  itemsCollected: 12,          // Number of herring collected
  completed: true,             // true = finished, false = aborted
  timestamp: "2025-12-19T..."  // ISO timestamp
}
```

---

## 🎮 Available Courses

Change course via URL parameter:
```
?course=bunny-hill
?course=frozen-river
?course=challenge-one
?course=path-of-daggers
```

---

## 🌤️ Available Environments

```
?environment=sunny    (default)
?environment=night
?environment=cloudy
```

Combine them:
```html
<iframe src="/tuxracer/index.html?course=frozen-river&environment=night"></iframe>
```

---

## 🎯 Framework Examples

### React
```jsx
const iframeRef = useRef(null);

useEffect(() => {
  const iframe = iframeRef.current;
  iframe?.addEventListener('load', () => {
    iframe.contentWindow.TuxRacerScoreTracker.configure({
      onScoreSubmit: (score) => saveScore(score)
    });
  });
}, []);

return <iframe ref={iframeRef} src="/tuxracer/index.html" />;
```

### Vue
```vue
<template>
  <iframe ref="gameFrame" src="/tuxracer/index.html" @load="onLoad" />
</template>

<script setup>
const gameFrame = ref(null);

const onLoad = () => {
  gameFrame.value.contentWindow.TuxRacerScoreTracker.configure({
    onScoreSubmit: (score) => saveScore(score)
  });
};
</script>
```

### Angular
```typescript
@ViewChild('gameFrame') gameFrame!: ElementRef<HTMLIFrameElement>;

onGameLoad() {
  const win = this.gameFrame.nativeElement.contentWindow as any;
  win.TuxRacerScoreTracker.configure({
    onScoreSubmit: (score) => this.saveScore(score)
  });
}
```

---

## 🎨 Styling Tips

```css
/* Responsive iframe */
iframe {
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Full screen */
iframe {
  width: 100vw;
  height: 100vh;
  border: none;
}

/* Mobile friendly */
@media (max-width: 768px) {
  iframe {
    height: 400px;
  }
}
```

---

## 🎮 Controls

- **Desktop**: Arrow Keys or WASD
- **Mobile**: Touch controls (automatic)
- **ESC**: Abort race
- **R**: Restart

---

## ⚠️ Common Issues

**TuxRacerScoreTracker is undefined**
- Wait for iframe `load` event before accessing

**Scores not received**
- Check browser console for errors
- Ensure callback is set before game ends

**Game not loading**
- Verify path to dist folder
- Check browser DevTools Network tab

**CORS errors**
- Serve from same domain
- Or configure CORS headers

---

## 📚 Full Documentation

- **Embedding Guide**: See `EMBEDDING_GUIDE.md` for detailed framework examples
- **Score Tracking**: See `SCORE_TRACKING.md` for advanced score tracking options

---

## 💡 Pro Tips

1. **Always wait for iframe load** before configuring score tracker
2. **Test on mobile** - game has touch controls
3. **Use environment variables** for API endpoints
4. **Store scores locally** as backup before sending to server
5. **Handle network errors** gracefully

---

## 🔗 Example Backend (Node.js/Express)

```javascript
app.post('/api/scores', async (req, res) => {
  const score = req.body;
  
  // Validate score data
  if (!score.course || !score.timeMs) {
    return res.status(400).json({ error: 'Invalid score data' });
  }
  
  // Save to database
  await db.scores.create({
    userId: req.user.id,
    course: score.course,
    timeMs: score.timeMs,
    itemsCollected: score.itemsCollected,
    completed: score.completed,
    timestamp: score.timestamp
  });
  
  res.json({ success: true });
});
```

---

## ✅ You're Ready!

That's it! You now have TuxRacer embedded in your app with score tracking. 🎉

For more examples, check out `score-tracking-example.html` in the project root.

