// k6 load test: calendar week range reads
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

const API_BASE = __ENV.API_BASE || 'http://localhost:4000';
const TEAM_ID = __ENV.TEAM_ID || '';

export function setup() {
  return { token: __ENV.AUTH_TOKEN, teamId: TEAM_ID };
}

export default function (data) {
  const headers = {};
  if (data.token) headers['Authorization'] = `Bearer ${data.token}`;
  const teamId = data.teamId || TEAM_ID;
  if (!teamId) return;
  const now = Date.now();
  const weekStart = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
  const weekEnd = new Date(now + 4 * 24 * 60 * 60 * 1000).toISOString();
  let res = http.get(
    `${API_BASE}/v1/teams/${teamId}/shifts?from=${encodeURIComponent(weekStart)}&to=${encodeURIComponent(weekEnd)}`,
    { headers }
  );
  check(res, {
    'status 200/401/404': (r) => [200, 401, 404].includes(r.status),
  });
  sleep(0.5);
}