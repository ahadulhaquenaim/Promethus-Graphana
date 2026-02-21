# Grafana Dashboard Import Guide - Two Separate Dashboards

You now have **two separate dashboard JSON files** for Grafana:

## 📊 Dashboard Files

### 1. **Next.js HTTP Metrics Dashboard**

**File:** `grafana-dashboard-nextjs.json`

**Monitors:**

- HTTP Request Rate by route
- HTTP Request Duration (p95 and p50)
- Total HTTP Requests
- App Status (up/down)
- Request Rate (last 5 minutes)
- Error Rate
- Requests by Route
- Requests by Method
- Average Request Duration
- Error Rate by Route
- Request Summary Table

**Panels:** 11 panels focused on HTTP/API performance

---

### 2. **MongoDB Metrics Dashboard**

**File:** `grafana-dashboard-mongodb.json`

**Monitors:**

- MongoDB Connection Status
- Total Users & Posts
- User/Post Ratio
- Users Created Today
- Posts Created Today
- Users & Posts Over Time
- Daily Growth (users & posts)
- Query Duration (p95 and p50)
- Operations Rate
- Operations Summary Table

**Panels:** 14 panels focused on database metrics

---

## 🚀 How to Import Both Dashboards

### Step 1: Open Grafana

Navigate to: **http://localhost:3001**  
Login: `admin` / `admin`

### Step 2: Import First Dashboard (Next.js)

1. Click the **"+"** icon in left sidebar
2. Select **"Import"**
3. Click **"Upload JSON file"**
4. Select **`grafana-dashboard-nextjs.json`**
5. Select **"Prometheus"** as data source
6. Click **"Import"**
7. ✅ **Next.js HTTP Metrics** dashboard created!

### Step 3: Import Second Dashboard (MongoDB)

1. Click the **"+"** icon again
2. Select **"Import"**
3. Click **"Upload JSON file"**
4. Select **`grafana-dashboard-mongodb.json`**
5. Select **"Prometheus"** as data source
6. Click **"Import"**
7. ✅ **MongoDB Metrics** dashboard created!

### Step 4: View Your Dashboards

1. Click **"Dashboards"** in left sidebar
2. Click **"Browse"**
3. You should see:
   - **Next.js HTTP Metrics**
   - **MongoDB Metrics**

---

## 📋 Dashboard Comparison

| Feature              | Next.js Dashboard              | MongoDB Dashboard            |
| -------------------- | ------------------------------ | ---------------------------- |
| **Focus**            | HTTP/API requests              | Database operations          |
| **Key Metrics**      | Request rate, duration, errors | Users, posts, queries        |
| **Panels**           | 11 panels                      | 14 panels                    |
| **Best For**         | API performance monitoring     | Business metrics & DB health |
| **Update Frequency** | Real-time (5s refresh)         | Real-time (5s refresh)       |

---

## 💡 Usage Tips

### Next.js Dashboard - Use When:

- Monitoring API performance
- Debugging slow endpoints
- Tracking traffic patterns
- Identifying error-prone routes
- Analyzing request methods (GET, POST, DELETE)

### MongoDB Dashboard - Use When:

- Tracking business growth (users/posts)
- Monitoring database health
- Identifying slow queries
- Analyzing daily activity
- Checking connection stability

---

## 🔍 What Each Dashboard Shows

### Next.js HTTP Metrics Dashboard

**Row 1:** Overview

- HTTP Request Rate (by route & method)
- HTTP Request Duration (p95)

**Row 2:** Key Stats

- Total Requests
- App Status
- Request Rate (5m)
- Error Rate

**Row 3:** Traffic Analysis

- Requests by Route
- Requests by Method

**Row 4:** Performance

- Average Duration by Route
- Error Rate by Route

**Row 5:** Summary

- Request Summary Table (all routes)

---

### MongoDB Metrics Dashboard

**Row 1:** Health & Totals

- Connection Status
- Total Users
- Total Posts
- User/Post Ratio

**Row 2:** Daily Activity

- Users Created Today
- Posts Created Today

**Row 3:** Growth Trends

- Users Over Time
- Posts Over Time

**Row 4:** Daily Charts

- Daily User Growth
- Daily Post Growth

**Row 5:** Performance

- Query Duration (p95)
- Operations Rate

**Row 6:** Details

- Average Query Duration (p50)
- Operations Summary Table

---

## 🛠️ Troubleshooting

### Both dashboards show "No data"

**Solution:**

1. Verify app is running: `docker-compose ps`
2. Check metrics endpoint: `curl http://localhost:3000/api/metrics`
3. Verify Prometheus targets: http://localhost:9090/targets
4. Generate some traffic by visiting your app pages

### "Data source not found" error

**Solution:**

1. Go to Configuration → Data Sources
2. Add Prometheus:
   - Name: `Prometheus`
   - URL: `http://prometheus:9090` (Docker) or `http://localhost:9090` (local)
3. Click "Save & Test"
4. Re-import the dashboards

### Import fails with error

**Solution:**

1. Validate JSON:
   ```bash
   python3 -m json.tool grafana-dashboard-nextjs.json
   python3 -m json.tool grafana-dashboard-mongodb.json
   ```
2. Try copying JSON content directly instead of uploading file
3. Ensure Prometheus data source exists first

### Next.js dashboard shows data but MongoDB doesn't

**Solution:**

1. Check if MongoDB is connected: `docker-compose logs app | grep -i mongo`
2. Visit: http://localhost:3000/api/metrics
3. Search for `mongodb_` metrics in the output
4. If missing, check MongoDB connection in your app

### MongoDB dashboard shows data but Next.js doesn't

**Solution:**

1. Generate traffic by visiting pages:
   - http://localhost:3000
   - http://localhost:3000/blog
   - http://localhost:3000/about
2. Wait a few seconds for Prometheus to scrape
3. Refresh the dashboard

---

## ✅ Verification Checklist

After importing both dashboards:

- [ ] Both dashboards appear in Grafana
- [ ] Next.js dashboard shows request metrics
- [ ] MongoDB dashboard shows user/post counts
- [ ] All panels have data (not "No data")
- [ ] Time range is set (top-right corner)
- [ ] Refresh interval is 5s (top-right)
- [ ] Prometheus data source is connected

---

## 🎯 Next Steps

1. **Customize Time Ranges:**
   - Click time picker (top-right)
   - Try: Last 5m, 15m, 1h, 6h, 24h

2. **Save Your Preferences:**
   - Click ⭐ to favorite dashboards
   - Set default time ranges
   - Arrange panels as you like

3. **Set Up Alerts (Optional):**
   - Click panel title → Edit
   - Go to Alert tab
   - Create alerts for:
     - High error rate
     - Slow response times
     - DB connection failures
     - Low daily growth

4. **Create Playlists:**
   - Dashboards → Playlists
   - Add both dashboards
   - Rotate through them automatically

5. **Share Dashboards:**
   - Click share icon
   - Get snapshot link
   - Share with team

---

## 📚 Related Documentation

- [MONGODB_MONITORING.md](MONGODB_MONITORING.md) - Detailed MongoDB metrics guide
- [MONITORING_GUIDE.md](MONITORING_GUIDE.md) - Overall monitoring setup
- [GRAFANA_SETUP.md](GRAFANA_SETUP.md) - Grafana configuration

---

## 🆘 Need Help?

Check the logs:

```bash
# All services
docker-compose logs -f

# Just Grafana
docker-compose logs -f grafana

# Just Prometheus
docker-compose logs -f prometheus

# Just the app
docker-compose logs -f app
```

Restart services:

```bash
docker-compose restart grafana
docker-compose restart prometheus
docker-compose restart app
```

Full reset:

```bash
docker-compose down
docker-compose up -d
```
