import axios from 'axios';

const getBaseURL = () => {
  // In production (Cloudflare Pages / Netlify / custom domain), check VITE_API_URL
  const envUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) {
    if (envUrl && envUrl.startsWith('https://') && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.replace(/\/+$/, '');
    }
    // Same-origin '/api' proxies to serverless functions in Netlify & Cloudflare Pages
    return '/api';
  }
  // In local development, use envUrl or fallback to local Express backend
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('artish_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Robust consultation form enquiry submission.
 * First tries standard configured endpoint (/api/enquiries).
 * If the static host or CDN serves SPA HTML or returns a 404/405 rewrite error,
 * automatically falls back directly to the Netlify serverless endpoint (/.netlify/functions/enquiries).
 */
export const submitConsultationEnquiry = async (data) => {
  try {
    const res = await API.post('/enquiries', data);
    // Guard against static host serving SPA HTML (index.html) as a 200 response
    if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
      throw new Error('Endpoint returned SPA HTML document instead of JSON');
    }
    return res.data;
  } catch (primaryErr) {
    const responseData = primaryErr.response?.data;
    const isHtml = typeof responseData === 'string' && responseData.includes('<!doctype html>');
    const status = primaryErr.response?.status;
    const isRoutingError = status === 404 || status === 405 || isHtml;

    if (isRoutingError) {
      console.warn('[API Service] /api/enquiries encountered routing error (status ' + status + '). Attempting direct Netlify function fallback...');
      try {
        const netlifyRes = await axios.post('/.netlify/functions/enquiries', data, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (netlifyRes.data && typeof netlifyRes.data === 'object') {
          return netlifyRes.data;
        }
      } catch (fallbackErr) {
        console.error('[API Service] Netlify function fallback also failed:', fallbackErr.message);
        throw fallbackErr.response?.data ? fallbackErr : primaryErr;
      }
    }
    throw primaryErr;
  }
};

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Local static frontend assets (/videos/*) must always resolve to frontend root
  if (cleanPath.startsWith('/videos/')) {
    return cleanPath;
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.startsWith('http')) {
    const backendOrigin = envUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${cleanPath}`;
  }
  return cleanPath;
};

export default API;
