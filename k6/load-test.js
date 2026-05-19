import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const errorRate = new Counter('errors');
const responseTime = new Trend('response_time');

export const options = {
  vus: 500,
  iterations: 500,
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    errors: ['count<50'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000';

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({
      email: __ENV.AUTH_EMAIL || 'admin@example.com',
      password: __ENV.AUTH_PASSWORD || 'Admin123!',
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  return { token: loginRes.json('token') };
}

export default function (data) {
  const payload = JSON.stringify({
    firstName: `Load${__VU}`,
    lastName: `Test${__ITER}`,
    email: `load-${__VU}-${__ITER}-${Date.now()}@example.com`,
    phone: '+33601020304',
  });

  const res = http.post(`${BASE_URL}/api/candidates`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  });

  responseTime.add(res.timings.duration);
  const ok = check(res, { 'status is 201': (r) => r.status === 201 });
  if (!ok) errorRate.add(1);
  sleep(0.1);
}

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration.values['p(95)'];
  const errors = data.metrics.errors?.values?.count ?? 0;
  const total = data.metrics.iterations.values.count;
  const errorPct = ((errors / total) * 100).toFixed(2);

  console.log(`p95 response time: ${p95}ms`);
  console.log(`error rate: ${errorPct}% (${errors}/${total})`);

  return {
    stdout: JSON.stringify(
      { p95, errors, total, errorRatePercent: errorPct },
      null,
      2,
    ),
  };
}
