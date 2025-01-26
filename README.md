# BizSim - Business Simulation Dashboard

An interactive business simulation application that presents users with dynamic business scenarios, tracks their decisions, and provides real-time feedback through a comprehensive BI dashboard.

## 📚 Documentation

### Core Documentation
- [Architecture Documentation](docs/architecture/ARCHITECTURE.md) - System design and technical decisions
- [Engineering Journal](docs/engineering/JOURNAL.md) - Development decisions and technical details
- [Bug Fixes Log](docs/engineering/BUGFIXES.md) - Tracking and solutions for known issues
- [Development Roadmap](docs/ROADMAP.md) - Project timeline and feature planning

### Guides
- [Quickstart Guide](docs/guides/QUICKSTART.md) - Getting started for new developers

## 🚀 Features

- **Interactive Dashboard**
  - Real-time KPI tracking
  - Department performance metrics
  - Live business news ticker
  - Dynamic scenario management

- **Business Scenarios**
  - AI-generated business challenges
  - Multiple solution paths
  - Impact analysis for each decision
  - Special Projects Team consultation

- **Performance Tracking**
  - User decision history
  - Metric impact visualization
  - Progress tracking
  - Dynamic difficulty adjustment

## 🛠 Tech Stack

- **Frontend**
  - Next.js 14 with App Router
  - TypeScript
  - TailwindCSS
  - Chart.js for metrics visualization

- **Backend**
  - Node.js with Express
  - PostgreSQL with Prisma ORM
  - WebSocket for real-time updates

- **AI Integration**
  - Google Gemini for scenario generation
  - TheNews API for business updates

## 🏁 Getting Started

1. **Prerequisites**
   ```bash
   node.js >= 18
   PostgreSQL
   ```

2. **Installation**
   ```bash
   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env.local
   # Add your API keys and configuration

   # Start the development server
   npm run dev
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
   NEXT_PUBLIC_NEWS_API_KEY="your-news-api-key"
   DATABASE_URL="postgresql://user:password@localhost:5432/bizsim"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## 🧪 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database UI

## 📁 Project Structure

```
.
├── docs/                  # Documentation
│   ├── architecture/     # System design docs
│   ├── engineering/      # Technical docs
│   └── guides/          # Developer guides
├── src/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── lib/            # Utilities and services
│   └── types/          # TypeScript definitions
└── prisma/              # Database schema
```

## 👥 Contributing

1. Check our [Development Roadmap](docs/ROADMAP.md)
2. Follow our [Engineering Guidelines](docs/engineering/JOURNAL.md)
3. Review the [Architecture Documentation](docs/architecture/ARCHITECTURE.md)
4. Create a pull request

## 🐛 Bug Reporting

Found a bug? Please:
1. Check the [Bug Fixes Log](docs/engineering/BUGFIXES.md)
2. Report new issues in our issue tracker
3. Include steps to reproduce
4. Provide relevant environment details

## 📜 License

MIT License - see LICENSE for details
