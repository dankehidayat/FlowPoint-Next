# FlowPoint - Energy Monitoring Dashboard

A real-time energy monitoring dashboard built with Next.js, Prisma, and Vercel Postgres, designed to visualize sensor data from IoT devices.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.4 with React 19
- **Database**: Vercel Postgres with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel
- **DNS**: Cloudflare

## 📊 Features

- Real-time energy consumption monitoring
- Voltage, current, power, and energy tracking
- Temperature and humidity monitoring
- Responsive dashboard with interactive charts
- Automatic data collection from Blynk IoT platform
- Historical data visualization

## 🏗️ Project Structure

```
flowpoint-next/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── sensor/
│   │   │   │   ├── route.ts          # GET sensor data
│   │   │   │   └── auto-save/
│   │   │   │       └── route.ts      # Auto-save from Blynk
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── prisma.ts            # Prisma client
│   │   │   └── sensor-service.ts    # Sensor data operations
│   │   └── ...
├── prisma/
│   └── schema.prisma               # Database schema
└── ...
```

## 🗄️ Database Schema

```prisma
model SensorData {
  id            Int      @id @default(autoincrement())
  voltage       Float
  current       Float
  power         Float
  energy        Float
  frequency     Float
  powerFactor   Float    @map("power_factor")
  apparentPower Float    @map("apparent_power")
  reactivePower Float    @map("reactive_power")
  temperature   Float
  humidity      Float
  timestamp     DateTime @default(now())

  @@map("sensor_data")
}
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- pnpm
- Vercel account
- Blynk IoT account

### Local Development

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd flowpoint-next
   pnpm install
   ```

2. **Set up environment variables:**

   ```bash
   # .env.local
   DATABASE_URL="your_vercel_postgres_url"
   BLYNK_AUTH_TOKEN="your_blynk_auth_token"
   ```

3. **Set up database:**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push
   ```

4. **Run development server:**
   ```bash
   pnpm dev
   ```

### Deployment on Vercel

1. **Connect your repository to Vercel**

2. **Add environment variables in Vercel:**

   - `DATABASE_URL`: Vercel Postgres connection string
   - `BLYNK_AUTH_TOKEN`: Your Blynk authentication token

3. **Configure build settings:**

   - **Install Command**: `pnpm install`
   - **Build Command**: `prisma generate && next build`

4. **Set up Vercel Postgres:**
   - Go to Vercel Storage → Create Postgres database
   - Use prefix: `DATABASE`
   - Run `npx prisma db push` with production URL

### DNS Setup (Cloudflare)

Add CNAME record in Cloudflare:

- **Type**: CNAME
- **Name**: `flowpoint`
- **Target**: `cname.vercel-dns.com`
- **Proxy**: DNS only (gray cloud)

## 🔌 API Endpoints

### GET `/api/sensor`

Fetch recent sensor data with optional parameters:

- `hours`: Time range (default: 24)
- `limit`: Number of records (default: 100)

**Example:**

```bash
GET /api/sensor?hours=48&limit=50
```

### GET `/api/sensor/auto-save`

Fetch data from Blynk IoT platform and save to database. This endpoint should be called periodically.

## 🔄 Automatic Data Collection

Set up a cron job to call `/api/sensor/auto-save` every 5 minutes:

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/sensor/auto-save",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

## 🛠️ Development Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
npx prisma studio # Database management UI
```

## 📈 Data Flow

1. **Blynk IoT** → **Auto-save API** → **Vercel Postgres**
2. **Frontend** → **Sensor API** → **Vercel Postgres** → **Charts**

## 🌐 Live Demo

- **Main Dashboard**: [flowpoint.dankehidayat.my.id](https://flowpoint.dankehidayat.my.id)
- **API Endpoint**: [flowpoint.dankehidayat.my.id/api/sensor](https://flowpoint.dankehidayat.my.id/api/sensor)

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **"Table does not exist" error**:

   ```bash
   DATABASE_URL="your_production_url" npx prisma db push
   ```

2. **Prisma client not generated**:

   ```bash
   npx prisma generate
   ```

3. **Build failures on Vercel**:
   - Ensure `prisma generate` is in build command
   - Check environment variables are set

### Support

For issues and questions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and environment details

---

**Maintained by [Danke Hidayat](https://dankehidayat.my.id)**
