export const themeList = [
  {
    id: 'netflix',
    name: 'Netflix theme',
    background: '#0B0B0B',
    surface: '#141414',
    accent: '#E50914',
    text: '#FFFFFF',
    mutedText: '#B3B3B3',
  },
  {
    id: 'play-games',
    name: 'Play Games',
    background: '#071A12',
    surface: '#0B2F1F',
    accent: '#34C759',
    text: '#EAF7FF',
    mutedText: '#B4C8D6',
  },
  {
    id: 'disney',
    name: 'Disney+',
    background: '#040714',
    surface: '#0C1633',
    accent: '#0063E5',
    text: '#FFFFFF',
    mutedText: '#B8C3E6',
  },
  {
    id: 'dark',
    name: 'Mode sombre',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    accent: '#FF1F5A',
    text: '#FFFFFF',
    mutedText: '#A0A0A0',
  },
  {
    id: 'light',
    name: 'Mode clair',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    accent: '#0070D2',
    text: '#111827',
    mutedText: '#4B5563',
  },
];

export const getThemeById = (id) => themeList.find((theme) => theme.id === id) || themeList[0];
