# @movibe/logger

A flexible and type-safe logging system for JavaScript/TypeScript applications, built with Bun.

## Installation

```bash
npm install @movibe/logger
# or
yarn add @movibe/logger
# or
bun add @movibe/logger
```

## Features

- 🎯 Type-safe logging with TypeScript
- 🔄 Multiple logging strategies support
- 📊 Built-in analytics events
- 🛍️ E-commerce tracking
- 🌐 Network analytics
- 🔒 Error handling and validation
- 🚀 High performance with strategy caching
- 🏃‍♂️ Built and tested with Bun

## Quick Start

```typescript
import { LoggerStrategy } from "@movibe/logger";

const logger = new LoggerStrategy([
  {
    class: GoogleAnalyticsLogger,
    enabled: true,
  },
]);

logger.init();
logger.log("user_login", { method: "email" });
```

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Build
bun run build
```

## Documentation

- [Usage Guide](docs/USAGE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Testing](docs/testing.md)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
