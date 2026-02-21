# Prometheus & Grafana - Quick Reference Guide

## 🎯 The Solution to "Empty Query Results"

**The metrics are working!** The "empty query" issue happens because:

1. **HTTP metrics** (like `http_requests_total`) only appear after you make requests to your app
2. **Business metrics** (like `mongodb_posts_total`) are always available

## ✅ How to Verify Everything is Working

### 1. Check Metrics Endpoint

```bash
curl http://localhost:3000/api/metrics
```

You should see metrics in Prometheus format.

### 2. Check Prometheus Targets

Visit: http://localhost:9090/targets

Both targets should show **UP** status:

- `nextjs-app` (app:3000)
- `prometheus` (localhost:9090)

### 3. Generate Traffic (Important!)

```bash
# Generate some HTTP requests
for i in {1..10}; do
  curl -s http://localhost:3000/ > /dev/null
  curl -s http://localhost:3000/about > /dev/null
  curl -s http://localhost:3000/blog > /dev/null
done
```

### 4. Query Prometheus

Visit: http://localhost:9090/graph

Try these queries:

**Always Available Metrics:**

```promql
app_up
mongodb_posts_total
mongodb_users_total
mongodb_connection_status
```

**Traffic-Based Metrics (requires requests):**

```promql
http_requests_total
rate(http_requests_total[5m])
http_request_duration_seconds_bucket
```

## 📊 Access Your Dashboards

### Grafana

- **URL**: http://localhost:3001
- **Login**: admin / admin
- Navigate to: **Dashboards** → **Next.js Application Metrics**

### Prometheus

- **URL**: http://localhost:9090
- **Graph**: http://localhost:9090/graph
- **Targets**: http://localhost:9090/targets

## 🔥 Useful PromQL Queries for Testing

Copy and paste these into Prometheus:

```promql
# 1. Check if app is up (should always return 1)
app_up

# 2. Total requests (will be 0 until you visit the site)
sum(http_requests_total)

# 3. Request rate over last 5 minutes
rate(http_requests_total[5m])

# 4. Requests by route
sum(http_requests_total) by (route)

# 5. MongoDB stats
mongodb_posts_total
mongodb_users_total

# 6. Response time (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## 🎬 Quick Start Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Stop all services
docker-compose down

# Generate test traffic
for i in {1..50}; do curl -s http://localhost:3000/ > /dev/null; done

# View live metrics
watch -n 2 'curl -s http://localhost:3000/api/metrics | grep -E "(app_up|http_requests_total|mongodb_)"'
```

## 🐛 Troubleshooting

### "No data points" in Grafana

**Solution**: Generate traffic by visiting your app

```bash
# Open your app in browser or use:
curl http://localhost:3000
curl http://localhost:3000/about
curl http://localhost:3000/blog
```

### Metrics endpoint returns empty counters

**This is normal!** Counters like `http_requests_total` start at 0 and increment with each request.

### Check if scraping is working

```bash
# From Prometheus container
docker exec prometheus-news wget -qO- http://app:3000/api/metrics

# Check scrape status
curl http://localhost:9090/api/v1/targets | python3 -m json.tool
```

### Grafana shows "No Data"

1. Wait 10-30 seconds for Prometheus to scrape
2. Generate some traffic to your app
3. Check time range (top right in Grafana) - set to "Last 15 minutes"
4. Verify Prometheus data source is working: **Configuration** → **Data Sources** → **Prometheus** → **Save & Test**

## 📈 Understanding Your Metrics

### Gauges (current value)

- `app_up` - Always 1 when app is running
- `mongodb_posts_total` - Current number of posts
- `mongodb_users_total` - Current number of users

### Counters (cumulative, always increasing)

- `http_requests_total` - Total requests since app started
- `http_requests_errors_total` - Total errors

### Histograms (distribution)

- `http_request_duration_seconds` - Response time distribution

## 🎨 Customize Your Dashboard

In Grafana:

1. Go to the **Next.js Application Metrics** dashboard
2. Click the panel title → **Edit**
3. Modify the query or visualization
4. Click **Apply** and **Save dashboard**

## 📚 Next Steps

1. ✅ Visit your app to generate metrics
2. ✅ Open Grafana: http://localhost:3001
3. ✅ View the pre-built dashboard
4. ✅ Try the PromQL queries above
5. ✅ Create custom panels for your specific needs

---

**Pro Tip**: Keep the app running and interact with it. Watch the metrics update in real-time in Grafana with the 5-second refresh interval!
