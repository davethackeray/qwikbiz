# QwikBiz

A business simulation platform that leverages AI to generate dynamic business scenarios and solutions.

## Features

- Dynamic business scenario generation
- Department performance analysis
- AI-powered solution recommendations
- Real-time metrics visualization
- Special projects recommendations

## Tech Stack

- Next.js
- TypeScript
- Prisma
- Docker
- Gemini AI API

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/davethackeray/qwikbiz.git
cd qwikbiz
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then update the environment variables with your credentials.

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run linting
- `npm run test` - Run tests

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_GEMINI_API_KEY` - Google Gemini API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
