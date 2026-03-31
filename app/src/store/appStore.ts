import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  imageUri: string;
  brand?: string;
  addedAt: string;
  tags?: string[];
}

export interface TryOnResult {
  id: string;
  personImageUri?: string;
  clothImageUri?: string;
  resultImageUri?: string;
  analysisText: string;
  mode: string;
  timestamp: string;
  liked?: boolean;
}

interface AppState {
  // API
  apiKeySet: boolean;

  // Wardrobe
  wardrobe: WardrobeItem[];
  addWardrobeItem: (item: WardrobeItem) => Promise<void>;
  removeWardrobeItem: (id: string) => Promise<void>;

  // History
  history: TryOnResult[];
  addHistory: (result: TryOnResult) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeHistoryItem: (id: string) => Promise<void>;

  // Init
  init: () => Promise<void>;
}

const STORAGE_KEYS = {
  WARDROBE: '@lookr_wardrobe',
  HISTORY: '@lookr_history',
};

export const useAppStore = create<AppState>((set, get) => ({
  apiKeySet: true, // backend handles auth
  wardrobe: [],
  history: [],

  init: async () => {
    try {
      const [wardrobeRaw, historyRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WARDROBE),
        AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
      ]);
      set({
        wardrobe: wardrobeRaw ? JSON.parse(wardrobeRaw) : [],
        history: historyRaw ? JSON.parse(historyRaw) : [],
      });
    } catch (e) {
      console.error('Store init error:', e);
    }
  },

  addWardrobeItem: async item => {
    const next = [item, ...get().wardrobe];
    set({wardrobe: next});
    await AsyncStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(next));
  },

  removeWardrobeItem: async id => {
    const next = get().wardrobe.filter(w => w.id !== id);
    set({wardrobe: next});
    await AsyncStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(next));
  },

  addHistory: async result => {
    const next = [result, ...get().history].slice(0, 50);
    set({history: next});
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
  },

  toggleLike: async id => {
    const next = get().history.map(h =>
      h.id === id ? {...h, liked: !h.liked} : h,
    );
    set({history: next});
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
  },

  clearHistory: async () => {
    set({history: []});
    await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  removeHistoryItem: async id => {
    const next = get().history.filter(h => h.id !== id);
    set({history: next});
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
  },
}));
