import { Search, User, Bell } from "lucide-react";
import { useState } from "react";

const Header = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg border border-black">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section: Title */}
        <h1 className="text-2xl font-semibold text-black">{title}</h1>

        {/* Middle Section: Search */}
        <div className="relative w-1/3">
          <Search
            size={20}
            className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right Section: Notification & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none">
            <Bell size={24} className="text-gray-600" />
            {/* Notification Badge (if needed) */}
            <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              <User size={24} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-300 z-10">
                <ul className="py-2 text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
