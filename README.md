# @movibe/logger

[![Tests & Coverage](https://github.com/movibe/logger/actions/workflows/tests.yml/badge.svg)](https://github.com/movibe/logger/actions/workflows/tests.yml)
[![codecov](https://codecov.io/gh/movibe/logger/branch/main/graph/badge.svg)](https://codecov.io/gh/movibe/logger)
[![Coverage Statements](https://img.shields.io/badge/Coverage%20Statements-100%25-brightgreen.svg?style=flat)](https://github.com/movibe/logger/actions)
[![Coverage Functions](https://img.shields.io/badge/Coverage%20Functions-100%25-brightgreen.svg?style=flat)](https://github.com/movibe/logger/actions)
[![Coverage Lines](https://img.shields.io/badge/Coverage%20Lines-100%25-brightgreen.svg?style=flat)](https://github.com/movibe/logger/actions)

A TypeScript-based universal logging solution that provides consistent logging across different platforms and environments.

## Features

- 🌟 **Universal Compatibility** - Works across Node.js, browsers, and other JavaScript runtimes
- 🔒 **Type Safety** - Built with TypeScript for robust type checking
- 📦 **Multiple Transports** - Support for console, file, and custom transport layers
- 🎯 **Configurable Levels** - Flexible log level configuration
- 🚀 **Performance Optimized** - Minimal overhead for production environments
- 🔍 **Context Support** - Rich contextual logging capabilities
- 📊 **Structured Logging** - JSON-based log format for better parsing

## Table of Contents

- [@movibe/logger](#movibelogger)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Type Definitions](#type-definitions)
  - [Basic Usage](#basic-usage)
    - [Creating a Custom Logger](#creating-a-custom-logger)
    - [Using the Custom Logger](#using-the-custom-logger)
  - [Advanced Features](#advanced-features)
    - [Log Levels](#log-levels)
    - [User Tracking](#user-tracking)
    - [Screen Tracking](#screen-tracking)
    - [Error Handling](#error-handling)
    - [E-commerce Tracking](#e-commerce-tracking)
    - [Custom Events](#custom-events)
  - [API Reference](#api-reference)
    - [Core Methods](#core-methods)
    - [User Methods](#user-methods)
    - [E-commerce Methods](#e-commerce-methods)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```bash
npm install @movibe/logger
# or
yarn add @movibe/logger
# or
bun add @movibe/logger
```

## Type Definitions

Define your custom types for type-safe logging:

```typescript
// Log tags for different types of logs
type CustomLogTags = "custom_start" | "custom_end";

// Network tags for API and GraphQL operations
type CustomNetworkTags =
  | "GraphqlQuery_error_graphql"
  | "RestApi_error"
  | "api_call"
  | "websocket";

// User properties interface
interface CustomUser {
  id: string;
  role: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: string;
}

// E-commerce checkout interface
interface CustomCheckout {
  currency?: string;
  value?: number;
  customField: string;
}

// Purchase information interface
interface CustomPurchase {
  type: "credit_card";
  customStatus: string;
  affiliation?: string;
  coupon?: string;
  currency?: string;
}

// Custom events with their respective payloads
type CustomEvent = {
  "app-open": Record<string, never>;
  "user-login": { method: string };
  "user-register": { method: string };
  "add-to-cart": { product_id: string; quantity: number };
  "remove-from-cart": { product_id: string; quantity: number };
};
```

## Basic Usage

### Creating a Custom Logger

Primeiro, crie sua classe customizada implementando a interface `LoggerStrategyType`:

```typescript
import { LoggerStrategyType } from "@movibe/logger";

const TAG = "DEBUG";

// Define your custom types
type CustomLogTags = "custom_start" | "custom_end";
type CustomNetworkTags =
  | "GraphqlQuery_error_graphql"
  | "RestApi_error"
  | "api_call"
  | "websocket";
interface CustomUser {
  id: string;
  role: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: string;
}
interface CustomCheckout {
  currency?: string;
  value?: number;
  customField: string;
}
interface CustomPurchase {
  type: "credit_card";
  customStatus: string;
  affiliation?: string;
  coupon?: string;
  currency?: string;
}

type CustomEvent = {
  "app-open": Record<string, never>;
  "user-login": { method: string };
  "user-register": { method: string };
  "add-to-cart": { product_id: string; quantity: number };
  "remove-from-cart": { product_id: string; quantity: number };
};

// Implement your custom logger
export class DebugLogger
  implements
    LoggerStrategyType<
      CustomLogTags,
      CustomNetworkTags,
      CustomUser,
      CustomCheckout,
      CustomPurchase,
      CustomEvent
    >
{
  init(): void {
    console.log(`${TAG}.init`);
  }

  info(feature: string, name: string, properties?: any): void {
    console.log(`${TAG}.info: `, feature, name, properties);
  }

  error(
    feature: string,
    name: string,
    critical = false,
    error: Error,
    extra: Record<string, unknown> = {}
  ): void {
    console.error(`${TAG}.error: `, { critical, error, extra, feature, name });
  }

  event(name: string, properties?: Record<string, any>): void {
    if (properties) {
      console.log(`${TAG}.event: `, name, properties);
    } else {
      console.log(`${TAG}.event: `, name);
    }
  }

  network(name: CustomNetworkTags, properties?: Record<string, any>): void {
    if (properties) {
      console.log(
        `${TAG}.network: ${properties.operationName} | `,
        name,
        properties
      );
    } else {
      console.log(`${TAG}.network:`, name);
    }
  }

  logScreen(screenName: string, properties?: Record<string, any>): void {
    console.log(`${TAG}.logScreen: `, { screenName, ...properties });
  }

  setUser(user: CustomUser): void {
    const userProperties = {
      email: user.email ?? "",
      id: user.id,
      name: user.name ?? "",
      phone: user.phone,
      status: user.status,
    };

    console.log(`${TAG}.setUser: `, userProperties);
    this.setUserId(user.id);
  }

  setUserId(userId: string): void {
    console.log(`${TAG}.setUserId: `, userId);
  }

  setUserProperty(name: string, value: any): void {
    console.log(`${TAG}.setUserProperty: `, name, value);
  }

  setUserProperties(properties: CustomUser): void {
    console.log(`${TAG}.setUserProperties: `, properties);
  }

  logBeginCheckout(checkoutId: string, properties: CustomCheckout): void {
    console.log(`${TAG}.logBeginCheckout: `, checkoutId, properties);
  }

  logPaymentSuccess(checkoutId: string, properties: CustomPurchase): void {
    console.log(`${TAG}.logPaymentSuccess: `, checkoutId, properties);
  }

  reset(): void {
    console.log(`${TAG}.reset`);
  }

  flush(): void {
    console.log(`${TAG}.flush`);
  }

  getId(): string {
    return "DebugLogger";
  }
}
```

### Using the Custom Logger

Depois de criar sua classe customizada, você pode usá-la em qualquer parte da aplicação:

```typescript
import { LoggerStrategy } from "@movibe/logger";
import { DebugLogger } from "./debug-logger";

// Initialize with custom logger
const logger = new LoggerStrategy<
  CustomLogTags,
  CustomNetworkTags,
  CustomUser,
  CustomCheckout,
  CustomPurchase,
  CustomEvent
>([
  {
    class: new DebugLogger(),
    enabled: true,
  },
]);

// Initialize logger
logger.init();

// Log events with type safety
logger.event("app-open");

// User tracking with custom fields
logger.setUser({
  id: "123",
  role: "user",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  status: "active",
});

// Screen tracking with custom properties
logger.logScreen("HomeScreen", {
  referrer: "DeepLink",
  customData: "test",
});

// Error tracking with context
try {
  throw new Error("Test error");
} catch (error) {
  logger.error("Authentication", "login-failed", true, error as Error, {
    userId: "123",
  });
}

// E-commerce tracking with custom fields
logger.logBeginCheckout("checkout-123", {
  currency: "USD",
  value: 99.99,
  customField: "test-checkout",
});

logger.logPaymentSuccess("checkout-123", {
  type: "credit_card",
  customStatus: "completed",
  currency: "USD",
  affiliation: "web-store",
  coupon: "DISCOUNT10",
});

// Reset and flush
logger.reset();
logger.flush();
```

## Advanced Features

### Log Levels

The logger supports different log levels to control the verbosity of logging:

```typescript
// Set minimum log level (default is 'info')
logger.setMinLogLevel('debug');

// Available log levels (in order of severity):
// - debug: Detailed information for debugging
// - info: General operational information
// - warn: Warning messages for potentially harmful situations
// - error: Error events that might still allow the application to continue
// - fatal: Very severe error events that will presumably lead to application failure

// Logging with different levels
logger.debug('Auth', 'User session expired', { userId: '123' });
logger.info('Auth', 'User logged in', { userId: '123' });
logger.warn('Auth', 'Multiple failed login attempts', { userId: '123' });
logger.error('Auth', 'Login failed', false, new Error('Invalid credentials'));
logger.fatal('Auth', 'Database connection failed', new Error('Connection timeout'));

// You can also specify log level in options for any logging method
logger.log('custom_event', { data: 'value' }, { level: 'debug' });
logger.event('user-action', { action: 'click' }, { level: 'info' });
logger.network('api-call', { endpoint: '/users' }, { level: 'warn' });
```

### User Tracking

Track user information and properties:

```typescript
// Set complete user object
logger.setUser({
  id: "123",
  role: "user",
  name: "John Doe",
  email: "john@example.com",
});

// Set individual user property
logger.setUserProperty("plan", "premium");

// Set user ID only
logger.setUserId("123");
```

### Screen Tracking

Track screen views and navigation:

```typescript
// Basic screen view
logger.logScreen("HomeScreen");

// Screen view with context
logger.logScreen("ProductScreen", {
  referrer: "HomeScreen",
  productId: "123",
});
```

### Error Handling

Comprehensive error tracking:

```typescript
try {
  throw new Error("API Request Failed");
} catch (error) {
  logger.error(
    "API", // Feature/component
    "request-failed", // Error type
    true, // Is critical error
    error as Error, // Error object
    {
      // Additional context
      endpoint: "/users",
      method: "GET",
      statusCode: 500,
    }
  );
}
```

### E-commerce Tracking

Track e-commerce events and transactions:

```typescript
// Begin checkout process
logger.logBeginCheckout("checkout-123", {
  currency: "USD",
  value: 99.99,
  customField: "premium-plan",
});

// Track successful payment
logger.logPaymentSuccess("checkout-123", {
  type: "credit_card",
  customStatus: "completed",
  currency: "USD",
  affiliation: "web-store",
});
```

### Custom Events

Track custom events with type safety:

```typescript
// Track login event
logger.event("user-login", {
  method: "email",
});

// Track cart action
logger.event("add-to-cart", {
  product_id: "prod_123",
  quantity: 1,
});
```

## API Reference

### Core Methods

- `init()` - Initialize the logger
- `event(name, properties?)` - Log custom events
- `error(feature, name, critical, error, extra?)` - Log errors
- `logScreen(name, properties?)` - Track screen views
- `setUser(user)` - Set user information
- `reset()` - Reset all user data
- `flush()` - Flush pending logs

### User Methods

- `setUserId(id)` - Set user ID
- `setUserProperty(name, value)` - Set single user property
- `setUserProperties(properties)` - Set multiple user properties

### E-commerce Methods

- `logBeginCheckout(checkoutId, properties)` - Track checkout initiation
- `logPaymentSuccess(checkoutId, properties)` - Track successful payments

For more detailed documentation, please visit our [docs](./docs) directory.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

```
