import { useEffect, useState } from "react";
import {
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Sunrise,
  Sunset,
  Compass,
  Eye,
  Gauge,
  Sun,
  CloudRain,
  Zap,
  Activity,
  Moon,
  MoonStar,
  Calendar,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudFog,
  AlertTriangle,
  RefreshCw,
  Home,
} from "lucide-react";
import { useWeather } from "./Context";

// Weather themes mapping
const weatherThemes = {
  Clear: {
    bg: "bg-yellow-500",
    text: "text-yellow-1000",
    accent: "bg-yellow-300",
    emoji: "☀️",
  },
  Clouds: {
    bg: "bg-gray-400",
    text: "text-gray-900",
    accent: "bg-gray-300",
    emoji: "☁️",
  },
  Rain: {
    bg: "bg-blue-600",
    text: "text-white",
    accent: "bg-blue-500",
    emoji: "🌧️",
  },
  Thunderstorm: {
    bg: "bg-purple-700",
    text: "text-yellow-300",
    accent: "bg-purple-500",
    emoji: "⛈️",
  },
  Snow: {
    bg: "bg-white",
    text: "text-blue-800",
    accent: "bg-blue-200",
    emoji: "❄️",
  },
  Mist: {
    bg: "bg-gray-200",
    text: "text-gray-700",
    accent: "bg-gray-300",
    emoji: "🌫️",
  },
  Wind: {
    bg: "bg-blue-200",
    text: "text-gray-900",
    accent: "bg-blue-300",
    emoji: "🌬️",
  },
  Night: {
    bg: "bg-indigo-900",
    text: "text-white",
    accent: "bg-indigo-700",
    emoji: "🌙",
  },
  Default: {
    bg: "bg-gradient-to-br from-blue-400 to-blue-600",
    text: "text-white",
    accent: "bg-blue-500",
    emoji: "🌤️",
  },
};

// Error Component
const ErrorDisplay = ({ error, onRetry, onGoHome, theme }) => (
  <div
    className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center p-4`}
  >
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-md w-full text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle
          className={`w-16 h-16 sm:w-20 sm:h-20 ${theme.text} opacity-80`}
        />
      </div>

      <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${theme.text}`}>
        Oops! Something went wrong
      </h2>

      <div
        className={`text-sm sm:text-base mb-6 ${theme.text} opacity-90 space-y-2`}
      >
        {error.type === "city_not_found" && (
          <>
            <p>We couldn't find the city you searched for.</p>
            <p className="text-xs opacity-75">
              Please check the spelling and try again.
            </p>
          </>
        )}
        {error.type === "network_error" && (
          <>
            <p>Unable to connect to weather services.</p>
            <p className="text-xs opacity-75">
              Please check your internet connection.
            </p>
          </>
        )}
        {error.type === "location_error" && (
          <>
            <p>Unable to access your location.</p>
            <p className="text-xs opacity-75">
              Please allow location access or search manually.
            </p>
          </>
        )}
        {error.type === "data_error" && (
          <>
            <p>Weather data is temporarily unavailable.</p>
            <p className="text-xs opacity-75">Please try again in a moment.</p>
          </>
        )}
        {!error.type && (
          <>
            <p>An unexpected error occurred.</p>
            <p className="text-xs opacity-75">
              Please try refreshing the page.
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onRetry}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 
                     rounded-lg transition-colors duration-200 ${theme.text} font-medium`}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        <button
          onClick={onGoHome}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 
                     rounded-lg transition-colors duration-200 ${theme.text} font-medium`}
        >
          <Home className="w-4 h-4" />
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// Loading Component
const LoadingDisplay = ({ theme }) => (
  <div
  className={`flex items-center justify-center min-h-screen ${theme.bg} ${theme.text}`}
>
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="relative w-16 h-16 sm:w-24 sm:h-24">
      <div
        className="absolute inset-0 rounded-full border-4 sm:border-6 border-l-transparent border-r-transparent animate-spin-slow"
        style={{
          borderTopColor: theme.primary,
          borderBottomColor: theme.secondary,
        }}
      ></div>
      <div
        className="absolute inset-4 sm:inset-6 rounded-full animate-pulse-glow"
        style={{
          backgroundColor: theme.primary,
        }}
      ></div>
    </div>
  </div>
</div>

);

function Landing() {
  const { city, setCity } = useWeather();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [extendedWeather, setExtendedWeather] = useState([]);
  const [theme, setTheme] = useState(weatherThemes.Default);
  const API_KEY = import.meta.env.VITE_MY_API;

  // Validate weather data structure
  const isValidWeatherData = (data) => {
    return (
      data &&
      data.current &&
      data.current.condition &&
      data.location &&
      data.forecast &&
      data.forecast.forecastday &&
      data.forecast.forecastday[0] &&
      data.current.air_quality
    );
  };

  useEffect(() => {
    const initializeWeather = async () => {
      setError(null);
      setLoading(true);

      if (city?.trim()) {
        await fetchWeatherByCity(city);
      } else {
        // Try geolocation first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
            (err) => {
              console.warn("Geolocation failed:", err);
              setError({
                type: "location_error",
                message: "Unable to access location",
              });
              fetchWeatherByCity("Bangalore"); // Fallback city
            },
            { timeout: 10000 } // 10 second timeout
          );
        } else {
          fetchWeatherByCity("Bangalore");
        }
      }
    };

    initializeWeather();
  }, [city]);

  useEffect(() => {
    if (weather && isValidWeatherData(weather)) {
      const mainWeather = weather.current.condition.text.toLowerCase();
      if (mainWeather.includes("clear")) setTheme(weatherThemes.Clear);
      else if (mainWeather.includes("cloud")) setTheme(weatherThemes.Clouds);
      else if (mainWeather.includes("rain")) setTheme(weatherThemes.Rain);
      else if (mainWeather.includes("thunder"))
        setTheme(weatherThemes.Thunderstorm);
      else if (mainWeather.includes("snow")) setTheme(weatherThemes.Snow);
      else if (mainWeather.includes("mist") || mainWeather.includes("fog"))
        setTheme(weatherThemes.Mist);
      else setTheme(weatherThemes.Clear);
    }
  }, [weather]);

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        setError({
          type: "location_error",
          message: data.error.message || "Location not found",
        });
        return;
      }

      if (!isValidWeatherData(data)) {
        setError({
          type: "data_error",
          message: "Incomplete weather data received",
        });
        return;
      }

      setWeather(data);
      await fetchExtendedWeather(`${lat},${lon}`, data);
    } catch (err) {
      console.error("Fetch weather by coords error:", err);
      setError({
        type: "network_error",
        message: "Unable to fetch weather data",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
          cityName
        )}&days=4&aqi=yes&alerts=yes`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        setError({
          type: "city_not_found",
          message: data.error.message || "City not found",
        });
        return;
      }

      if (!isValidWeatherData(data)) {
        setError({
          type: "data_error",
          message: "Incomplete weather data received",
        });
        return;
      }

      setWeather(data);
      await fetchExtendedWeather(cityName, data);
    } catch (err) {
      console.error("Fetch weather by city error:", err);
      setError({
        type: "network_error",
        message: "Unable to fetch weather data",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExtendedWeather = async (locationQuery, forecastData) => {
    try {
      const today = new Date();
      const historyData = [];

      // Fetch historical data with error handling
      for (let i = 1; i <= 3; i++) {
        try {
          const pastDate = new Date(today);
          pastDate.setDate(today.getDate() - i);
          const dateStr = pastDate.toISOString().split("T")[0];

          const res = await fetch(
            `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${locationQuery}&dt=${dateStr}`
          );

          if (res.ok) {
            const json = await res.json();
            if (!json.error && json.forecast && json.forecast.forecastday) {
              historyData.push(json);
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch history for day ${i}:`, err);
          // Continue with other days even if one fails
        }
      }

      const merged = [
        ...historyData.reverse().map((d) => ({
          date: formatDate(d.forecast.forecastday[0].date),
          day: d.forecast.forecastday[0].day,
          astro: d.forecast.forecastday[0].astro,
        })),
        ...forecastData.forecast.forecastday.map((d) => ({
          date: formatDate(d.date),
          day: d.day,
          astro: d.astro,
        })),
      ];

      setExtendedWeather(merged);
    } catch (err) {
      console.error("Extended weather fetch error:", err);
      // Don't set error here as main weather data is still valid
    }
  };

  // Error handlers
  const handleRetry = () => {
    if (city?.trim()) {
      fetchWeatherByCity(city);
    } else {
      fetchWeatherByCity("Bangalore");
    }
  };

  const handleGoHome = () => {
    setCity("");
    setError(null);
    fetchWeatherByCity("Bangalore");
  };

  const getAQILevel = (pm) => {
    if (pm <= 50) return "bg-green-400";
    if (pm <= 100) return "bg-yellow-400";
    if (pm <= 150) return "bg-orange-400";
    return "bg-red-400";
  };

  function getWeatherIcon(condition) {
    const text = condition?.toLowerCase() || "";
    if (text.includes("sun") || text.includes("clear"))
      return <Sun className="w-full h-full" />;
    if (text.includes("cloud")) return <Cloud className="w-full h-full" />;
    if (text.includes("rain")) return <CloudRain className="w-full h-full" />;
    if (text.includes("snow")) return <CloudSnow className="w-full h-full" />;
    if (text.includes("thunder") || text.includes("storm"))
      return <CloudLightning className="w-full h-full" />;
    if (text.includes("fog") || text.includes("mist"))
      return <CloudFog className="w-full h-full" />;
    if (text.includes("night")) return <Moon className="w-full h-full" />;
    return <Cloud className="w-full h-full" />; // fallback
  }

  // Show loading state
  if (loading) {
    return <LoadingDisplay theme={theme} />;
  }

  // Show error state
  if (error || !weather || !isValidWeatherData(weather)) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
        theme={theme}
      />
    );
  }

  // Extract data safely
  const current = weather.current;
  const location = weather.location;
  const day = weather.forecast?.forecastday[0]?.day;
  const astro = weather.forecast?.forecastday[0]?.astro;
  const airQuality = current.air_quality;

  return (
    <div
      className={`${theme.bg} min-h-screen ${theme.text} flex flex-col items-center px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10 transition-all duration-700`}
    >
      {/* Rest of your existing JSX code remains exactly the same */}
      {/* Heading */}
      <div className="mt-4 sm:mt-8 lg:mt-15 text-center max-w-full">
        <p
          className={`mt-2 text-sm sm:text-base lg:text-lg ${theme.text} px-2`}
        >
          Real-time weather, air quality, and forecasts for {location.name}
        </p>
      </div>

      {/* Location */}
      <div className="bg-white/10 backdrop-blur-lg mt-4 sm:mt-6 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 max-w-full sm:max-w-2xl w-full text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 border rounded-md p-2 sm:p-3 border-gray-500">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <h2
            className={`text-lg sm:text-xl lg:text-2xl font-bold ${theme.text} text-center sm:text-left`}
          >
            <span className={`${theme.text} text-xl sm:text-2xl lg:text-3xl`}>
              {location.name}
            </span>
            <span className="text-sm sm:text-base lg:text-xl">
              , {location.region}, {location.country}
            </span>
          </h2>
        </div>
        <p
          className={`${theme.text} text-xs sm:text-sm mt-1 break-all sm:break-normal`}
        >
          {location.tz_id}
        </p>
        <p className={`${theme.text} text-xs sm:text-sm`}>
          Local time: {location.localtime}
        </p>
      </div>

      {/* Current Weather */}
      <div className="bg-white/15 mt-4 sm:mt-6 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-full sm:max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Temperature & Condition */}
          <div className="flex flex-col items-center text-center w-full lg:w-auto">
            <img
              src={current.condition.icon}
              alt="Weather Icon"
              className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 drop-shadow-lg"
            />
            <h1
              className={`text-4xl sm:text-5xl lg:text-7xl font-extrabold mt-2 sm:mt-3 ${theme.text}`}
            >
              {current.temp_c}°C
            </h1>
            <p
              className={`text-base sm:text-lg lg:text-xl mt-1 sm:mt-2 ${theme.text}`}
            >
              {current.condition.text}
            </p>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 flex-1 text-xs sm:text-sm w-full">
            {[
              {
                icon: <Thermometer className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Feels Like",
                value: `${current.feelslike_c}°C`,
              },
              {
                icon: <Wind className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Wind",
                value: `${current.wind_kph} km/h`,
              },
              {
                icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Direction",
                value: current.wind_dir,
              },
              {
                icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Gust",
                value: `${current.gust_kph} km/h`,
              },
              {
                icon: <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Humidity",
                value: `${current.humidity}%`,
              },
              {
                icon: <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Cloud Cover",
                value: `${current.cloud}%`,
              },
              {
                icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Visibility",
                value: `${current.vis_km} km`,
              },
              {
                icon: <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />,
                label: "Pressure",
                value: `${current.pressure_mb} mb`,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl hover:bg-white/20 transition ${theme.text} min-w-0`}
              >
                <div className="p-1 sm:p-2 bg-opacity-20 rounded-full flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    {item.label}
                  </p>
                  <p className="text-xs sm:text-sm truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Forecast */}
      {day && (
        <div
          className={`bg-white/15 mt-4 sm:mt-6 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-full sm:max-w-4xl w-full ${theme.text}`}
        >
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> Today's Forecast
          </h3>
          <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
            <p className="flex flex-wrap gap-1">
              <span>Max Temp: {day.maxtemp_c}°C</span>
              <span className="text-gray-300">|</span>
              <span>Min Temp: {day.mintemp_c}°C</span>
            </p>
            <p>Chance of Rain: {day.daily_chance_of_rain}%</p>
            <p>UV Index: {day.uv}</p>
          </div>
        </div>
      )}

      {/* Astro Data */}
      {astro && (
        <div
          className={`bg-white/15 mt-4 sm:mt-6 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-full sm:max-w-4xl w-full ${theme.text}`}
        >
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> Astronomy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm sm:text-base">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Sunrise className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Sunrise: {astro.sunrise}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Sunset className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Sunset: {astro.sunset}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <MoonStar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Moonrise: {astro.moonrise}</span>
            </div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <MoonStar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Moonset: {astro.moonset}</span>
            </div>
          </div>
        </div>
      )}

      {/* Air Quality */}
      {airQuality && (
        <div
          className={`bg-white/15 mt-4 sm:mt-6 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 max-w-full sm:max-w-4xl w-full ${theme.text}`}
        >
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" /> Air Quality
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <p
                className={`${getAQILevel(
                  airQuality.pm2_5
                )} px-2 py-1 rounded-md inline-block text-xs sm:text-sm`}
              >
                PM2.5: {airQuality.pm2_5.toFixed(1)}
              </p>
              <p className="text-xs text-gray-300">
                Tiny particles harmful to lungs
              </p>
            </div>
            <div className="space-y-1">
              <p
                className={`${getAQILevel(
                  airQuality.pm10
                )} px-2 py-1 rounded-md inline-block text-xs sm:text-sm`}
              >
                PM10: {airQuality.pm10.toFixed(1)}
              </p>
              <p className="text-xs text-gray-300">Slightly bigger particles</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm">
                CO: {airQuality.co.toFixed(1)}
              </p>
              <p className="text-xs text-gray-300">
                Carbon monoxide reduces oxygen
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm">
                NO₂: {airQuality.no2.toFixed(1)}
              </p>
              <p className="text-xs text-gray-300">Irritates lungs</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm">
                SO₂: {airQuality.so2.toFixed(1)}
              </p>
              <p className="text-xs text-gray-300">Worsens breathing issues</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm">
                O₃: {airQuality.o3.toFixed(1)}
              </p>
              <p className="text-xs text-gray-300">
                Ground-level ozone can trigger chest pain
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extended Timeline */}
      <div
        className={`bg-white/15 mt-4 sm:mt-6 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 w-full ${theme.text}`}
      >
        {/* Header */}
        <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 lg:mb-5 flex items-center gap-2 px-1 sm:px-0">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
          <span className="leading-tight">
            Past 3 Days, Today & Next 3 Days
          </span>
        </h3>

        <div className="relative">
         

          {/* Scrollable Timeline */}
          <div
            className={`flex justify-evenly overflow-x-auto ${theme.text} gap-2 sm:gap-3 lg:gap-4 xl:gap-5 pb-3 sm:pb-4 pt-2 scrollbar-hide snap-x snap-mandatory`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitScrollbar: { display: "none" },
            }}
          >
            {extendedWeather.map((d, index) => {
              const todayStr = formatDate(new Date());
              const isToday = d.date === todayStr;
              return (
                <div
                  key={d.date}
                  className={`
                    min-w-[130px] sm:min-w-[150px] md:min-w-[165px] lg:min-w-[180px] xl:min-w-[200px]
                    max-w-[130px] sm:max-w-[150px] md:max-w-[165px] lg:max-w-[180px] xl:max-w-[200px]
                    border border-gray-500/30 shadow-lg rounded-lg sm:rounded-xl lg:rounded-2xl 
                    p-2 sm:p-3 lg:p-4 flex-shrink-0 flex-grow-0
                    transition-all duration-300 ease-in-out
                    hover:shadow-2xl hover:-translate-y-1
                    snap-center
                    ${
                      isToday
                        ? "bg-gradient-to-br from-yellow-400/40 to-orange-400/30 border-2 border-amber-300/60 shadow-amber-200/50 hover:scale-[1.02]"
                        : "bg-white/10 hover:bg-white/15 border-gray-400/40 hover:scale-[1.02]"
                    }
                  `}
                >
                  <div className="mb-2 sm:mb-3">
                    <p
                      className={`font-bold text-center text-xs sm:text-sm lg:text-base leading-tight ${
                        isToday ? "text-amber-100" : theme.text
                      }`}
                    >
                      {d.date}
                    </p>
                    {isToday && (
                      <p className="text-center text-xs font-medium text-amber-200 mt-0.5">
                        TODAY
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 flex items-center justify-center">
                      {getWeatherIcon(d.day.condition.text)}
                    </div>
                  </div>

                  <p className="text-center text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 leading-tight font-medium px-1">
                    {d.day.condition.text}
                  </p>

                  <div className="text-center mb-3 sm:mb-4">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {d.day.avgtemp_c}°C
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                      {d.day.mintemp_c}° / {d.day.maxtemp_c}°
                    </p>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Droplets className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-300" />
                      <span className="text-xs sm:text-sm truncate">
                        {d.day.avghumidity}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Wind className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-300" />
                      <span className="text-xs sm:text-sm truncate">
                        {d.day.maxwind_kph} km/h
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <CloudRain className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-400" />
                      <span className="text-xs sm:text-sm truncate">
                        {d.day.totalprecip_mm}mm
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-400/20">
                    <div className="grid grid-cols-1 gap-1 sm:gap-1.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Sunrise className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-yellow-300" />
                          <span className="truncate">{d.astro.sunrise}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Sunset className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-orange-300" />
                          <span className="truncate">{d.astro.sunset}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-2 sm:mt-3">
            <div className="flex gap-1">
              {extendedWeather.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white/30"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 sm:mt-6 text-xs text-white/60 text-center px-2">
        Powered by WeatherAPI.com | Created by Vishnu
      </footer>
    </div>
  );
}

export default Landing;
