# 🚀 Free Deployment Guide — Nexus Financial Terminal

This guide walks you through deploying the **Nexus Financial Terminal** to the web for **100% FREE** using **Render** (for Python FastAPI Backend) and **Vercel** (for Next.js Frontend).

---

## 🛠️ Step 1: Push Code to GitHub

1. Open your terminal in `d:\Equity\nexus-terminal`:
```bash
git init
git add .
git commit -m "Nexus Terminal Release"
```
2. Create a new repository on [GitHub](https://github.com/new).
3. Push your repository to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/nexus-terminal.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend to Render (Free)

1. Sign up for free at [Render.com](https://render.com).
2. Click **New +** → **Blueprint**.
3. Select your GitHub repository `nexus-terminal`.
4. Render will automatically detect `render.yaml` and create the `nexus-terminal-backend` service.
5. Click **Apply**.
6. Once deployed, copy your backend live URL:
   - Example: `https://nexus-terminal-backend.onrender.com`

---

## ⚡ Step 3: Deploy Frontend to Vercel (Free)

1. Sign up for free at [Vercel.com](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your `nexus-terminal` GitHub repository.
4. Set **Root Directory**: `frontend`.
5. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL` = `https://nexus-terminal-backend.onrender.com`
6. Click **Deploy**.

Vercel will give you your production live link (e.g. `https://nexus-terminal.vercel.app`)!
