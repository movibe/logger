# Tests Documentation

## Overview

The test suite for the Universal Logger consists of two main test files:

1. `LoggerStrategy.test.ts`: Tests for the main logger functionality
2. `types.test.ts`: Tests for type definitions and interfaces

## LoggerStrategy Tests

The `LoggerStrategy.test.ts` file contains tests for:

- Basic logger initialization and configuration
- Event logging functionality
- Error handling
- User management
- Checkout and payment flows
- Multiple strategy handling
- Strategy error handling

### Key Test Cases

- Strategy initialization and configuration
- Event logging with different types of events
- Error handling and validation
- User management (setUser, setUserId, setUserProperties)
- Checkout flow (beginCheckout, paymentSuccess)
- Screen logging
- Network request logging
- Multiple strategy support
- Disabled strategy handling
- Strategy execution error handling

## Types Tests

The `types.test.ts` file contains tests for:

- LOG_TAGS validation
- EVENT_TAGS validation
- NETWORK_ANALYTICS_TAGS validation
- User interface validation
- LogItem interface validation
- CheckoutData interface validation
- PaymentData interface validation
- BeginCheckoutEvent interface validation
- PurchaseLogEvent interface validation
- Item interface validation

### Key Test Cases

- Required and optional fields validation
- Nested object validation
- Array field validation
- Payment type validation
- Minimal and full object validation

## Running Tests

To run the tests, use the following command:

```bash
bun test
```

## Test Coverage

The test suite aims to provide comprehensive coverage of:

- All public methods in LoggerStrategy
- All type definitions and interfaces
- Edge cases and error conditions
- Multiple strategy scenarios
- Type safety and validation

## Adding New Tests

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Test both success and failure cases
4. Include type validation where appropriate
5. Mock external dependencies
6. Test edge cases and error conditions
