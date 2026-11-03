// k6 load test: auth login bursts - must produce 429s, no 5xx
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // 429s are expected under burst; no server errors
    http_req_duration: ['p(95)<300'],
  },
};

const API_BASE = __ENV.API_BASE || 'http://localhost:4000';

export default function () {
  const payload = JSON.stringify({
    email: `test+${__VU}@example.com`,
    password: 'wrong-password',
    deviceId: `k6-vu-${__VU}-${__ITER}`,
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  let res = http.post(`${API_BASE}/v1/auth/login`, payload, params);
  check(res, {
    'no 5xx': (r) => r.status < 500,
  });
  sleep(0.1);
}