import promClient from 'prom-client';

// Use default registry
const register = promClient.register;

// Define a gauge for app up status
const appUp = new promClient.Gauge({
  name: 'app_up',
  help: 'Is the app up',
  registers: [register],
});
appUp.set(1); // Set to 1 when app is up

// Define a counter for route hits
const routeHits = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'method'],
  registers: [register],
});

// Define a histogram for request duration
const requestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['route', 'method'],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Define a counter for errors
const requestErrors = new promClient.Counter({
  name: 'http_requests_errors_total',
  help: 'Total number of HTTP errors',
  labelNames: ['route', 'method', 'status'],
  registers: [register],
});

export { register, routeHits, requestDuration, requestErrors };
