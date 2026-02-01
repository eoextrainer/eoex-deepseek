import React from 'react';
import { useThemeStore } from '../store';

const THEMES = [
  { id: 'netflix', name: 'Netflix sombre' },
  { id: 'disney', name: 'Disney+' },
  { id: 'dark', name: 'Mode sombre' },
  { id: 'light', name: 'Mode clair' },
];

const ThemeSelector = () => {
  const { currentTheme, setTheme } = useThemeStore();

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <label htmlFor="theme-select" className="block text-xs text-gray-300 mb-2">
          Thème actif
        </label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          {THEMES.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ThemeSelector;
