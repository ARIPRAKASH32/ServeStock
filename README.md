<div align="center">
  <img src="./logo.png" alt="ServeStock Logo" width="200" />
</div>

# ServeStock
**Smart Restaurant Inventory, Waste & Operations Intelligence Platform**

ServeStock is a full-stack platform designed to help restaurants move beyond static inventory tracking. It creates a closed operational feedback loop by connecting inventory, expiry risk, waste, financial cost, and actionable intelligence to optimize purchasing decisions.

---

## 🚀 Features

- **Inventory Management:** Track ingredients, stock levels, minimum stock thresholds, and purchase prices.
- **Waste Logging:** Record instances of food waste categorized by reason (e.g., Spoiled, Overproduction, Customer Return) and automatically calculate the associated financial loss.
- **Expiry Risk Intelligence:** Dynamically analyzes current stock against average daily consumption and upcoming expiry dates. Ingredients are automatically flagged from `SAFE` to `CRITICAL` or `EXPIRED`.
- **Automated Purchasing Feedback:** The recommendation engine identifies ingredients with consistently high waste volume/cost and alerts managers to reduce future purchase quantities.
- **A/B Testing Infrastructure:** Built-in capability to track user interactions and evaluate features across variants.

---

## 🏗️ Architecture

The platform follows a clean, decoupled monorepo architecture:

### 1. Backend (`/backend`)
- **Node.js + Express**
- **TypeScript** for strict type safety
- **MongoDB + Mongoose** for data persistence
- **Zod** for robust runtime request validation
- **JWT + bcrypt** for secure Authentication and Role-Based Access Control (Admin, Manager, Staff)
- **Jest + Supertest** for automated intelligence and API testing

### 2. Web Frontend (`/frontend`)
- **React + Vite** for blazing-fast development and optimized production builds
- **TypeScript**
- **Tailwind CSS** for a scalable, custom design system utilizing the `Inter` font for a premium SaaS aesthetic
- **Recharts** for intuitive data visualization (Waste analytics, costs)
- **React Router** for seamless SPA navigation

### 3. Mobile App (`/mobile`)
- **React Native + Expo** for rapid cross-platform deployment
- **TypeScript**
- Designed for on-the-floor staff with quick actions: *Quick Stock Update* and *Record Waste*.

---

## 🛠️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v18.0.0 or higher. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Comes bundled with Node.js.
- **MongoDB**: Running locally on port `27017` or via MongoDB Atlas connection string.
- **Git**: For version control.
- **Expo Go App** *(Optional but recommended)*: Download from Google Play Store or Apple App Store to test the mobile app on a physical phone.

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ARIPRAKASH32/ServeStock.git servestock
   cd servestock
   ```

2. **Install dependencies for all modules:**
   ```bash
   # Backend
   cd backend && npm install && cd ..

   # Frontend
   cd frontend && npm install && cd ..

   # Mobile
   cd mobile && npm install && cd ..
   ```

3. **Backend Environment Setup:**
   Create a `.env` file inside the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/servestock
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```

---

## 🚦 Running the Application

You can run each module either from the **Root Directory** or from their respective **Subdirectories**.

### Method 1: Running from Project Root (Recommended)

| Service | Root Command |
| :--- | :--- |
| **Web Frontend** | `npm run dev` or `npm run dev:frontend` |
| **Backend Server** | `npm run dev:backend` |
| **Mobile App (Expo)** | `npm run start:mobile` |

### Method 2: Running from Subdirectories

- **Web Frontend:**
  ```bash
  cd frontend
  npm run dev
  ```

- **Backend API:**
  ```bash
  cd backend
  npm run dev
  ```

- **Mobile App:**
  ```bash
  cd mobile
  npx expo start
  ```

---

## 📱 Testing the Mobile App (Expo)

When running `npm run start:mobile` (or `npx expo start` inside `mobile/`), Expo will open an interactive menu.

### Option A: Physical Phone with Expo Go (Easiest)
1. Install **Expo Go** on your phone from Play Store / App Store.
2. Connect your phone to the **same Wi-Fi network** as your computer.
3. Open Expo Go and scan the **QR code** printed in your terminal.

### Option B: Physical Phone via USB (`adb`)
1. Install `adb` on Ubuntu/Debian:
   ```bash
   sudo apt update && sudo apt install -y android-tools-adb
   ```
2. Enable **Developer Options** and **USB Debugging** on your phone.
3. Connect your phone via USB and ensure `adb devices` lists your device.
4. Press `a` in the Expo terminal.

### Option C: Android Emulator (Android Studio)
1. Install [Android Studio](https://developer.android.com/studio) and set up an Android Virtual Device (AVD).
2. Set your environment variables in `~/.bashrc`:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. Run `source ~/.bashrc` and press `a` in the Expo terminal.

---

## ❓ Troubleshooting & Common Errors

### 1. `ENOENT: no such file or directory, open '.../package.json'`
- **Cause:** Running `npm run dev` in the root folder before `package.json` was added, or running in an unconfigured directory.
- **Fix:** Run commands using root convenience scripts (`npm run dev:frontend`, `npm run dev:backend`, `npm run start:mobile`) or navigate into `frontend/`, `backend/`, or `mobile/` first.

### 2. `ETIMEDOUT` when running `npx expo start`
- **Cause:** Running `npx expo start` in the root directory causes `npx` to search for Expo globally over the network.
- **Fix:** Always start mobile from `mobile/` or run `npm run start:mobile` from the root directory.

### 3. `Failed to resolve the Android SDK path` / `spawn adb ENOENT`
- **Cause:** Pressing `a` in Expo without having Android SDK or `adb` installed.
- **Fix:** Use **Expo Go** on your phone to scan the QR code (Option A), or install `android-tools-adb` (Option B).

---

## 📊 Data Seeding & Intelligence

By default, the backend runs an **In-Memory MongoDB Server** and automatically executes a **seed script** (`backend/src/seed.ts`) upon startup. This script populates the system with:
1. **Inventory Items**: A mix of safe, low-stock, and expiring ingredients.
2. **Purchase History**: Historical purchase logs to demonstrate tracking.
3. **Waste Records**: Realistic waste events over the past 30 days.

### How Recommendations Work
The ServeStock AI Engine generates recommendations automatically in the background:
- **Expiry Risk**: Flags ingredients as `WARNING`, `HIGH`, or `CRITICAL` based on how close they are to expiring versus average daily usage.
- **Purchase Adjustment**: Generates recommendations to reduce future purchase quantities for items with high waste volume.

---

## 🧪 Testing

To run the backend test suite:
```bash
cd backend
npm test
```

---

## 📜 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
