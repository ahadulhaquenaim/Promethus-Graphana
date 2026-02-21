# Grafana Setup for Prometheus Monitoring

## Overview

Grafana is now configured to visualize your Next.js application metrics from Prometheus.

## Access Information

### Grafana Dashboard

- **URL**: http://localhost:3001
- **Username**: `admin`
- **Password**: `admin`
- ⚠️ You'll be prompted to change the password on first login

### Prometheus

- **URL**: http://localhost:9090

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

### 2. Access Grafana

1. Open your browser and go to: http://localhost:3001
2. Login with:
   - Username: `admin`
   - Password: `admin`
3. Change the password when prompted (optional but recommended)

### 3. Pre-configured Dashboard

The "Next.js Application Metrics" dashboard is automatically provisioned and includes:

- **HTTP Request Rate**: Real-time request rates by method, route, and status
- **HTTP Request Duration (p95)**: 95th percentile response times
- **Total Requests**: Overall request counter
- **Response Status Codes**: Distribution of HTTP status codes
- **Request Summary by Route**: Tabular view of requests by route and method

## Creating Custom Dashboards

### Method 1: Using the UI

1. Click the "+" icon in the left sidebar
2. Select "Dashboard"
3. Click "Add new panel"
4. In the query editor, write PromQL queries like:
   - `rate(http_requests_total[5m])` - Request rate
   - `http_requests_total` - Total requests
   - `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` - P95 latency

### Method 2: Import from JSON

1. Click "Dashboards" → "Import"
2. Paste a dashboard JSON or ID
3. Select "Prometheus" as the data source

## Useful PromQL Queries

```promql
# Total HTTP requests
sum(http_requests_total)

# Request rate by status code
sum(rate(http_requests_total[5m])) by (status)

# Request rate by route
sum(rate(http_requests_total[5m])) by (route)

# Average response time
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])

# P95 response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# P99 response time
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Error rate (5xx responses)
sum(rate(http_requests_total{status=~"5.."}[5m]))

# Success rate (2xx responses)
sum(rate(http_requests_total{status=~"2.."}[5m]))
```

## Folder Structure

```
grafana/
├── provisioning/
│   ├── datasources/
│   │   └── prometheus.yml          # Auto-configure Prometheus data source
│   └── dashboards/
│       ├── dashboard.yml            # Dashboard provider config
│       └── nextjs-metrics.json     # Pre-built Next.js dashboard
```

## Troubleshooting

### Grafana shows "No Data"

1. Check if Prometheus is running: http://localhost:9090
2. Verify Prometheus can scrape your app: http://localhost:9090/targets
3. Check if metrics endpoint works: http://localhost:3000/api/metrics

### Can't access Grafana

1. Ensure the container is running: `docker-compose ps`
2. Check logs: `docker-compose logs grafana`
3. Verify port 3001 is not in use: `lsof -i :3001`

### Data source connection failed

1. Verify Prometheus is running in the same network
2. Check the data source URL is `http://prometheus:9090`
3. Test from Grafana container: `docker exec -it grafana-news curl http://prometheus:9090`

## Advanced Configuration

### Persistent Dashboards

Dashboards created in the UI are automatically saved to the `grafana-data` Docker volume.

### Email Alerts

To configure email alerts, add these environment variables to the Grafana service:

```yaml
- GF_SMTP_ENABLED=true
- GF_SMTP_HOST=smtp.gmail.com:587
- GF_SMTP_USER=your-email@gmail.com
- GF_SMTP_PASSWORD=your-app-password
```

### Change Admin Password via Environment

Update docker-compose.yml:

```yaml
- GF_SECURITY_ADMIN_PASSWORD=your-secure-password
```

## Next Steps

1. Explore the pre-built dashboard
2. Create custom panels for specific metrics
3. Set up alerts for critical thresholds
4. Add more data sources if needed

## Resources

- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Dashboard Examples](https://grafana.com/grafana/dashboards/)
