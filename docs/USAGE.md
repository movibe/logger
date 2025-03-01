# Usage Guide

## Installation

```bash
npm install @movibe/logger
# or
yarn add @movibe/logger
# or
bun add @movibe/logger
```

## Basic Usage

```typescript
import { LoggerStrategy } from "@movibe/logger";

// Initialize with a single strategy
const logger = new LoggerStrategy([
  {
    class: GoogleAnalyticsLogger,
    enabled: true,
  },
]);

// Initialize the logger
logger.init();

// Log a simple event
logger.log("user_login", { method: "email" });
```

## Advanced Usage

### Multiple Strategies

```typescript
const logger = new LoggerStrategy([
  {
    class: GoogleAnalyticsLogger,
    enabled: true,
  },
  {
    class: CustomLogger,
    enabled: process.env.NODE_ENV === "production",
  },
]);
```

### User Tracking

```typescript
// Set user ID
logger.setUserId("user123");

// Set user properties
logger.setUserProperties({
  name: "John Doe",
  email: "john@example.com",
  plan: "premium",
});

// Set complete user object
logger.setUser({
  id: "user123",
  name: "John Doe",
  email: "john@example.com",
  status: "active",
});
```

### E-commerce Tracking

```typescript
// Track begin checkout
logger.logBeginCheckout("checkout123", {
  currency: "USD",
  value: 99.99,
  items: [
    {
      item_id: "SKU123",
      item_name: "Premium Plan",
      price: 99.99,
      quantity: 1,
    },
  ],
});

// Track successful purchase
logger.logPaymentSuccess("checkout123", {
  type: "credit_card",
  currency: "USD",
  value: 99.99,
  transaction_id: "tx123",
  items: [
    {
      item_id: "SKU123",
      item_name: "Premium Plan",
      price: 99.99,
      quantity: 1,
    },
  ],
});
```

### Error Tracking

```typescript
try {
  // Some code that might fail
} catch (error) {
  logger.error(
    "PaymentProcessor", // Feature
    "PaymentFailed", // Error type
    true, // Is fatal
    error, // Error object
    { orderId: "123" } // Additional context
  );
}
```

### Network Analytics

```typescript
// Track REST API requests
logger.network("RestApi_request", {
  url: "/api/users",
  method: "GET",
  status: 200,
  duration: 150,
});

// Track GraphQL queries
logger.network("GraphqlQuery_request_graphql", {
  operation: "GetUserProfile",
  duration: 100,
});
```

### Screen Tracking

```typescript
logger.logScreen("ProductDetails", {
  productId: "123",
  category: "Electronics",
});
```

### Custom Events

```typescript
logger.event("custom-event", {
  category: "engagement",
  action: "click",
  label: "signup-button",
});
```

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Build the project
bun run build
```

## Type Safety

The logger is built with TypeScript and provides type definitions for all events and parameters. This ensures that you're using the correct event names and data structures at compile time.

## Performance Considerations

- The logger uses strategy caching to improve performance
- Events are batched when possible
- Disabled strategies have zero overhead
- Type checking is done at compile time
