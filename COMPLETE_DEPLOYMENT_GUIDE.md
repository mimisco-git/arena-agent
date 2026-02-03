# 🚀 Complete Deployment Guide — Go Live in 20 Minutes

This guide will take you from downloaded files to a live public demo that your friends can test.

---

## 📦 PART 1: Setup Files (5 minutes)

### **Step 1: Download All Files**

You should have these files downloaded:

**Core Package:**
- ✅ `arena-agent-submission.tar.gz` (full project backup)

**Updated Files:**
- ✅ `server.js` (backend with emoji fixes)
- ✅ `styles.css` (auto light/dark theme)
- ✅ `App-production.jsx` (for deployment)
- ✅ `frontend-.env.example` (environment template)

**Documentation:**
- ✅ `SUBMISSION.md`
- ✅ `DEPLOY.md`
- ✅ `DEMO_SCRIPT.md`
- ✅ `SUBMIT_CHECKLIST.md`
- ✅ `THEME_GUIDE.md`

### **Step 2: Update Your Local Files**

In your `~/Downloads/arena-agent` folder:

1. **Backend:**
   - Replace `backend/server.js` with downloaded `server.js`

2. **Frontend:**
   - Replace `frontend/src/styles.css` with downloaded `styles.css`
   - Keep `frontend/src/App.jsx` as-is for now (we'll update it for deployment)

3. **Add docs to root:**
   - Move all `.md` files to `arena-agent/` root directory

---

## 🌐 PART 2: Deploy Backend to Railway (5 minutes)

### **Step 1: Go to Railway**

1. Open browser → **https://railway.app**
2. Click **"Start a New Project"**
3. **Sign in with GitHub**

### **Step 2: Deploy from GitHub**

1. Click **"Deploy from GitHub repo"**
2. Railway will ask to authorize → Click **"Authorize"**
3. Select **your `arena-agent` repository**
4. Railway auto-detects Node.js ✅

### **Step 3: Add Environment Variables**

1. Click **"Variables"** tab
2. Click **"+ New Variable"** and add these **one by one**:

```
MONAD_RPC_URL
https://testnet-rpc.monad.xyz

OPERATOR_PRIVATE_KEY
[paste your private key from .env file]

GROQ_API_KEY
[paste your Groq key from .env file]

ARENA_CONTRACT_ADDRESS
0xD44801080F88f145F8bfBA03f17FCde3869E39E8

PORT
3000
```

**⚠️ Important:** Copy your actual private key and Groq API key from your local `.env` file!

### **Step 4: Deploy**

1. Click **"Deploy"**
2. Wait ~2 minutes (watch the logs)
3. Once done, click **"Settings"** → **"Public Networking"**
4. Click **"Generate Domain"**
5. **Copy your Railway URL** (looks like: `arena-agent-production-abc123.up.railway.app`)

### **Step 5: Test Backend**

Open this in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Should show:
```json
{"ok":true,"uptime":12.5,"arenas":4}
```

✅ Backend is live!

---

## 🎨 PART 3: Update Frontend for Production (3 minutes)

### **Step 1: Update App.jsx**

In your local `arena-agent/frontend/src/` folder:

1. Open `App.jsx` in any text editor
2. Find this line near the top (around line 7):
   ```js
   const BACKEND = ""
   ```
3. Replace it with:
   ```js
   const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://your-railway-url.up.railway.app"
   ```
   **Replace `your-railway-url.up.railway.app` with your actual Railway URL!**

### **Step 2: Create Production Environment File**

In `arena-agent/frontend/` folder:

1. Create a new file called `.env.production`
2. Add this line:
   ```
   VITE_BACKEND_URL=https://your-railway-url.up.railway.app
   ```
   Again, use your actual Railway URL!

### **Step 3: Test Locally (Optional)**

```bash
cd ~/Downloads/arena-agent/frontend
npm run build
npm run preview
```

Open the preview URL. If it loads and shows arenas, you're good!

### **Step 4: Push to GitHub**

**Using GitHub Web Interface:**

1. Go to **https://github.com/YOUR_USERNAME/arena-agent**
2. Navigate to `frontend/src/`
3. Click **"Upload files"**
4. Drag your updated `App.jsx`
5. Commit message: "Update backend URL for production"
6. Click **"Commit changes"**

7. Navigate back to `frontend/` root
8. Click **"Add file" → "Create new file"**
9. Name it `.env.production`
10. Paste your backend URL line
11. Commit

---

## ☁️ PART 4: Deploy Frontend to Vercel (5 minutes)

### **Step 1: Go to Vercel**

1. Open browser → **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**

### **Step 2: Import Your Project**

1. Click **"Add New..." → "Project"**
2. Find your **`arena-agent`** repo in the list
3. Click **"Import"**

### **Step 3: Configure Build Settings**

Vercel will auto-detect Vite. Just update these:

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Type: `frontend`
- Click **"Continue"**

**Framework Preset:**
- Should auto-select **"Vite"** ✅

**Build & Output Settings:**
- Build Command: `npm run build` ✅
- Output Directory: `dist` ✅
- Install Command: `npm install` ✅

### **Step 4: Add Environment Variable**

1. Click **"Environment Variables"** section
2. Click **"Add"**
3. Name: `VITE_BACKEND_URL`
4. Value: `https://your-railway-url.up.railway.app` (your actual URL!)
5. Make sure it applies to **Production** ✅

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait ~1-2 minutes
3. Vercel will show: **"Your project has been deployed"**
4. Click **"Visit"** to see your live site
5. **Copy your Vercel URL** (like: `https://arena-agent.vercel.app`)

---

## 🎮 PART 5: Test Live Demo (2 minutes)

### **Step 1: Open Your Vercel URL**

Example: `https://arena-agent.vercel.app`

### **Step 2: Connect Wallet**

1. Click **"Connect Wallet"**
2. MetaMask will popup
3. **Make sure you're on Monad Testnet:**
   - Network name: **Monad Testnet**
   - RPC URL: **https://testnet-rpc.monad.xyz**
   - Chain ID: **10200**
   - Currency: **MON**

If you don't have Monad Testnet added:
- Click "Add Network" in MetaMask
- Or manually add using the details above

### **Step 3: Get Testnet MON**

1. Go to **https://testnet.monad.xyz**
2. Paste your wallet address
3. Click **"Claim"**
4. Wait ~10 seconds

### **Step 4: Test the App**

1. Refresh your Vercel site
2. Connect wallet ✅
3. Click any arena card
4. Click **"Join Arena — 0.01 MON"**
5. Approve in MetaMask
6. You should see "Joined arena" toast ✅

**IT WORKS!** 🎉

---

## 👥 PART 6: Share with Friends

### **Create a Share Message:**

```
🎮 Try THE ARENA - AI Gaming Agent on Monad!

Live demo: https://your-vercel-url.vercel.app

Quick setup (2 min):
1. Install MetaMask: https://metamask.io
2. Add Monad Testnet:
   - RPC: https://testnet-rpc.monad.xyz
   - Chain ID: 10200
   - Currency: MON
3. Get free testnet MON: https://testnet.monad.xyz
4. Connect wallet & play!

4 game modes: Prediction, Trivia, Trading, Strategy
All AI-judged, all on-chain!
```

Send to friends via:
- Twitter DM
- Discord
- Telegram
- WhatsApp

### **Test Light/Dark Theme:**

Tell them to try switching their system theme:
- **macOS:** System Preferences → Appearance
- **Windows:** Settings → Personalization → Colors
- The app auto-switches! 🎨

---

## 📝 PART 7: Submit to Hackathon

### **Go to Submission Form:**

**https://forms.moltiverse.dev/submit**

### **Fill in Details:**

**Project Name:**
```
THE ARENA - Autonomous AI Gaming & Wagering Agent
```

**Track:**
- ✅ Gaming Arena Agent Bounty

**Team Name/Your Name:**
```
[Your name]
```

**Email:**
```
[Your email]
```

**GitHub Repository:**
```
https://github.com/YOUR_USERNAME/arena-agent
```
(Use your actual username!)

**Live Demo URL:**
```
https://your-app.vercel.app
```
(Use your actual Vercel URL!)

**Demo Video URL:**
```
[Record 2-min video following DEMO_SCRIPT.md and upload to YouTube]
```
(Can submit form first, add video later if needed)

**Contract Address:**
```
0xD44801080F88f145F8bfBA03f17FCde3869E39E8
```

**Description:**
```
THE ARENA is an autonomous AI agent that creates and manages competitive gaming arenas with automated wagering on Monad. Players join arenas, compete in AI-judged games (prediction battles, trivia, trading, strategy cards), and earn through skill-based competition.

The system consists of three layers:
1. Smart contract (Solidity) for on-chain wagering and settlement
2. AI backend (Express + Groq LLM) for game generation and judging  
3. Premium glassmorphism UI (React + ethers.js) for player interaction

Key innovations:
- Fully autonomous AI game master generates unique content for each arena
- Fair on-chain settlement with escrow and automatic payouts
- 4 diverse game modes proving extensibility
- Production-grade UI with auto light/dark theme and mobile responsiveness

The agent operates with zero human intervention: it creates arenas, generates game content, scores players, determines winners, and settles wagers — all autonomously.

Built specifically for the Gaming Arena bounty, demonstrating competitive arena creation, automated wagering, and AI-powered tournament management. Contract deployed on Monad testnet at 0xD44801080F88f145F8bfBA03f17FCde3869E39E8.

Live demo: [your-vercel-url] | Source: [your-github-repo]
```

**Tech Stack:**
```
Solidity 0.8.24, React 18, Vite 6, Express 4.21, Groq SDK (Llama 3.3 70B), ethers.js 6.13, Monad Testnet, Railway (backend), Vercel (frontend)
```

**Additional Notes:**
```
Early submission (Day 2/16) for rolling judging. All code open source (MIT). Production-ready with live public demo. Auto light/dark theme. Mobile responsive. Ready for mainnet migration.
```

### **Submit!**

Click **"Submit"**

✅ **YOU'RE DONE!**

---

## 🎯 Quick Summary

**What you deployed:**
- ✅ Backend on Railway (API + AI)
- ✅ Frontend on Vercel (UI)
- ✅ Contract on Monad Testnet
- ✅ Auto light/dark theme
- ✅ Fully functional demo

**Your URLs:**
- Live demo: `https://your-app.vercel.app`
- Backend API: `https://your-railway-url.up.railway.app`
- Contract: `0xD44801080F88f145F8bfBA03f17FCde3869E39E8`
- GitHub: `https://github.com/YOUR_USERNAME/arena-agent`

**Submission status:**
- 🏆 Gaming Arena Bounty ($10K)
- 📅 Submitted Day 2 of 16 (early advantage!)
- 🎮 Live demo working
- 📹 Demo video (recommended to add)

---

## 🐛 Troubleshooting

**Backend not working:**
- Check Railway logs for errors
- Verify all environment variables are set correctly
- Make sure wallet has testnet MON

**Frontend can't connect to backend:**
- Check CORS (already enabled)
- Verify Railway URL in App.jsx and .env.production match
- Try opening Railway URL directly in browser

**MetaMask won't connect:**
- Make sure on Monad Testnet (Chain ID 10200)
- Try different browser (Chrome works best)
- Clear MetaMask cache

**Vercel build fails:**
- Check build logs
- Verify `frontend/` is set as root directory
- Make sure `npm install` works locally

**Need help?**
- Check Railway logs: Railway dashboard → Deployments → View logs
- Check Vercel logs: Vercel dashboard → Deployments → Function Logs
- Test locally first: `npm start` (backend) and `npm run dev` (frontend)

---

## 📊 Monitoring

**Railway (Backend):**
- Dashboard shows: Deploys, Metrics, Logs
- Free tier: $5/month credit (plenty for hackathon)
- Auto-redeploys on GitHub push

**Vercel (Frontend):**
- Dashboard shows: Deployments, Analytics, Logs
- Free tier: 100GB bandwidth/month
- Auto-redeploys on GitHub push

**Usage so far:**
- Contract calls: ~5 (deploy + test transactions)
- Backend requests: <100
- Frontend visits: depends on sharing

---

## 🎬 Next Steps (After Submission)

1. **Record demo video** (2-3 min following DEMO_SCRIPT.md)
2. **Share on Twitter** with #Moltiverse hashtag
3. **Post in Discord** showcase channel
4. **Get 3-5 friends to test** and give feedback
5. **Monitor for judge questions** in Discord
6. **Prepare for Monad mainnet** when it launches

---

## 🏆 Why This Wins

- ✅ **Early submission** (Day 2 of 16)
- ✅ **Fully functional** (not a prototype)
- ✅ **Live public demo** (judges can test instantly)
- ✅ **Production UI** (premium glassmorphism + auto theme)
- ✅ **AI autonomous** (generates content, judges winners)
- ✅ **On-chain verified** (contract deployed + tested)
- ✅ **Well documented** (README, guides, submission docs)
- ✅ **Mobile responsive** (works on phones/tablets)
- ✅ **Open source** (MIT license, clean code)

Good luck! 🚀

---

**Questions? Need help?**
- Check Railway/Vercel logs
- Test locally first
- Discord: Moltiverse hackathon channel
- This guide: Re-read relevant section

You got this! 💪
