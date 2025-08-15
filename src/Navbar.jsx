import { Search, X } from "lucide-react";
import Logo from "./Components/Logo";
import { useState, useEffect, useRef } from "react";
import { useWeather } from "./Context";

function Navbar() {
  const { setCity } = useWeather();
  const [inputValue, setInputValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDesktopDropdown, setShowDesktopDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState("");

  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowDesktopDropdown(false);
      setShowMobileDropdown(false);
      setErrorMessage("");
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${inputValue}&limit=10&sort=-population`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_RAPID_API,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Network response not ok");
          return res.json();
        })
        .then((data) => {
          if (data.data && data.data.length > 0) {
            const indiaCities = data.data.filter(
              (city) => city.country === "IN"
            );

            let cityList = [];
            const exactMatch = indiaCities.find(
              (city) => city.name.toLowerCase() === inputValue.toLowerCase()
            );
            if (exactMatch) {
              cityList.push(`${exactMatch.name}, ${exactMatch.country}`);
            }

            cityList = cityList.concat(
              indiaCities
                .filter((city) => city !== exactMatch)
                .map((city) => `${city.name}, ${city.country}`)
            );

            if (cityList.length === 0) {
              cityList = data.data.map(
                (city) => `${city.name}, ${city.country}`
              );
            }

            setSuggestions(cityList);
            setActiveIndex(-1);
            setErrorMessage("");
            isSearchOpen
              ? setShowMobileDropdown(true)
              : setShowDesktopDropdown(true);
          } else {
            setSuggestions([]);
            setShowDesktopDropdown(false);
            setShowMobileDropdown(false);
            setErrorMessage("City not found");
          }
        })
        .catch(() => {
          setSuggestions([]);
          setShowDesktopDropdown(false);
          setShowMobileDropdown(false);
          setErrorMessage("Check your internet connection");
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputValue, isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        desktopRef.current &&
        !desktopRef.current.contains(e.target) &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target)
      ) {
        setShowDesktopDropdown(false);
        setShowMobileDropdown(false);
        setActiveIndex(-1);
      } else if (
        desktopRef.current &&
        !desktopRef.current.contains(e.target) &&
        !mobileRef.current
      ) {
        setShowDesktopDropdown(false);
        setActiveIndex(-1);
      } else if (
        mobileRef.current &&
        !mobileRef.current.contains(e.target) &&
        !desktopRef.current
      ) {
        setShowMobileDropdown(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setCity(inputValue);
      setIsSearchOpen(false);
      setShowDesktopDropdown(false);
      setShowMobileDropdown(false);
      document.activeElement.blur();
    }
  };

  const handleKeyDown = (e) => {
    const currentDropdown = isSearchOpen
      ? showMobileDropdown
      : showDesktopDropdown;
    if (!currentDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
      setInputValue("");
      setShowDesktopDropdown(false);
      setShowMobileDropdown(false);
      setActiveIndex(-1);
    }
  };

  const handleSelectSuggestion = (fullCityName) => {
    const cityOnly = fullCityName.split(",")[0];
    setInputValue(cityOnly);
    setCity(cityOnly);
    setShowDesktopDropdown(false);
    setShowMobileDropdown(false);
    setIsSearchOpen(false);
    setActiveIndex(-1);
    document.activeElement.blur();
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const input = document.querySelector("#mobile-search-input");
        if (input) input.focus();
      }, 100);
    }
  };

  const renderDropdown = (dropdownVisible) =>
    dropdownVisible &&
    (suggestions.length > 0 ? (
      <ul className="absolute top-full left-0 w-full bg-white shadow-lg border rounded-md mt-1 z-50">
        {suggestions.map((item, index) => (
          <li
            key={index}
            onMouseDown={() => handleSelectSuggestion(item)}
            className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-200 ${
              index === activeIndex ? "bg-gray-200" : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    ) : errorMessage ? (
      <p className="absolute top-full left-0 w-full bg-white text-sm text-red-500 px-4 py-2 border rounded-md mt-1 z-50">
        {errorMessage}
      </p>
    ) : null);

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 m-2 sm:m-3 lg:m-4 backdrop-blur-3xl bgwh p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl shadow-md z-50 mx-auto max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-24px)] lg:max-w-[calc(100vw-32px)]">
        <div className="flex justify-between items-center gap-3 sm:gap-4 lg:gap-6">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Mobile search button */}
          <button
            onClick={toggleSearch}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop search */}
          <div
            ref={desktopRef}
            className="relative hidden sm:flex gap-2 lg:gap-3 justify-center items-center border rounded-md sm:rounded-lg min-w-[280px] lg:min-w-[320px] p-1.5 sm:p-2 lg:p-2.5 bg-white shadow-sm"
          >
            <input
              type="text"
              placeholder="Enter a city"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue && setShowDesktopDropdown(true)}
              className="focus:outline-none bg-transparent flex-1 text-sm sm:text-base text-gray-700 placeholder-gray-500 min-w-0 px-1 sm:px-2"
            />

            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="flex-shrink-0 p-0.5 sm:p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              </button>
            )}

            <button
              onClick={handleSearch}
              className="flex-shrink-0 p-0.5 sm:p-1 lg:p-1.5 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              <Search className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            </button>

            {renderDropdown(showDesktopDropdown)}
          </div>
        </div>
      </div>

      {/* Mobile search*/}
      {isSearchOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] animate-in fade-in duration-200">
          <div className="fixed top-2 left-2 right-2 backdrop-blur-3xl bgwh p-3 rounded-lg shadow-lg animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-3">
              <Logo />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div
              ref={mobileRef}
              className="relative flex gap-2 items-center border rounded-lg w-full p-2 bg-white shadow-sm"
            >
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Enter a city name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => inputValue && setShowMobileDropdown(true)}
                autoComplete="off"
                className="focus:outline-none bg-transparent flex-1 text-base text-gray-700 placeholder-gray-500 min-w-0"
              />

              {inputValue && (
                <button
                  onClick={() => setInputValue("")}
                  className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}

              <button
                onClick={handleSearch}
                className="flex-shrink-0 p-1.5 bg-gray-500 text-white rounded-md transition-colors duration-200"
              >
                <Search className="w-4 h-4" />
              </button>

              {renderDropdown(showMobileDropdown)}
            </div>

            <p className="text-xs text-black mt-2 text-center">
              Try "New York", "London", or "Tokyo"
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
