# ZF-01 — THE ZAINAB QUEST

> A classified scavenger hunt. For one person. At NUST H-12.

---

## Quick Start

```bash
npm install
npm run dev
```

Open on your phone at `http://[YOUR-IP]:5173` (shown in terminal).

---

## Project Structure

```
src/
├── config/
│   └── questConfig.js    ← EDIT ALL SETTINGS HERE
├── hooks/
│   ├── useQuestState.js  ← Game state + localStorage
│   ├── useCountdown.js   ← Real-time timers
│   └── useSound.js       ← Howler.js audio
├── components/
│   ├── HUD.jsx           ← Top mission status bar
│   ├── MissionTimer.jsx  ← Countdown display
│   ├── MissionCard.jsx   ← Hint + password UI
│   ├── PasswordInput.jsx ← Password entry field
│   ├── SystemLogs.jsx    ← Terminal log feed
│   └── shared.jsx        ← Glitch, Radar, Typewriter, etc.
└── pages/
    ├── LockedScreen.jsx       ← Before 7PM
    ├── ActivationScreen.jsx   ← Boot sequence at 7PM
    ├── Mission.jsx            ← Main gameplay
    ├── VideoRewardPage.jsx    ← After correct password
    ├── DarePage.jsx           ← Timer failure + dare
    ├── FinalPage.jsx          ← Quest complete
    └── EasterEggScreen.jsx    ← Secret + sound prompt
```

---

## 1. Change Quest Start Time

Edit `src/config/questConfig.js`:

```js
startTime: "2026-10-07T19:00:00+05:00"
// Format: YYYY-MM-DDTHH:MM:SS+05:00 (Pakistan Standard Time)
```

The site locks until this exact moment.

---

## 2. Change Clues (Hints)

```js
missions: [
  {
    hint: "YOUR ACTUAL CLUE HERE",
    // ...
  }
]
```

This is the text Zainab reads before physically going to the location.

---

## 3. Change Passwords

```js
acceptedPasswords: ["CONCORDIA", "concordia"]
```

- Case-insensitive by default
- Whitespace is trimmed automatically
- Add as many variants as you want
- Put the password on the physical paper at the location

---

## 4. Change Dares

```js
dares: [
  "Your dare here.",
  "Another dare.",
]
```

One is randomly selected when the timer expires.

---

## 5. Add Videos

Drop these into `public/videos/`:
- `mission1.mp4`
- `mission2.mp4`
- `mission3.mp4`
- `final.mp4` (optional)

**Best format:** H.264 MP4, portrait 9:16, under 50MB each.

---

## 6. Add Sounds

Drop `.mp3` files into `public/sounds/`:
```
boot.mp3, click.mp3, success.mp3, failure.mp3,
warning.mp3, tick.mp3, glitch.mp3, mission_unlock.mp3,
dare.mp3, bonus.mp3, complete.mp3, ambient.mp3, scan.mp3
```

See `public/sounds/README.md` for free sources.

---

## 7. Change Messages

In `questConfig.js`:

```js
missions[0].completionMessage = "YOUR MESSAGE AFTER MISSION 1"
missions[1].completionMessage = "YOUR MESSAGE AFTER MISSION 2"
missions[2].completionMessage = "YOUR MESSAGE AFTER MISSION 3"

finalMessage = "YOUR FINAL PERSONAL MESSAGE"
```

---

## 8. Change Operative Name / Location

```js
operative: {
  name: "Zainab Fatima",
  callsign: "ZF-01",
  location: "H-12 // ISLAMABAD",
}
```

---

## 9. Change Timer Duration

Each mission can have a different duration (in minutes):

```js
durationMinutes: 30
```

---

## 10. Test Before Deployment

### Force unlock (DEV mode)
A red `[DEV] RESET` button appears in the top-left during development.
Click it to reset all game state.

### Test without waiting for 7PM
Change `startTime` to a past timestamp:
```js
startTime: "2026-01-01T00:00:00+05:00"  // Always unlocked
```

### Test timer expiry
Set `durationMinutes: 1` for Mission 1 to quickly trigger the dare flow.

---

## 11. Deploy to Vercel

```bash
npm run build
npx vercel --prod
```

Or connect your GitHub repo to Vercel and set:
- **Framework:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

---

## 12. Mobile Testing During Development

```bash
npm run dev
```

The terminal shows your local IP, e.g.:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.x:5173/
```

Open the Network URL on Zainab's phone for testing.

---

## 13. Game State

All state persists in `localStorage` under key `zf01_quest_state_v3`.

State survives:
- Page refresh
- App close and reopen
- Background

Refresh does NOT reset timers — they use real timestamps.

---

## 14. Easter Eggs

- **5x tap** the `ZF-01` text in the HUD → secret screen
- Configurable in `questConfig.easterEggs`

---

## 15. Custom Dares Bonus Time

Change bonus time in minutes:

```js
bonusTimeMinutes: 10
```

---

## Security Note

Passwords are stored in the JavaScript bundle. Anyone who views source can find them.

For a personal scavenger hunt this is fine. For extra security, consider adding a simple hash comparison instead of plaintext.

---

## License

Personal use. Made with ❤️ for Zainab.
