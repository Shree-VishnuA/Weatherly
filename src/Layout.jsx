import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { WeatherProvider } from "./Context";

function Layout() {
  return (
    <WeatherProvider>
      <div className="flex items-center flex-col">
        <Navbar />
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </WeatherProvider>
  );
}

export default Layout;
