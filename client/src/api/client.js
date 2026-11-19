import axios from 'axios';

/**
 * client.js
 *
 * Shared Axios instance. baseURL is '/api' so every call works both
 * in dev (proxied by Vite to http://localhost:5000) and in a
 * production build served behind the same reverse proxy as the API.
 */
const api = axios.create({
  baseURL: '/api',
});

export default api;
