# System Patterns

## Logger Implementation Patterns

### Strategy Pattern
The logger uses the Strategy pattern to allow different logging implementations:
```typescript
const logger = new LoggerStrategy<CustomTypes>([
  {
    class: new DebugLogger(),
    enabled: true,
  }
]);
```

### Observer Pattern
Events are handled using an observer-like pattern where loggers observe and react to events:
```typescript
logger.event("app-open");
logger.logScreen("HomeScreen");
```

### Builder Pattern
User and event data is built up incrementally:
```typescript
logger.setUser({ id: "123" });
logger.setUserProperty("plan", "premium");
```

## Common Use Cases

### User Tracking
```typescript
logger.setUser({
  id: "123",
  role: "user",
  name: "John Doe"
});
```

### Error Handling
```typescript
logger.error(
  "API",
  "request-failed",
  true,
  error,
  { context: "additional info" }
);
```

### E-commerce Flow
```typescript
logger.logBeginCheckout("checkout-123", {
  currency: "USD",
  value: 99.99
});

logger.logPaymentSuccess("checkout-123", {
  type: "credit_card",
  status: "completed"
});
```

## Best Practices

1. Always initialize logger before use
2. Use type-safe event names and properties
3. Provide context with errors
4. Reset user data when session ends
5. Flush logs before app closes
6. Use custom loggers for specific needs