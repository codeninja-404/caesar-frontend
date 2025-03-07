// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const Header = ({ isDarkMode, setIsDarkMode }) => (
  <div className="flex justify-between items-center w-full max-w-3xl mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
    <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
      CaesarMail
    </h1>
    <div className="flex items-center space-x-4">
      <Link
        to="/about"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
      >
        About
      </Link>
      <Switch
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        aria-label="Toggle dark mode"
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  </div>
);

export default Header;
