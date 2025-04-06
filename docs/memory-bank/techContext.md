# Technical Context

## Architecture
The logger is built with a modular architecture that separates concerns:

### Core Components
1. LoggerStrategy - Main entry point for logging operations
2. LoggerStrategyType - Interface for implementing custom loggers
3. Transport Layer - Handles output of log entries
4. Type System - Provides type safety for all operations

### Type System
```typescript
type CustomLogTags = "custom_start" | "custom_end";
type CustomNetworkTags = "GraphqlQuery_error_graphql" | "RestApi_error" | "api_call" | "websocket";

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
```

## Implementation Details
- Built with TypeScript for type safety
- Zero runtime dependencies
- Bun.js optimized
- 100% test coverage
- ESLint configured for code quality
- Automated CI/CD with GitHub Actions

## Development Setup
```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build
```