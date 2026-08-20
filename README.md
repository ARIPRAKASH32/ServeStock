# ServeStock
**Smart Restaurant Inventory, Waste & Operations Intelligence Platform**

ServeStock is a full-stack platform designed to help restaurants move beyond static inventory tracking. It creates a closed operational feedback loop by connecting inventory, expiry risk, waste, financial cost, and actionable intelligence to optimize purchasing decisions.

## 🚀 Features

- **Inventory Management:** Track ingredients, stock levels, minimum stock thresholds, and purchase prices.
- **Waste Logging:** Record instances of food waste categorized by reason (e.g., Spoiled, Overproduction, Customer Return) and automatically calculate the associated financial loss.
- **Expiry Risk Intelligence:** Dynamically analyzes current stock against average daily consumption and upcoming expiry dates. Ingredients are automatically flagged from `SAFE` to `CRITICAL` or `EXPIRED`.
- **Automated Purchasing Feedback:** The recommendation engine identifies ingredients with consistently high waste volume/cost and alerts managers to reduce future purchase quantities.
- **A/B Testing Infrastructure:** Built-in capability to track user interactions and evaluate features across variants.

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
- **npm**: Comes bundled with Node.js. Used for installing dependencies.
- **MongoDB**: You need a running MongoDB database. 
  - *Option 1 (Local)*: Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) and run it locally on the default port `27017`.
  - *Option 2 (Cloud)*: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.
- **Git**: For version control. Download from [git-scm.com](https://git-scm.com/).
- **Expo Go**: To run and test the mobile application on your physical phone, download the **Expo Go** app from the Apple App Store or Google Play Store.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ARIPRAKASH32/ServeStock.git servestock
   cd servestock
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   
   # Create a .env file based on the environment configuration
   echo "PORT=5000" > .env
   echo "MONGODB_URI=mongodb://localhost:27017/servestock" >> .env
   echo "JWT_SECRET=your_super_secret_jwt_key_here" >> .env
   echo "JWT_EXPIRES_IN=7d" >> .env
   
   # Run the development server
   npm run dev
   ```

3. **Web Frontend Setup:**
   ```bash
   cd frontend
   npm install
   
   # Run the Vite development server
   npm run dev
   ```

4. **Mobile App Setup:**
   ```bash
   cd mobile
   npm install
   
   # Start the Expo development server
   npx expo start
   ```

## 📊 Data Seeding & Intelligence

Since ServeStock is heavily driven by data and AI recommendations, it requires realistic data to test properly. 

By default, the backend runs an **In-Memory MongoDB Server** and automatically executes a **seed script** (`backend/src/seed.ts`) upon startup. This script automatically populates the system with:
1. **Inventory Items**: A mix of safe, low-stock, and expiring ingredients.
2. **Purchase History**: Historical purchase logs to demonstrate tracking.
3. **Waste Records**: Realistic waste events over the past 30 days.

### How Recommendations Work
You **do not** add recommendations manually. The ServeStock AI Engine generates them automatically in the background by analyzing the seeded data:
- **Expiry Risk**: The engine flags ingredients as `WARNING`, `HIGH`, or `CRITICAL` based on how close they are to expiring versus their average daily usage.
- **Purchase Adjustment**: If the engine detects high waste volume for a specific ingredient over the last 30 days, it generates a high-priority recommendation to reduce future purchase quantities.

*Note: The current UI placeholders for "Add Ingredient" and "Record Purchase" will be fully integrated in the next development phase. For now, all data is managed via the auto-seed script.*

## 🧪 Testing

The backend intelligence engine and API endpoints are thoroughly tested.

To run the automated test suite:
```bash
cd backend
npm test
```

## 📜 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
