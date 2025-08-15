# 🌤️ Weatherly



> **Weatherly** — A sleek, modern, and responsive weather application that delivers real-time weather conditions, forecasts, and air quality data for any location worldwide.  
Built with **React**, **Vite**, and **Tailwind CSS** for speed and performance.

---



## 📖 About the Project

Weatherly is designed to be your **go-to weather companion** — whether you need to check the **current temperature**, **7-day forecasts**, **past weather history**, or **air quality levels**, this app has you covered.  
It combines **minimalist design**, **real-time data**, and **intelligent UI theming** that adapts to the current weather conditions.

**Why Weatherly?**
- ⚡ Fast loading (thanks to Vite)
- 🎨 Eye-friendly design
- 📊 Accurate and reliable data
- 📱 Mobile-first responsiveness
- 🌍 Global location support
- 🔄 Real-time updates

---

## ✨ Features

✅ **Live Weather Data** — Temperature, humidity, pressure, wind speed, and more  
✅ **Search Suggestions** — Auto-complete city names as you type  
✅ **Dynamic UI Themes** — Background and text colors change with the weather  
✅ **Extended Timeline** — Past 3 days, today, and next 3 days  
✅ **Air Quality Index (AQI)** — Real-time pollution levels  
✅ **Sunrise & Sunset Times** — Based on local timezone  
✅ **Weather Icons** — Beautiful weather condition icons  
✅ **Unit Conversion** — Celsius/Fahrenheit toggle  
✅ **Geolocation Support** — Auto-detect user location  
✅ **Fully Responsive** — Works on mobile, tablet, and desktop  

---

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | ^18.0.0 |
| **Vite** | Lightning-fast build tool | ^4.0.0 |
| **Tailwind CSS** | Utility-first styling | ^3.0.0 |
| **Lucide React** | Icon library | ^0.263.0 |
| **OpenWeatherMap API** | Weather data source | v2.5 |
| **Context API** | Global state management | Built-in |

---

## 📁 Project Structure

<pre>
WEATHER-APP/
├── dist/                       # Build output directory
├── node_modules/               # Dependencies
├── public/
│   ├── Logo.png               # App logo
│   └── vite.svg               # Vite logo
├── src/
│   ├── assets/                # Static assets (images, icons)
│   ├── Components/            # React components
│   │   ├── Logo.jsx           # Logo component
│   │   ├── Context.jsx        # Context API for state management
│   │   ├── Landing.jsx        # Main landing/home page
│   │   ├── Layout.jsx         # App layout wrapper
│   │   ├── Navbar.jsx         # Navigation component
│   │   └── main.jsx           # Main app component
│   └── index.css              # Global styles
├── .gitignore                 # Git ignore rules
├── eslint.config.js           # ESLint configuration
├── index.html                 # HTML template
├── package-lock.json          # Locked dependency versions
├── package.json               # Project dependencies & scripts
├── README.md                  # Project documentation
└── vite.config.js             # Vite configuration
</pre>


---

## 📥 Installation

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/your-username/Weatherly.git
cd Weatherly
```

2️⃣ **Install Dependencies**

```bash
npm install
```

3️⃣ Create a .env File
```env
VITE_WEATHER_API_KEY=your_api_key_here
```
Prerequisite : Your own API key

4️⃣ Run the Development Server
```bash
npm run dev
```
---

💻 Usage

- Start the dev server (npm run dev)

- Open http://localhost:5173 in your browser

- Search for a city and view:

   - Current weather

   - Forecast for past/future days

   - AQI levels

   - Sunrise & sunset time

  ---
 
🌍 Deployment

You can deploy Weatherly on:

 - GitHub Pages

 - Vercel

 - Netlify

   Currently its hosted on GitHub pages

Example (Vercel):
```bash
npm run build
vercel deploy
```
---
Link : https://shree-vishnua.github.io/Weatherly/

