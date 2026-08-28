import { analyzeUrlHeuristics } from './heuristicEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Checks if the backend API server is reachable
 */
export async function checkBackendStatus() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return { online: true, url: API_BASE_URL, message: data.message || 'Connected to Python Backend' };
    }
    return { online: false, url: API_BASE_URL, message: `Server responded with ${response.status}` };
  } catch (err) {
    return { online: false, url: API_BASE_URL, message: 'Backend offline (Using Built-in Heuristics)' };
  }
}

/**
 * Main URL scanning function: calls Python Backend if available, else uses client heuristics
 */
export async function scanUrl(rawUrl, options = { forceMock: false }) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    throw new Error('Please enter a valid URL.');
  }

  const cleanUrl = rawUrl.trim();

  // If user explicitly tests client mock or no backend URL is set
  if (options.forceMock) {
    await new Promise((r) => setTimeout(r, 450));
    return analyzeUrlHeuristics(cleanUrl);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: cleanUrl }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return normalizeBackendResponse(data, cleanUrl);
    }
    
    // If backend returns 4xx/5xx, fall back to heuristics
    console.warn(`Backend responded with ${response.status}. Falling back to client-side heuristics.`);
    await new Promise((r) => setTimeout(r, 350));
    return analyzeUrlHeuristics(cleanUrl);
  } catch (err) {
    // Backend offline / network error: seamless fallback
    console.info('Backend unreachable, executing client-side ML heuristic engine.');
    await new Promise((r) => setTimeout(r, 400));
    return analyzeUrlHeuristics(cleanUrl);
  }
}

/**
 * Normalizes Python Flask/FastAPI responses into the standard frontend data structure
 */
function normalizeBackendResponse(data, originalUrl) {
  // Support both custom format and standard format
  const score = typeof data.score === 'number' ? Math.round(data.score) : (data.risk_score || 0);
  
  let verdict = 'SAFE';
  let category = 'Safe';
  let statusBadge = '✅ Safe';
  let color = 'emerald';

  if (score >= 66 || data.verdict === 'HIGH_RISK' || data.is_phishing === true) {
    verdict = 'HIGH_RISK';
    category = 'High Risk';
    statusBadge = '🚨 High Risk';
    color = 'rose';
  } else if (score >= 26 || data.verdict === 'SUSPICIOUS') {
    verdict = 'SUSPICIOUS';
    category = 'Suspicious';
    statusBadge = '⚠️ Suspicious';
    color = 'amber';
  }

  // Fallback to client heuristics for flags if backend only sent score
  const heuristicBackup = analyzeUrlHeuristics(originalUrl);

  return {
    url: originalUrl,
    cleanUrl: originalUrl,
    score: score,
    verdict: data.verdict || verdict,
    category: data.category || category,
    statusBadge: statusBadge,
    color: color,
    summary: data.summary || data.explanation || heuristicBackup.summary,
    flags: Array.isArray(data.flags) && data.flags.length > 0 ? data.flags : heuristicBackup.flags,
    metrics: data.metrics || heuristicBackup.metrics,
    modelConfidence: data.confidence || data.model_confidence || null,
    modelName: data.model_name || data.model || 'Random Forest / ML Classifier',
    scanTimestamp: data.timestamp || new Date().toISOString(),
    engine: data.engine || 'Python Backend (Flask/FastAPI)',
    source: 'backend_api'
  };
}
