# The Architecture of Detachment 🏛️

A modern stoic curation engine, vulnerability auditor, and philosophical content planner designed for reflective, analytical wisdom, psychological insight, and solitude.

This application is built with a **full-stack architecture** utilizing **React 19 (Vite + Tailwind CSS v4)** on the client-side and a **Node.js Express** backend server integrating the **Google GenAI SDK** for advanced, server-guarded stoic analysis and generation.

---

## 🔗 Quick Access
* **AI Studio Project Workspace**: [View App on Google AI Studio](https://ai.studio/apps/e1a7db59-2086-4901-84c1-100b9987558a)
* **Development Preview URL**: [https://ais-dev-bz2yhgdjryf4bbirbevtr7-424098399161.asia-southeast1.run.app](https://ais-dev-bz2yhgdjryf4bbirbevtr7-424098399161.asia-southeast1.run.app)
* **Shared Sandbox URL**: [https://ais-pre-bz2yhgdjryf4bbirbevtr7-424098399161.asia-southeast1.run.app](https://ais-pre-bz2yhgdjryf4bbirbevtr7-424098399161.asia-southeast1.run.app)

---

## 🛠️ Features Overview
1. **Aphorism Vault**: Explore handpicked quotes categorized into core Pillars (e.g., *Sovereignty of Mind*, *Vulnerability Audit*, *The Void*, *Social Variables*).
2. **Curator Workspace**: Feed existing or AI-generated aphorisms into the **Gemini 3.5 Flash** model to generate cold, clinical, and analytical commentary and philosophical tags.
3. **The Shield Chamber**: Enter external stressors or conflicts to test your emotional insulation. Receive a **Detachment Score (0–100)** and a psychological stoic audit.
4. **Dialogue Studio**: Generate sharp, clinical "Internal Reality" contrast dialogues ("Dialogue of the Mask") which contrast superficial external queries with deep stoic self-reliance.
5. **Admin Override (Hidden Protocol)**: Custom admin interface to edit, add, or delete vault quotes and shield scenarios.

---

## ⚙️ Hidden Feature: Admin Override Access
The **Admin Override** panel allows you to modify the stored database of aphorisms and vulnerability scenarios (persisted via browser `localStorage` on the client side). It is **hidden** by default from standard viewers.
* **Option A (Click Sequence)**: Go to the header and click the **rotating geometric square icon** on the left of the title **5 times** rapidly.
* **Option B (Keyboard Shortcut)**: On your keyboard, press `Ctrl + Shift + A` (on any screen).
* *To close it*, repeat the trigger, or click any other tab.

---

## 📦 Step 1: Exporting Your App from AI Studio to GitHub
To move your project out of the AI Studio environment and into your personal control, use the built-in export flow:
1. In the **Google AI Studio Build** environment, locate the **Settings** menu or **Export** option (typically at the top-right or in the side panel).
2. Click **Export to GitHub** or **Download ZIP**.
   * **If Exporting to GitHub**: Connect your GitHub account, choose a repository name (e.g., `the-architecture-of-detachment`), set it to **Public** or **Private**, and finalize the export. AI Studio will automatically push the entire codebase to your new repository.
   * **If Downloading ZIP**: Extract the folder onto your local machine, open your terminal inside the folder, initialize a Git repository (`git init`), commit your files (`git add . && git commit -m "initial commit"`), and push it to a new GitHub repository manually.

---

## 💻 Step 2: Running the Project Locally
Ensure you have [Node.js](https://nodejs.org/) (version 18 or above) installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/the-architecture-of-detachment.git
cd the-architecture-of-detachment
```

### 2. Install Project Dependencies
Run the installation command in your terminal. This downloads all React, Express, Vite, and Gemini packages specified in `package.json`:
```bash
npm install
```

### 3. Setup Your Environment Secrets
The application uses the modern `@google/genai` SDK and requires a secure API key.
1. Create a file in the root directory named `.env` (or copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and paste your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
   *(To get a free key, visit [Google AI Studio Secrets Panel](https://aistudio.google.com/))*

### 4. Boot the Development Server
```bash
npm run dev
```
The console will output the local address:
```
Server listening on port 3000
```
Open your browser and visit **`http://localhost:3000`**. You are now running the full-stack server and frontend locally!

---

## 🚀 Step 3: Hosting and Deploying Online
Because this is a **Full-Stack Node.js app** (which hosts an Express backend server and proxies your API requests to protect your `GEMINI_API_KEY` from the client browser), standard static hosters like GitHub Pages or basic Netlify/Vercel will *not* work out-of-the-box unless you convert the Express endpoints to Serverless Functions.

The easiest, most robust way to host a Node.js full-stack app for **free** is using **Render**, **Railway**, **Fly.io**, or **Google Cloud Run**.

### Option A: Hosting on Render (Recommended, Free Tier Available)
1. **Create an Account**: Go to [Render.com](https://render.com) and sign in using your GitHub account.
2. **Create a New Web Service**: Click **New +** and select **Web Service**.
3. **Connect Your Repository**: Connect your GitHub account and select your `the-architecture-of-detachment` repository.
4. **Configure Settings**:
   * **Language**: `Node`
   * **Branch**: `main`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm run start`
5. **Set Environment Variables**:
   * Scroll down to **Environment** (or **Advanced**) and click **Add Environment Variable**.
   * Add `GEMINI_API_KEY` = `[Your Gemini API Key]`
   * Add `NODE_ENV` = `production`
6. **Deploy**: Click **Deploy Web Service**. Render will build your Vite assets, bundle your Express server using `esbuild` into `dist/server.cjs`, and launch it on a free `.onrender.com` URL!

---

### Option B: Hosting on Railway (Very Fast & Robust)
1. Go to [Railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo** and select your repository.
3. Click **Add Variables** and configure:
   * `GEMINI_API_KEY` = `[Your Gemini API Key]`
   * `PORT` = `3000`
   * `NODE_ENV` = `production`
4. Railway will automatically detect your `npm run build` and `npm run start` commands in `package.json`, build the app, and generate a live domain for you.

---

### Option C: Google Cloud Run (Industry Standard, Scalable)
Since your AI Studio app is already running on Cloud Run in sandbox containers, this is a native choice:
1. Build a container or push your source code to Google Cloud using the Google Cloud SDK (`gcloud` CLI):
   ```bash
   gcloud run deploy the-architecture-of-detachment --source . --port 3000 --set-env-vars GEMINI_API_KEY=your_key_here --allow-unauthenticated
   ```
2. Select a region and enjoy near-instant, scale-to-zero serverless hosting.

---

## 🔄 Step 4: How to Update Your App Everyday
To keep your web application updated with new code changes, quote templates, or security rules, follow this systematic workflow:

### 1. Update Locally, Then Push to GitHub
Whenever you make a modification locally (e.g., modifying `/src/data.ts` to add new base stoic quotes or tweaking styles in `/src/App.tsx`):
1. Test your code locally: `npm run build && npm run start` to verify nothing is broken.
2. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Update: Added new weekly aphorisms and improved layout spacing"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```

### 2. Auto-Deployments (Continuous Integration)
* **If hosted on Render/Railway**: Every time you run `git push origin main`, Render or Railway will detect the new push, automatically pull the latest commits, trigger `npm run build`, and deploy the updated app without any manual intervention!
* **Zero Downtime**: The existing live site stays online while the new build is in progress, ensuring a smooth transition.

### 3. Dynamic Daily Changes without Redeploying
If you want to update quotes or vulnerability scenarios everyday **without editing the code or redeploying the server**:
1. Access the **Admin Override** hidden panel (click the logo 5 times).
2. Add, modify, or delete quotes and scenarios.
3. Because the state is saved in the browser’s `localStorage`, your updates will persist on that device immediately.
4. *Tip*: If you want to make permanently hardcoded updates for all users, open `/src/data.ts`, add your new items to `INITIAL_QUOTES` or `SHIELD_SCENARIOS`, compile/test, and push to GitHub.

---

## 🏛️ Stoic Architecture & Technologies Used
* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (Animations), Lucide React (Icons)
* **Backend**: Express v4, Google GenAI SDK (`@google/genai`)
* **Bundle Optimizer**: Vite 6, Esbuild (Bundles `server.ts` into a self-contained CommonJS single file `dist/server.cjs` for high-speed deployment boot-times)

---

> *"The mind adapts and converts to its own purposes the obstacle to our acting. The impediment to action advances action. What stands in the way becomes the way."* — Marcus Aurelius
