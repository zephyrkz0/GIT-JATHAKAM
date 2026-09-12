# 🌟 Jaathakam: The Git Astrologer 🌟

**[👉 Try it live here! (https://git-jathakam.vercel.app/)](https://git-jathakam.vercel.app/)**

<img src="public/img1.png" alt="Jaathakam Intro" width="100%">

Are you tired of rational metrics? Do you look at your GitHub contributions graph and think, *"What do the stars say about my commit history?"* Look no further! 

**Jaathakam** is an absolutely useless, highly judgmental, AI-powered astrology app that reads your GitHub profile like a palm and brutally roasts your coding habits in multiple languages (English, Malayalam, Hindi, and Tamil). 

---

## 🔮 The Grand Tour

Here is what this beautiful catastrophe looks like in action:

<p align="center">
  <img src="public/img2.png" alt="Jaathakam Output" width="80%">
</p>

### What it actually does:
1. **Stalks you:** We ping the GitHub API to fetch your repos, stars, forks, and the exact time you push code (we see those 3 AM commits, you goblin).
2. **Judges you:** A sophisticated "Stat Engine" categorizes your behavior. Are you a "Fork Hoarder"? A "Night Owl"? 
3. **Roasts you:** Google's Gemini 3.6 Flash LLM spins up a personalized, slightly unhinged horoscope.
4. **Speaks to you:** Sarvam AI converts the roast into dramatic text-to-speech audio while temple bells ring ominously in the background.

<p align="center">
  <img src="public/img4.png" alt="The Grand Finale" width="80%">
</p>

---

## 🤡 The Problem (That Nobody Asked to Solve)

The developer ecosystem is far too professional. LinkedIn is full of "thrilled to announce" posts. GitHub is full of "clean code". We wanted to bring the chaotic, unsolicited advice of an overly dramatic neighborhood astrologer directly to your repositories. 

It solves the very pressing issue of: *“I have imposter syndrome, but I want an AI to confirm it using astrology.”*

---

## 🛠️ The Tech Stack (Because we had to write code)

- **Frontend:** Vanilla HTML, CSS, JavaScript (Yes, we raw-dogged the DOM. React is for people who don't like pain).
- **Backend:** Node.js, Express (Deployed via Vercel Serverless Functions).
- **AI Brains:** `gemini-3.6-flash` (Because we demanded the absolute bleeding edge of snark).
- **Voice Actor:** Sarvam AI TTS (Bringing the roasting to life in crisp audio).
- **Vibes:** Pure unadulterated chaos.

---

## 🚀 How to Run This Dumpster Fire Locally

1. Clone this repository (and question your life choices).
2. Run `npm install` to download half the internet.
3. Create a `.env` file at the root and feed it your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   SARVAM_API_KEY=your_sarvam_key_here
   ```
4. Run `node local-server.js`.
5. Open `http://localhost:3000` and prepare to be insulted.

---

## 🎭 The Masterminds

**Team Name:** The Unhandled Exceptions
- **Lead Astrologer:** Zephyr - College of Copy/Pasting from StackOverflow
- **Vibe Manager:** [Your Name] - University of "It works on my machine"
- **Bug Creator:** [Your Friend's Name] - Institute of Missing Semicolons

*(P.S. We renamed `local-server.js` to keep Vercel happy. Long story.)*
