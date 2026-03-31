export const COLORS = {
  bg: '#0a0a0f',
  surface: '#13131a',
  surface2: '#1c1c28',
  border: '#2a2a3d',
  accent: '#c8ff3e',
  accent2: '#ff6b9d',
  accent3: '#7b61ff',
  text: '#f0f0f8',
  textMuted: '#7a7a9a',
  error: '#ff4d4f',
  success: '#52c41a',
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(10,10,15,0.85)',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    hero: 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  accent: {
    shadowColor: '#c8ff3e',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://your-backend.railway.app'; // <-- replace with your deployed backend URL
