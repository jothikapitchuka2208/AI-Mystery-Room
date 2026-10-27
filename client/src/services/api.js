import axios from 'axios';

// Base URL: In dev with proxy, '/api' forwards to http://localhost:5000/api
// If accessed directly or deployed, uses env VITE_API_URL or defaults to http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// Interceptor for friendly logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.error || error.message || 'Unknown network error';
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

/**
 * Generate a new mystery case
 * @param {Object} params
 * @param {string} params.premise
 * @param {string} params.difficulty ('Easy' | 'Medium' | 'Hard')
 */
export async function createCase({ premise, difficulty }) {
  const response = await api.post('/cases', { premise, difficulty });
  return response.data;
}

/**
 * Fetch an existing active case by ID
 * @param {string} id
 */
export async function getCase(id) {
  const response = await api.get(`/cases/${id}`);
  return response.data;
}

/**
 * Discover a clue and award +5 points
 * @param {string} caseId
 * @param {string} clueId
 */
export async function discoverClue(caseId, clueId) {
  const response = await api.post(`/cases/${caseId}/clues/${clueId}/discover`);
  return response.data;
}

/**
 * Request next hint with -10 points penalty
 * @param {string} caseId
 */
export async function requestHint(caseId) {
  const response = await api.post(`/cases/${caseId}/hints`);
  return response.data;
}

/**
 * Submit final accusation
 * @param {string} caseId
 * @param {string} suspectId
 * @param {string} reasoning
 */
export async function accuseSuspect(caseId, suspectId, reasoning) {
  const response = await api.post(`/cases/${caseId}/accuse`, { suspectId, reasoning });
  return response.data;
}

/**
 * Fetch case results after accusation has been filed
 * @param {string} caseId
 */
export async function getCaseResult(caseId) {
  const response = await api.get(`/cases/${caseId}/result`);
  return response.data;
}

/**
 * Health check to verify backend status
 */
export async function checkBackendHealth() {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export default api;
