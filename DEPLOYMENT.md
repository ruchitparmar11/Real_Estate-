# Deployment Guide

Follow these steps to deploy your **EstateAI** project to the web.

## 1. Prerequisites
- **GitHub Account**: Push your code to a GitHub repository.
- **Vercel Account**: For hosting the Frontend (free).
- **Render or Railway Account**: For hosting the Backend (free tiers available).
- **MongoDB Atlas**: You already have this set up.

---

## 2. Deploy Backend (Node.js) on Render

1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select `backend-node` as the **Root Directory**.
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  **Environment Variables**:
    Add the following variables (copy values from your local `.env`):
    - `MONGO_URI`: (Your MongoDB Connection String)
    - `JWT_SECRET`: (Any long random string)
    - `GOOGLE_CLIENT_ID`: (Your Google Client ID)
    - `EMAIL_USER`: (Your Gmail)
    - `EMAIL_PASS`: (Your Gmail App Password)
    - `PORT`: `8000` (Optional, Render sets this auto, but good to have)

8.  Click **Deploy Web Service**.
9.  **Copy the URL**: Once deployed, Render will give you a URL like `https://estate-ai-backend.onrender.com`. **Copy this.**

---

## 3. Deploy Frontend (React) on Vercel

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Select **Vite**.
5.  **Root Directory**: Click "Edit" and select `frontend`.
6.  **Environment Variables**:
    Add the following variable:
    - `VITE_API_URL`: Paste the **Backend URL** you copied from Render (e.g., `https://estate-ai-backend.onrender.com`).
      *(Note: Do NOT add a trailing slash `/`)*
    - `VITE_GOOGLE_CLIENT_ID`: (Your Google Client ID)

7.  Click **Deploy**.

---

## 4. Final Configuration

1.  **Update Google Cloud Console**:
    - Go to your Google Cloud Console Credentials.
    - Edit your OAuth Client.
    - Add your **Vercel Domain** (e.g., `https://estate-ai.vercel.app`) to **Authorized JavaScript origins**.
    - Add `https://estate-ai.vercel.app` to **Authorized redirect URIs**.

2.  **Test It**: Open your Vercel Link.
    - Try Logging in.
    - Try Searching.
    - Try Viewing a Map.

**🎉 Congratulations! Your Real Estate AI Platform is now live!**
