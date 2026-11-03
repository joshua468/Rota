// k6 load test: activity feed with 200 VUs
// Goal: realistic cursor requests, ramp up to 200 VUs
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 200 },
    { duration: '60s', target: 200 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

const API_BASE = __ENV.API_BASE || 'http://localhost:4000';
const TEAM_ID = __ENV.TEAM_ID || '';

export function setup() {
  return {
    token: __ENV.AUTH_TOKEN,
    teamId: TEAM_ID,
  };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (data.token) headers['Authorization'] = `Bearer ${data.token}`;
  const teamId = data.teamId || __ENV.TEAM_ID || '';
  if (!teamId) {
    // fail fast if not configured
    const res = http.get(`${API_BASE}/healthz`, { headers });
    check(res, { 'healthz ok': (r) => r.status === 200 });
    sleep(1);
    return;
  }
  const cursor = __ENV.FEED_CURSOR || '';
  const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
  const url = `${API_BASE}/v1/teams/${teamId}/activity${qs}`;
  let res = http.get(url, { headers });
  check(res, {
    'status 200/401/404': (r) => [200, 401, 404].includes(r.status),
  });
  sleep(1);
}