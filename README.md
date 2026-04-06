# Premium Fashion Store Dashboard & Admin Panel

A high-performance, fully responsive fashion store management dashboard with cross-device cloud synchronization.

## ✨ Key Features
- **📱 Ultra-Responsive Design**: Seamlessly transitions from desktop to high-end mobile "stacking card" views.
- **☁️ Cloud Sync (Firebase)**: Register on PC and log in on Mobile. All data (orders, profile, settings) syncs instantly.
- **🛡️ Multi-Role Security**: Admin vs. User role-based access control.
- **⚙️ Dynamic Management**: Real-time order tracking, user management, and performance analytics.
- **💾 Local Fallback**: Continues to work offline using state-of-the-art LocalStorage patterns.

## 🚀 Getting Started

### 1. Prerequisites
- Any modern web browser.
- A free [Firebase Account](https://console.firebase.google.com/) (Required for cross-device sync).

### 2. Setup (Cloud Sync)
To enable registration and login to work across different devices, you must add your Firebase configuration:
1. Create a new project in the **Firebase Console**.
2. Add a "Web App" and copy the provided `firebaseConfig`.
3. Open `dashboard.html` and find the `<script>` section around **line 1107**.
4. Replace the placeholder values with your real Firebase keys.
5. In your Firebase Console, enable **Authentication** (Email/Password) and **Cloud Firestore**.

### 3. Usage
- **Admin Login**: `admin@gmail.com` / `admin123`
- **User Flow**: Register a new account to see personal order history and profile settings.

## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla JavaScript, CSS3
- **Design**: Google Fonts (Inter), FontAwesome 6, Animate.css, Owl Carousel
- **Backend/Cloud**: Firebase Auth & Firestore

## 📄 License
MIT License - Feel free to use this for your own store!
