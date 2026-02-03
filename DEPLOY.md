# Deployment Guide — Live Public Demo

Deploy THE ARENA so friends can test and for hackathon submission.

---

## **Option 1: Quick Deploy (Recommended)**

### Backend → Railway
### Frontend → Vercel

**Total time:** ~10 minutes  
**Cost:** $0 (both have free tiers)

---

## **Step 1: Deploy Backend to Railway**

1. **Go to** https://railway.app
2. Click **"Start a New Project"**
3. Sign in with GitHub
4. Click **"Deploy from GitHub repo"**
5. Select **your `arena-agent` repo**
6. Railway will auto-detect Node.js

7. **Add Environment Variables:**
   - Click **"Variables"** tab
   - Add these (one by one):

```
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
OPERATOR_PRIVATE_KEY=your_operator_private_key
GROQ_API_KEY=your_groq_api_key
ARENA_CONTRACT_ADDRESS=0xD44801080F88f145F8bfBA03f17FCde3869E39E8
PORT=3000
```

8. **Deploy Settings:**
   - Root Directory: leave blank
   - Start Command: `npm start`

9. Click **"Deploy"**
   - Wait ~2 minutes
   - Railway will give you a URL like: `arena-agent-production.up.railway.app`

10. **Copy that URL** — you'll need it for Step 2

---

## **Step 2: Configure Frontend for Production**

In your local `arena-agent` project:

1. **Create** `frontend/.env.production`

```bash
VITE_BACKEND_URL=https://your-app.up.railway.app
```

Replace `your-app.up.railway.app` with your actual Railway URL from Step 1.

2. **Update** `frontend/src/App.jsx`

Change this line (at the top):
```js
const BACKEND = ""
```

To:
```js
const BACKEND = import.meta.env.VITE_BACKEND_URL || "https://your-app.up.railway.app"
```

Again, use your actual Railway URL.

3. **Test locally:**

```bash
cd frontend
npm run build
npm run preview
```

Open the preview URL. If it works, you're ready for Vercel.

---

## **Step 3: Deploy Frontend to Vercel**

1. **Go to** https://vercel.com
2. Click **"Add New... → Project"**
3. **Import your GitHub repo** `arena-agent`
4. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     ```
     VITE_BACKEND_URL=https://your-app.up.railway.app
     ```

6. Click **"Deploy"**
   - Wait ~1 minute
   - Vercel gives you: `https://arena-agent.vercel.app`

---

## **Step 4: Test Live Demo**

1. Open your Vercel URL in browser
2. Click **"Connect Wallet"** → MetaMask popup
3. Make sure you're on **Monad Testnet** in MetaMask
   - Network name: Monad Testnet
   - RPC: https://testnet-rpc.monad.xyz
   - Chain ID: 10200
   - Currency: MON
4. Join an arena
5. Share the URL with friends!

---

## **Sharing with Friends**

**Send them:**
1. Your Vercel URL: `https://arena-agent.vercel.app`
2. Instructions:
   - Install MetaMask
   - Add Monad Testnet (see network details above)
   - Get testnet MON from https://testnet.monad.xyz
   - Connect wallet
   - Join and play!

**Pro tip:** Create a short guide (Google Doc or Notion) with:
- Live URL
- How to get testnet MON
- How to add Monad network to MetaMask
- Quick game rules

---

## **Updating After Changes**

**Backend (Railway):**
- Push to GitHub → Railway auto-redeploys

**Frontend (Vercel):**
- Push to GitHub → Vercel auto-redeploys
- Or click "Redeploy" in Vercel dashboard

---

## **Alternative: Deploy Backend to Render**

If Railway doesn't work:

1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Name: arena-agent-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add same env vars as Railway

---

## **Troubleshooting**

**Backend won't start:**
- Check Railway logs for errors
- Verify all env vars are set
- Ensure PORT=3000 is set

**Frontend can't reach backend:**
- Check VITE_BACKEND_URL has correct Railway URL
- Open Railway URL in browser → should see `{"ok":true,...}`
- Check CORS is enabled in backend (already is)

**MetaMask won't connect:**
- Make sure user is on Monad Testnet
- Try different browser (Chrome/Brave work best)
- Clear MetaMask cache

**Arenas not loading:**
- Backend might be sleeping (free tier)
- Refresh page after 30 seconds
- Check backend is running on Railway

---

## **Cost Breakdown**

**Railway Free Tier:**
- $5/month credit
- Enough for this hackathon + testing

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Perfect for this project

**Total: $0** for hackathon period

---

## **For Hackathon Submission**

Use your Vercel URL as the **Live Demo URL** in the submission form:

```
https://arena-agent.vercel.app
```

This is way better than "localhost:5173" and judges can test it directly!

---

## **Next Steps**

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Test with your wallet
4. Share with 2-3 friends to test
5. Add live URL to GitHub README
6. Use in hackathon submission

Good luck! 🚀
