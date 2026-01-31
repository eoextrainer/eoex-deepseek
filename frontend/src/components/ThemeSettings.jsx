import React, { useState } from 'react';
import { useThemeStore } from '../../store';
import { Button } from './index';

const THEMES = [
  { id: 'netflix', name: 'Netflix Dark', bg: '#141414', accent: '#e50914' },
  { id: 'disney', name: 'Disney+', bg: '#040714', accent: '#0063e5' },
  { id: 'dark', name: 'Dark Mode', bg: '#0f0f0f', accent: '#ff0000' },
  { id: 'light', name: 'Light Mode', bg: '#f5f5f5', accent: '#0070d2' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
];

export const ThemeSettings = () => {
  const { currentTheme, isDarkMode, currentLanguage, setTheme, toggleDarkMode, setLanguage } = useThemeStore();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {showSettings && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4 shadow-xl w-80">
          <h3 className="text-white text-lg font-bold mb-4">Settings</h3>

          {/* Theme Selection */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-semibold mb-3">Theme</h4>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`p-3 rounded-lg border-2 text-sm font-semibold transition-smooth ${
                    currentTheme === theme.id
                      ? 'border-red-600 bg-red-600/20 text-white'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="text-white text-sm font-semibold">Dark Mode</label>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDarkMode ? 'bg-red-600' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-semibold mb-3">Language</h4>
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setShowSettings(false)}
            className="w-full"
            size="sm"
          >
            Close
          </Button>
        </div>
      )}

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-smooth"
      >
        ⚙️
      </button>
    </div>
  );
};

export default ThemeSettings;
