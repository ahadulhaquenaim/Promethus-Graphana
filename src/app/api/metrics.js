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

// MongoDB Business Metrics
const totalUsers = new promClient.Gauge({
  name: 'mongodb_users_total',
  help: 'Total number of users in the database',
  registers: [register],
});

const totalPosts = new promClient.Gauge({
  name: 'mongodb_posts_total',
  help: 'Total number of blog posts in the database',
  registers: [register],
});

const usersCreatedToday = new promClient.Gauge({
  name: 'mongodb_users_created_today',
  help: 'Number of users created today',
  registers: [register],
});

const postsCreatedToday = new promClient.Gauge({
  name: 'mongodb_posts_created_today',
  help: 'Number of posts created today',
  registers: [register],
});

const dbConnectionStatus = new promClient.Gauge({
  name: 'mongodb_connection_status',
  help: 'MongoDB connection status (1 = connected, 0 = disconnected)',
  registers: [register],
});

// MongoDB Performance Metrics
const dbQueryDuration = new promClient.Histogram({
  name: 'mongodb_query_duration_seconds',
  help: 'Duration of MongoDB queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const dbOperationsTotal = new promClient.Counter({
  name: 'mongodb_operations_total',
  help: 'Total number of MongoDB operations',
  labelNames: ['operation', 'collection'],
  registers: [register],
});

export { 
  register, 
  routeHits, 
  requestDuration, 
  requestErrors,
  totalUsers,
  totalPosts,
  usersCreatedToday,
  postsCreatedToday,
  dbConnectionStatus,
  dbQueryDuration,
  dbOperationsTotal
};
