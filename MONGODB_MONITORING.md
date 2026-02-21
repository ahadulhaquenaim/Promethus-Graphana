# MongoDB Monitoring Guide

This document explains the MongoDB monitoring capabilities in your Next.js application.

## Overview

Your application now has comprehensive MongoDB monitoring integrated with Prometheus and Grafana. All MongoDB operations are tracked automatically to provide insights into database performance and usage.

## Monitored Metrics

### Business Metrics

1. **mongodb_users_total**
   - Total number of users in the database
   - Updated every time `/api/metrics` is scraped by Prometheus
   - Useful for tracking user growth

2. **mongodb_posts_total**
   - Total number of blog posts in the database
   - Updated every time `/api/metrics` is scraped by Prometheus
   - Useful for tracking content growth

3. **mongodb_users_created_today**
   - Number of users created today (resets at midnight)
   - Useful for tracking daily user acquisition

4. **mongodb_posts_created_today**
   - Number of posts created today (resets at midnight)
   - Useful for tracking daily content creation

5. **mongodb_connection_status**
   - Connection status (1 = connected, 0 = disconnected)
   - Critical for monitoring database availability

### Performance Metrics

1. **mongodb_query_duration_seconds**
   - Histogram tracking query execution time
   - Labels: `operation` (countDocuments, find, findOne, etc.), `collection` (users, posts)
   - Buckets: 0.01s, 0.05s, 0.1s, 0.5s, 1s, 2s, 5s
   - Use for identifying slow queries

2. **mongodb_operations_total**
   - Counter for total database operations
   - Labels: `operation`, `collection`
   - Use for tracking operation frequency and patterns

## Grafana Dashboard

The Grafana dashboard now includes dedicated MongoDB monitoring panels:

### Status Panels (Row 1)

- **MongoDB Connection Status**: Real-time connection health
- **Total Users**: Current user count with trend graph
- **Total Posts**: Current post count with trend graph
- **App Status**: Overall application health

### Daily Activity (Row 2)

- **Users Created Today**: Daily new user registrations
- **Posts Created Today**: Daily new post creations

### Trends (Row 3)

- **MongoDB Users Over Time**: Historical user growth
- **MongoDB Posts Over Time**: Historical content growth

### Performance (Row 4)

- **MongoDB Query Duration (p95)**: 95th percentile query performance by operation
- **MongoDB Operations Rate**: Operations per second by type

### Operations Summary (Row 5)

- **MongoDB Operations Summary**: Table showing all operations with their rates

## Using the trackDbOperation Helper

To track MongoDB operations in your routes, use the `trackDbOperation` helper:

```javascript
import { trackDbOperation } from "@/app/api/metricsHelper";

// Example: Track a find operation
const users = await trackDbOperation("find", "users", async () => {
  return await User.find({ status: "active" });
});

// Example: Track a count operation
const userCount = await trackDbOperation(
  "countDocuments",
  "users",
  async () => {
    return await User.countDocuments();
  },
);

// Example: Track an insert operation
const newUser = await trackDbOperation("insertOne", "users", async () => {
  return await user.save();
});
```

The helper automatically:

- Increments the operation counter
- Records query duration
- Handles errors gracefully

## Alerting (Future Enhancement)

You can set up Prometheus alerts for:

- Database connection failures: `mongodb_connection_status == 0`
- Slow queries: `mongodb_query_duration_seconds > 1.0`
- High operation rate: `rate(mongodb_operations_total[5m]) > 100`
- No new users/posts: `mongodb_users_created_today == 0`

## Access URLs

- **Metrics Endpoint**: http://localhost:3000/api/metrics
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

## Implementation Details

### Automatic Tracking

The `/api/metrics` route automatically updates MongoDB metrics every time Prometheus scrapes it (default: every 10 seconds).

### Manual Tracking

Use the `trackDbOperation` helper in any API route to track specific database operations.

### Middleware Integration

All HTTP requests are tracked via the `middleware.js` file, which logs route hits, methods, and normalizes dynamic routes.

## Troubleshooting

### Metrics not showing up

1. Ensure MongoDB is connected
2. Check `/api/metrics` endpoint for raw metrics
3. Verify Prometheus is scraping (check Prometheus UI > Targets)
4. Refresh Grafana dashboard

### Connection status shows 0

1. Check MongoDB connection string in `.env`
2. Verify MongoDB is running
3. Check application logs for connection errors

### Query duration seems wrong

- Metrics include network latency
- Cold starts may show higher initial durations
- Check if database indexes are optimized

## Best Practices

1. **Always use trackDbOperation** for custom queries
2. **Monitor p95 latency** instead of average
3. **Set up alerts** for critical metrics
4. **Regular dashboard reviews** to identify trends
5. **Archive old data** if metrics storage grows too large

## Example Queries

### Find slow operations

```promql
histogram_quantile(0.95, rate(mongodb_query_duration_seconds_bucket[5m])) > 0.5
```

### Most frequent operations

```promql
topk(5, sum(rate(mongodb_operations_total[5m])) by (operation, collection))
```

### Daily user growth rate

```promql
mongodb_users_created_today
```

### Database health check

```promql
mongodb_connection_status == 1
```
