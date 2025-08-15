// src/WeatherContext.jsx
import { createContext, useState, useContext } from "react";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [city, setCity] = useState("Bangalore"); // default city

  return (
    <WeatherContext.Provider value={{ city, setCity }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
