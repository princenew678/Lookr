import axios from 'axios';
import {API_BASE_URL} from '../utils/theme';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {'Content-Type': 'application/json'},
});

// ─────────────────────────────────────────
//  VIRTUAL TRY-ON
// ─────────────────────────────────────────
export interface TryOnRequest {
  personImageBase64?: string;
  clothImageBase64?: string;
  productUrl?: string;
  clothType?: string;
  strength?: number;
  mode: 'photo' | 'url' | 'mannequin' | 'snap';
  modelStyle?: string;
}

export interface TryOnResponse {
  success: boolean;
  analysis: string;
  suggestions?: string[];
  confidenceScore?: number;
  error?: string;
}

export const tryOnOutfit = async (req: TryOnRequest): Promise<TryOnResponse> => {
  const res = await api.post('/api/tryon', req);
  return res.data;
};

// ─────────────────────────────────────────
//  AI STUDIO FEATURES
// ─────────────────────────────────────────
export interface AIFeatureRequest {
  feature: 'aesthetic' | 'photoedit' | 'mannequin' | 'mix' | 'size' | 'style';
  imageBase64?: string;
  params?: Record<string, any>;
}

export const runAIFeature = async (req: AIFeatureRequest): Promise<{result: string}> => {
  const res = await api.post('/api/studio', req);
  return res.data;
};

// ─────────────────────────────────────────
//  PRODUCT URL SCRAPE
// ─────────────────────────────────────────
export const fetchProductFromUrl = async (url: string): Promise<{
  imageUrl: string;
  name: string;
  brand: string;
  price: string;
}> => {
  const res = await api.post('/api/product/fetch', {url});
  return res.data;
};

// ─────────────────────────────────────────
//  HEALTH CHECK
// ─────────────────────────────────────────
export const healthCheck = async (): Promise<boolean> => {
  try {
    const res = await api.get('/health');
    return res.status === 200;
  } catch {
    return false;
  }
};

export default api;
