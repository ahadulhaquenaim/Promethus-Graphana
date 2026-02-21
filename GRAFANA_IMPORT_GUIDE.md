# How to Import the Grafana Dashboard

There are **two ways** to load the dashboard into Grafana:

## Method 1: Automatic Provisioning (Recommended for Docker)

This method automatically loads the dashboard when Grafana starts.

### Steps:
1. The dashboard JSON is already in: `/grafana/provisioning/dashboards/nextjs-metrics.json`
2. The provisioning config is in: `/grafana/provisioning/dashboards/dashboard.yml`
3. Simply restart your Docker containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```
4. Wait 30 seconds for Grafana to provision the dashboard
5. Open Grafana: http://localhost:3001 (admin/admin)
6. Go to: Dashboards → Browse → Find "Next.js Application Metrics"

### Troubleshooting:
- Check Grafana logs: `docker-compose logs grafana`
- Ensure the dashboard.yml file points to the correct path
- Verify JSON is valid: `python3 -m json.tool grafana/provisioning/dashboards/nextjs-metrics.json`

---

## Method 2: Manual Import (Recommended for Manual Upload)

Use this method if you want to manually import the dashboard through the Grafana UI.

### Steps:

1. **Open Grafana**
   - Navigate to: http://localhost:3001
   - Login with: `admin` / `admin`

2. **Import the Dashboard**
   - Click the **"+"** icon in the left sidebar
   - Select **"Import"**
   - You'll see the import screen

3. **Upload JSON**
   - Click **"Upload JSON file"**
   - Select the file: `grafana-dashboard-import.json` (root of your project)
   - OR paste the JSON content directly into the text box

4. **Configure Data Source**
   - When prompted, select **"Prometheus"** as the data source
   - If you don't see Prometheus:
     - Go to Configuration → Data Sources
     - Add Prometheus with URL: `http://prometheus:9090` (for Docker)
     - Or: `http://localhost:9090` (for local)

5. **Import**
   - Click **"Import"**
   - The dashboard should now be visible!

6. **View Dashboard**
   - Go to: Dashboards → Browse
   - Find: "Next.js Application Metrics (Import)"
   - Click to open

---

## Files Overview

- **`grafana/provisioning/dashboards/nextjs-metrics.json`**
  - For automatic provisioning (Docker Compose)
  - Loaded automatically when Grafana starts

- **`grafana-dashboard-import.json`** 
  - For manual import through Grafana UI
  - Includes datasource configuration
  - Use this file when uploading manually

---

## Common Issues & Solutions

### Issue: "Dashboard not found" after provisioning
**Solution:**
```bash
# Check if files are mounted correctly
docker-compose exec grafana ls -la /etc/grafana/provisioning/dashboards/

# Restart Grafana
docker-compose restart grafana

# Check logs for errors
docker-compose logs grafana | grep -i error
```

### Issue: "No data" in panels
**Solution:**
1. Verify Prometheus is scraping metrics:
   - Open: http://localhost:9090/targets
   - Check if `nextjs-app` target is UP
   
2. Verify metrics endpoint works:
   - Open: http://localhost:3000/api/metrics
   - You should see Prometheus metrics

3. Check time range in Grafana (top-right corner)
   - Set to "Last 15 minutes" or "Last 1 hour"

### Issue: "Data source not found"
**Solution:**
1. Go to Configuration → Data Sources
2. Add new Prometheus data source:
   - Name: `Prometheus`
   - URL: `http://prometheus:9090` (Docker) or `http://localhost:9090` (local)
   - Access: `Server (default)`
   - Click "Save & Test"

### Issue: Import fails with "Invalid JSON"
**Solution:**
1. Validate the JSON file:
   ```bash
   python3 -m json.tool grafana-dashboard-import.json > /dev/null
   ```
2. If errors, regenerate the file or check for syntax issues
3. Try copying the JSON content directly instead of uploading

### Issue: Panels show "N/A" or no values
**Solution:**
1. Ensure your Next.js app is running and receiving traffic
2. Visit some pages to generate metrics:
   - http://localhost:3000
   - http://localhost:3000/blog
   - http://localhost:3000/about
3. Wait a few seconds for metrics to be scraped
4. Refresh the Grafana dashboard

---

## Verifying the Setup

Run these checks to ensure everything is working:

### 1. Check Metrics Endpoint
```bash
curl http://localhost:3000/api/metrics | head -20
```
Expected: Should see Prometheus metrics like `http_requests_total`, `mongodb_users_total`, etc.

### 2. Check Prometheus Targets
```bash
curl http://localhost:9090/api/v1/targets | grep nextjs-app
```
Expected: Should show target as "up"

### 3. Query Prometheus Directly
```bash
curl 'http://localhost:9090/api/v1/query?query=http_requests_total'
```
Expected: Should return data

### 4. Test Dashboard
1. Visit your app: http://localhost:3000
2. Navigate to different pages
3. Open Grafana dashboard
4. You should see:
   - HTTP Request Rate increasing
   - Total Requests counter incrementing
   - MongoDB metrics showing current values

---

## Dashboard Features

Once imported, you'll see:

### HTTP Metrics
- **HTTP Request Rate**: Requests per second by route and method
- **HTTP Request Duration**: p95 latency for all routes
- **Total Requests**: Total HTTP requests received
- **Request Summary**: Table of all routes with hit counts

### MongoDB Metrics
- **Connection Status**: Real-time connection health (green = connected)
- **Total Users/Posts**: Current counts with trend graphs
- **Daily Activity**: Users and posts created today
- **Query Performance**: p95 query duration by operation type
- **Operations Rate**: Database operations per second
- **Users/Posts Over Time**: Historical growth charts

### Application Health
- **App Status**: Overall application health (green = up)

---

## Need Help?

1. Check the logs:
   ```bash
   docker-compose logs -f grafana
   docker-compose logs -f prometheus
   docker-compose logs -f app
   ```

2. Verify all containers are running:
   ```bash
   docker-compose ps
   ```

3. Review the documentation:
   - [MONITORING_GUIDE.md](MONITORING_GUIDE.md)
   - [MONGODB_MONITORING.md](MONGODB_MONITORING.md)
   - [GRAFANA_SETUP.md](GRAFANA_SETUP.md)
