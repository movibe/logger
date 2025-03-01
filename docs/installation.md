# Installation

The `@movibe/logger` package is available on npm. You can install it using your preferred package manager:

## Using npm

```bash
npm install @movibe/logger
```

## Using yarn

```bash
yarn add @movibe/logger
```

## Using pnpm

```bash
pnpm add @movibe/logger
```

## Using bun

```bash
bun add @movibe/logger
```

After installation, you can import and use the logger in your project:

```typescript
import { Logger } from '@movibe/logger';

// Create a new logger instance
const logger = new Logger();

// Start using it
logger.info('Hello from @movibe/logger!');
```

For more information on how to use the logger, please check the [usage documentation](./usage.md).