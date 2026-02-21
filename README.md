This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Monitoring & Observability

This application includes comprehensive monitoring with Prometheus and Grafana:

### Features

- **HTTP Request Tracking**: All routes (pages and APIs) are automatically tracked
- **MongoDB Monitoring**: Real-time database metrics and query performance
- **Performance Metrics**: Request duration, error rates, and operation timing
- **Business Metrics**: User and post counts, daily growth tracking

### Access

- **Application**: http://localhost:3000
- **Metrics Endpoint**: http://localhost:3000/api/metrics
- **Prometheus**: http://localhost:9090
- **Grafana Dashboard**: http://localhost:3001 (admin/admin)

### Documentation

- [Monitoring Guide](MONITORING_GUIDE.md) - HTTP metrics and Grafana setup
- [MongoDB Monitoring](MONGODB_MONITORING.md) - Database-specific monitoring
- [Grafana Setup](GRAFANA_SETUP.md) - Dashboard configuration

### Quick Start with Docker

```bash
# Start all services (app, Prometheus, Grafana)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
