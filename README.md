# @movibe/logger

A flexible and type-safe logging system for JavaScript/TypeScript applications, built with Bun.

[![Tests & Coverage](https://github.com/movibe/logger/actions/workflows/tests.yml/badge.svg)](https://github.com/movibe/logger/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/movibe/logger/branch/main/graph/badge.svg)](https://codecov.io/gh/movibe/logger)
[![Coverage Statements](https://img.shields.io/badge/Coverage%20Statements-100%25-brightgreen.svg?style=flat)](https://github.com/movibe/logger/actions)
[![Coverage Functions](https://img.shields.io/badge/Coverage%20Functions-100%25-brightgreen.svg?style=flat)](https://github.com/movibe/logger/actions)
[![Coverage Lines](https://img.shields.io/badge/Coverage%20Lines-100%25-brightgreen.svg?style=flat)](https://github.com/movibe/logger/actions)

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
