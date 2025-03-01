# Testing Documentation

## Overview

This project uses Bun's built-in test runner. The tests are written in TypeScript and are located in the `src/__tests__` directory.

## Test Structure

The tests are organized by module, with each test file corresponding to a source file:

- `LoggerStrategy.test.ts` - Tests for the main logger functionality
- `types.test.ts` - Type validation tests

## Running Tests

To run the tests, use the following command:

```bash
bun test
```

## Test Coverage

To generate a test coverage report, run:

```bash
bun test --coverage
```

The coverage report will be displayed in the terminal.

Current coverage results:

| File      | % Statements | % Branch | % Functions | % Lines | Uncovered Line #s      |
| --------- | ------------ | -------- | ----------- | ------- | ---------------------- |
| All files | 75%          | 53.94%   | 79.31%      | 74.07%  |                        |
| index.ts  | 76.36%       | 53.94%   | 79.31%      | 75.47%  | 38-39,52,87-94,110-121 |
| types.ts  | 0%           | 100%     | 100%        | 0%      | 81                     |

Areas needing improvement:

1. Branch coverage in index.ts
2. Line coverage for error handling scenarios
3. Edge cases in executeStrategy method

## Writing Tests

### Mocking

The project uses Bun's built-in mocking capabilities. For example, in `LoggerStrategy.test.ts`, we create a mock implementation of the `LoggerStrategyType` interface:

```typescript
class MockLoggerStrategy
  implements
    LoggerStrategyType<
      string,
      string,
      User,
      BeginCheckoutEvent,
      PurchaseLogEvent,
      EVENT_TAGS
    >
{
  init = mock(() => {});
  log = mock(() => {});
  // ... other methods
}
```

### Test Cases

Tests are organized using Bun's `describe` and `test` blocks. Each test case should:

1. Set up the test environment
2. Execute the code being tested
3. Make assertions about the results

Example:

```typescript
describe("LoggerStrategy", () => {
  test("should initialize correctly", () => {
    logger.init();
    expect(mockStrategy.init).toHaveBeenCalled();
  });
});
```

### Event Type Testing

The project includes comprehensive testing for event types and their payloads:

```typescript
test("should handle custom events with typed properties", () => {
  const loginEvent: EVENT_TAGS["user-login"] = { method: "email" };
  logger.event("user-login", loginEvent);
  expect(mockStrategy.event).toHaveBeenCalledWith("user-login", loginEvent);
});
```

This ensures that:

1. Event names are correctly typed
2. Event payloads match their type definitions
3. Type safety is maintained across the logging system

### Best Practices

1. Use descriptive test names that explain the expected behavior
2. Test both success and failure cases
3. Clean up after each test using `afterEach`
4. Mock external dependencies
5. Test edge cases and error conditions
6. Ensure type safety with proper type annotations
7. Test all supported event types and their payloads

### Type Testing

The project includes comprehensive type testing to ensure type safety:

```typescript
test("should validate User interface", () => {
  const validUser: User = {
    id: "123",
    email: "test@example.com",
    name: "Test User",
  };
  expect(validUser.id).toBeDefined();
});
```

This helps catch type-related issues at compile time.

## Building with Bun

The project uses Bun for building the TypeScript code. To build the project, run:

```bash
bun run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory.
