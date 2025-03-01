
--- Repository Documentation ---

# @movibe/logger Documentation

## Introduction

`@movibe/logger` is a flexible and type-safe logging system.
It is designed for JavaScript/TypeScript applications.
It uses the strategy pattern to support multiple logging implementations.
It provides a unified interface for logging events, user actions, and analytics data.

## Quick Start

### Installation

Install `@movibe/logger` using your preferred package manager:

**npm:**
```bash
npm install @movibe/logger
```

**yarn:**
```bash
yarn add @movibe/logger
```

**pnpm:**
```bash
pnpm add @movibe/logger
```

**bun:**
```bash
bun add @movibe/logger
```

### Basic Usage

Import `LoggerStrategy` and initialize it with logging strategies.
Then use it to log events.

```typescript
import { LoggerStrategy } from "@movibe/logger";

// Initialize with a single strategy (example - replace GoogleAnalyticsLogger with a real implementation)
const logger = new LoggerStrategy([
  {
    class: /* GoogleAnalyticsLogger */ { init: () => {}, log: (event, props) => console.log('log', event, props) } as any, // Replace with actual LoggerStrategyType implementation
    enabled: true,
  },
]);

// Initialize the logger
logger.init();

// Log a simple event
logger.log("user_login", { method: "email" });
```

## Core Concepts

### LoggerStrategy

`LoggerStrategy` is the main class.
It manages multiple logging strategies.
It provides a unified interface for logging.
It implements the Strategy pattern.
It handles error handling and parameter validation.

### LoggerStrategyType

`LoggerStrategyType` is an abstract class.
It defines the interface for all logging implementations.
Custom logging strategies must extend this class.
It includes methods for:
- Basic logging operations (`log`, `info`, `error`)
- User tracking methods
- E-commerce tracking methods
- Analytics events

### Event Types

`@movibe/logger` uses TypeScript types for event safety.
It provides predefined types for common logging events:

- `LOG_TAGS`: Standard logging events (e.g., `app_start`, `user_login`).
- `EVENT_TAGS`: Application-specific events with typed payloads.
- `NETWORK_ANALYTICS_TAGS`: Network-related events (e.g., API requests).

## API Reference

### LoggerStrategy Class

#### Constructor

```typescript
constructor(injectors: LoggerStrategyConstructor<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent>[])
```

- `injectors`: An array of strategy configurations. Each configuration has:
    - `class`: An instance of a class that implements `LoggerStrategyType`.
    - `enabled`: A boolean indicating if the strategy is enabled.

#### Methods

##### `init()`

Initializes all enabled logging strategies.
It calls the `init()` method of each strategy.
It logs an `app-open` event after initialization.

```typescript
init(): void
```

##### `log(name: TLogTags, properties?: Record<string, any>)`

Logs a general event.

- `name`:  A string from `LOG_TAGS` or a custom string.
- `properties`: Optional properties for the event.

```typescript
log(name: TLogTags, properties?: Record<string, any>): void
```

##### `event<T extends keyof TEvent>(name: T, properties?: TEvent[T])`

Logs a custom application event.

- `name`: A key from `EVENT_TAGS` interface.
- `properties`:  Properties specific to the event type, defined in `EVENT_TAGS`.

```typescript
event<T extends keyof TEvent>(name: T, properties?: TEvent[T]): void
```

##### `network(name: TNetworkTags, properties?: Record<string, any>)`

Logs a network-related event.

- `name`: A string from `NETWORK_ANALYTICS_TAGS`.
- `properties`: Optional properties for the network event (e.g., URL, method, duration).

```typescript
network(name: TNetworkTags, properties?: Record<string, any>): void
```

##### `info(feature: string, name: string, properties?: Record<string, any> | string | boolean)`

Logs an informational message.

- `feature`: Feature area of the log.
- `name`:  Name of the info log.
- `properties`:  Optional properties for the info log.

```typescript
info(feature: string, name: string, properties?: Record<string, any> | string | boolean): void
```

##### `error(feature: string, name: string, critical: boolean, error: unknown, extra?: Record<string, unknown>)`

Logs an error.

- `feature`:  Feature area where the error occurred.
- `name`:  Name of the error.
- `critical`:  Boolean indicating if the error is critical.
- `error`:  The error object.
- `extra`:  Optional extra context information.

```typescript
error(feature: string, name: string, critical: boolean, error: unknown, extra?: Record<string, unknown>): void
```

##### `logScreen(screenName: string, params?: Record<string, any>)`

Logs a screen view event.

- `screenName`: Name of the screen.
- `params`: Optional parameters for the screen view.

```typescript
logScreen(screenName: string, params?: Record<string, any>): void
```

##### `reset()`

Resets user-specific data in all strategies.

```typescript
reset(): void
```

##### `setUserId(userId: string)`

Sets the user ID for all strategies.

- `userId`:  User identifier.

```typescript
setUserId(userId: string): void
```

##### `setUser(properties: TUser)`

Sets the complete user object.
User object must include an `id`.

- `properties`: User object conforming to the `User` interface.

```typescript
setUser(properties: TUser): void
```

##### `setUserProperties(properties: Record<string, any>)`

Sets user properties.

- `properties`: An object containing user properties.

```typescript
setUserProperties(properties: Record<string, any>): void
```

##### `setUserProperty(name: string, value: Record<string, any>)`

Sets a single user property.

- `name`:  Property name.
- `value`:  Property value.

```typescript
setUserProperty(name: string, value: Record<string, any>): void
```

##### `logBeginCheckout(checkoutId: string, params: TBeginCheckout)`

Logs the start of a checkout process.

- `checkoutId`:  Identifier for the checkout.
- `params`:  Checkout parameters conforming to `BeginCheckoutEvent`.

```typescript
logBeginCheckout(checkoutId: string, params: TBeginCheckout): void
```

##### `logPaymentSuccess(checkoutId: string, params: TPurchase)`

Logs a successful payment event.

- `checkoutId`: Identifier for the checkout.
- `params`: Payment parameters conforming to `PurchaseLogEvent`.

```typescript
logPaymentSuccess(checkoutId: string, params: TPurchase): void
```

##### `flush()`

Flushes any pending logs in all strategies.

```typescript
flush(): void
```

##### `getStrategy(id: string)`

Retrieves a strategy instance by its ID.

- `id`: The ID of the strategy (returned by `getId()` method of the strategy).

```typescript
getStrategy(id: string): LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent> | undefined
```

##### `hasStrategy(id: string)`

Checks if a strategy with the given ID exists.

- `id`: The ID of the strategy.

```typescript
hasStrategy(id: string): boolean
```

##### `info(feature: string, name: string, properties?: Record<string, any> | string | boolean)`

Logs an informational message.

- `feature`: Feature area of the log.
- `name`: Name of the info log.
- `properties`: Optional properties.

```typescript
info(feature: string, name: string, properties?: Record<string, any> | string | boolean): void
```

### Interfaces and Types

#### `LoggerStrategyConstructor`

```typescript
interface LoggerStrategyConstructor<
  TLogTags extends string = LOG_TAGS,
  TNetworkTags extends string = NETWORK_ANALYTICS_TAGS,
  TUser extends { id: string } = User,
  TBeginCheckout extends { currency?: string; value?: number } = BeginCheckoutEvent,
  TPurchase extends { type: string } = PurchaseLogEvent,
  TEvent extends Record<string, any> = EVENT_TAGS
> {
  class: LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent>;
  enabled: boolean;
}
```

Defines the configuration for a logging strategy.

- `class`:  An instance of a class implementing `LoggerStrategyType`.
- `enabled`:  A boolean to enable or disable the strategy.

#### `LoggerStrategyType`

```typescript
abstract class LoggerStrategyType<
	TLogTags extends string = LOG_TAGS,
	TNetworkTags extends string = NETWORK_ANALYTICS_TAGS,
	TUser extends { id: string } = User,
	TBeginCheckout extends { currency?: string; value?: number } = BeginCheckoutEvent,
	TPurchase extends { type: string } = PurchaseLogEvent,
	TEvent extends Record<string, any> = EVENT_TAGS
>
```

Abstract class that custom logger strategies should extend.
It defines the interface for logging operations.

#### `LOG_TAGS`

```typescript
type LOG_TAGS = 
  | 'app_start'
  | 'app_background'
  | 'app_foreground'
  | 'app_crash'
  | 'user_login'
  | 'user_logout'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | string;
```

Predefined types for general log events.
It includes common application lifecycle and user action events.
It can be extended with custom string tags.

#### `EVENT_TAGS`

```typescript
type EVENT_TAGS = {
  'app-open': Record<string, never>
  'user-login': { method: string }
  'user-register': { method: string }
  'add-to-cart': { product_id: string; quantity: number }
  'remove-from-cart': { product_id: string; quantity: number }
  'begin-checkout': { total: number; items: number }
  'purchase-complete': { order_id: string; total: number }
}
```

Defines application-specific events with their payloads.
Ensures type safety for event properties.

#### `NETWORK_ANALYTICS_TAGS`

```typescript
type NETWORK_ANALYTICS_TAGS =
  | 'GraphqlQuery_error_graphql'
  | 'GraphqlQuery_info_graphql'
  | 'GraphqlQuery_request_graphql'
  | 'RestApi_error'
  | 'RestApi_info'
  | 'RestApi_request'
  | 'WebSocket_error'
  | 'WebSocket_info'
  | 'WebSocket_request';
```

Predefined types for network request analytics events.
Used for tracking API calls, GraphQL queries, and WebSocket events.

#### `User`

```typescript
interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: string;
  [key: string]: any;
}
```

Interface for user properties.
`id` is required. Other properties are optional and can be extended.

#### `LogItem`

```typescript
interface LogItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  [key: string]: any;
}
```

Interface for items in e-commerce events.

#### `CheckoutData`

```typescript
interface CheckoutData {
  currency: string;
  value: number;
  items: LogItem[];
  [key: string]: any;
}
```

Interface for checkout related data.

#### `PaymentData`

```typescript
interface PaymentData extends CheckoutData {
  tax?: number;
  shipping?: number;
  transaction_id: string;
  type: string;
}
```

Interface for payment data, extending `CheckoutData`.

#### `BeginCheckoutEvent`

```typescript
interface BeginCheckoutEvent {
	currency?: string
	value?: number
	coupon?: string
	items?: Item[]
}
```

Interface for begin checkout event parameters.

#### `PurchaseLogEvent`

```typescript
interface PurchaseLogEvent {
	affiliation?: string
	coupon?: string
	currency?: string
	items?: Item[]
	shipping?: number
	tax?: number
	value?: number
	transaction_id?: string
	type: 'credit_card'
}
```

Interface for purchase log event parameters.

#### `Item`

```typescript
interface Item {
	item_brand?: string
	item_id?: string
	item_name?: string
	item_category?: string
	item_category2?: string
	item_category3?: string
	item_category4?: string
	item_category5?: string
	item_list_id?: string
	item_list_name?: string
	item_location_id?: string
	item_variant?: string
	quantity?: number
	price?: number
}
```

Interface for item details, used in e-commerce events.

## Advanced Usage

### Multiple Strategies

Initialize `LoggerStrategy` with multiple strategy configurations.
Enabled strategies will all receive log events.

```typescript
const logger = new LoggerStrategy([
  {
    class: /* GoogleAnalyticsLogger */ { init: () => {}, log: (event, props) => console.log('GA log', event, props) } as any, // Replace with actual LoggerStrategyType implementation
    enabled: true,
  },
  {
    class: /* CustomLogger */ { init: () => {}, log: (event, props) => console.log('Custom log', event, props) } as any, // Replace with actual LoggerStrategyType implementation
    enabled: process.env.NODE_ENV === "production",
  },
]);
```

### User Tracking

Use `setUser`, `setUserId`, and `setUserProperties` methods to track user data.

```typescript
// Set user ID
logger.setUserId("user123");

// Set user properties
logger.setUserProperties({
  name: "John Doe",
  email: "john@example.com",
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

Use `logBeginCheckout` and `logPaymentSuccess` for e-commerce flow tracking.

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

Use the `error` method to log errors with context and criticality.

```typescript
try {
  // Some code that might fail
} catch (error) {
  logger.error(
    "PaymentProcessor", // Feature
    "PaymentFailed", // Error type
    true, // Is fatal
    error as Error, // Error object
    { orderId: "123" } // Additional context
  );
}
```

### Network Analytics

Use the `network` method to log network requests.

```typescript
// Track REST API requests
logger.network("RestApi_request", {
  url: "/api/users",
  method: "GET",
  status: 200,
  duration: 150,
});
```

### Screen Tracking

Use `logScreen` to track screen views.

```typescript
logger.logScreen("ProductDetails", {
  productId: "123",
  category: "Electronics",
});
```

### Custom Events

Use the `event` method with custom event names and properties.

```typescript
logger.event("custom-event", {
  category: "engagement",
  action: "click",
  label: "signup-button",
});
```

## Configuration

Strategy configuration is done when initializing `LoggerStrategy`.

```typescript
const logger = new LoggerStrategy([
  {
    class: MyCustomLoggerStrategy, // Your custom LoggerStrategyType implementation
    enabled: true, // Enable or disable the strategy
  },
]);
```

Each strategy in the `injectors` array is configured with:

- `class`:  The strategy implementation class. Must be an instance of a class that extends `LoggerStrategyType`.
- `enabled`: A boolean value. If `true`, the strategy will be active and receive log events. If `false`, it will be ignored.

## Dependencies

- TypeScript
- Bun (for development and testing)
- `@types/node` (dev dependency)
- `eslint`, `@typescript-eslint/*` (dev dependencies for linting)
- `cursor-tools` (dev dependency)

## Testing

Run tests using Bun:

```bash
bun test
```

Generate test coverage report:

```bash
bun test --coverage
```

Tests are located in the `src/__tests__` directory.

## Build Process

Build the library using Bun:

```bash
bun run build
```

This command compiles TypeScript code and bundles it into the `dist` directory.

## License

MIT License. See [LICENSE](LICENSE) file for details.

--- End of Documentation ---
