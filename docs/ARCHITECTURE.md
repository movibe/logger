# Universal Logger Architecture

## Overview
The Universal Logger is a TypeScript-based logging system that implements the Strategy pattern to support multiple logging implementations. It provides a unified interface for logging various types of events, user actions, and analytics data.

## Core Components

### LoggerStrategy
The main class that orchestrates logging operations across multiple logging implementations. It:
- Manages multiple logging strategies
- Provides error handling and parameter validation
- Implements methods for various logging operations

### LoggerStrategyType
An abstract class that defines the interface that all logging implementations must follow. It includes:
- Basic logging operations (log, info, error)
- User tracking methods
- E-commerce tracking methods
- Analytics events

### Types
- `LOG_TAGS`: Standard logging events
- `EVENT_TAGS`: Application-specific events with their payloads
- `NETWORK_ANALYTICS_TAGS`: Network-related events
- Various interfaces for e-commerce tracking (Item, CheckoutData, etc.)

## Error Handling
The system implements centralized error handling through the `executeStrategy` method, which:
- Catches and logs errors from individual strategies
- Prevents cascading failures
- Provides consistent error reporting

## Type Safety
The implementation uses TypeScript generics extensively to ensure type safety across:
- Event names and their corresponding payloads
- User properties
- E-commerce data structures

## Usage
```typescript
const logger = new LoggerStrategy([
  {
    class: GoogleAnalyticsLogger,
    enabled: true
  },
  {
    class: CustomLogger,
    enabled: process.env.NODE_ENV === 'development'
  }
]);

logger.init();
logger.log('user_login', { method: 'email' });
```