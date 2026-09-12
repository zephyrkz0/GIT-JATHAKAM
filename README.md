<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# GITHUB JAATHAKAM 🎯


## Basic Details
### Team Name: Null_x86


### Team Members
- Team Lead: Kasinath R - [Cochin University College Of Engineering Kuttanadu]

### Project Description
Jaathakam is an absolutely useless, highly judgmental, AI-powered astrology app that reads your GitHub profile like a palm and brutally roasts your coding habits in multiple languages (English, Malayalam).

### The Problem (that doesn't exist)
The developer ecosystem is far too professional. GitHub is full of "clean code" and green squares. We desperately needed an overly dramatic neighborhood astrologer to confirm our imposter syndrome using AI astrology.

### The Solution (that nobody asked for)
We ping the GitHub API to stalk your commit history, use a highly sophisticated "Stat Engine" to categorize your goblin-like behavior (e.g. "Fork Hoarder"), and then force Google's Gemini LLM to write a cursed horoscope. Finally, we use Sarvam AI to scream the roast at you.

## Technical Details
### Technologies/Components Used
For Software:
- HTML, CSS, JavaScript (Vanilla DOM manipulation)
- Express.js (deployed via Vercel Serverless Functions)
- @google/genai, axios, cors
- Vercel, Git, VS Code

For Hardware:
no hardware

### Implementation
For Software:
# Installation
```bash
git clone https://github.com/zephyrkz0/GIT-JATHAKAM.git
cd GIT-JATHAKAM
npm install
```

# Run
```bash
# Add your API keys to .env first:
# GEMINI_API_KEY=your_key
# SARVAM_API_KEY=your_key
node local-server.js
```

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot1](public/img1.png)
*The Welcome Screen: Ready to read the stars of your repositories.*

![Screenshot2](public/img2.png)
*The Grand Roast: Our AI brutally judging your GitHub history.*

![Screenshot3](public/img4.png)
*The Dramatic Setup: Select your language and let the stars decide your fate.*

# Diagrams

```text
+-------------------+        POST /api/jaathakam         +-----------------------+
|                   | ---------------------------------> |                       |
|  User (Frontend)  |                                    | Vercel Serverless API |
|                   | <--------------------------------- |                       |
+-------------------+       JSON Roast & Stats           +-----------------------+
          |                                                |         ^
          | POST /api/tts                                  |         |
          v                                                |         |
+-------------------+                                      |         |
|                   | <------- Returns Audio ------------- |         |
|  Sarvam AI (TTS)  |                                      v         |
|                   | -------- Request Text Audio -------> +---------+
+-------------------+                                      |         |
                                                           |         |
+-------------------+        Fetch Profile Stats         +---------+
|                   | <--------------------------------- |                       |
|    GitHub API     |                                    |   Statistics Engine   |
|                   | ---------------------------------> |                       |
+-------------------+          Raw Data Returns          +-----------------------+
                                                                   |         ^
                                                                   |         |
+-------------------+       Generates Roast Text         +---------+         |
|                   | <--------------------------------- |                       |
| Gemini 3.6 Flash  |                                    |  LLM Prompt Handler   |
|                   | ---------------------------------> |                       |
+-------------------+         Horoscope Text             +-----------------------+
```

*System Architecture Diagram: Client-server interaction model showing data flow from GitHub API to the Stat Engine, LLM processing, and TTS generation.*


# live link
[👉 Try the live demo right here!](https://git-jathakam.vercel.app/)

## Team Contributions
- Zephyr: Full Stack Developer (Solo Developer responsible for frontend UI, Express.js backend, and AI API integrations).

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
