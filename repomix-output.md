This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded

## Additional Info

# Directory Structure
```
.cursor/
  rules/
    typescript-best-practices.mdc
.github/
  workflows/
    release.yml
docs/
  ARCHITECTURE.md
  build.md
  github-workflow.md
  installation.md
  releases.md
  testing.md
  USAGE.md
examples/
  node-js/
    debug.ts
    index.ts
memory/
  activeContext.md
  productContext.md
  progress.md
  projectbrief.md
  systemPatterns.md
  techContext.md
scripts/
  release.sh
src/
  __tests__/
    bun.d.ts
    LoggerStrategy.test.ts
    types.test.ts
  index.ts
  types.ts
.clinerules
.eslintrc.json
.gitignore
.npmignore
.repomixignore
LICENSE
package.json
README.md
repomix.config.json
tsconfig.json
```

# Files

## File: .cursor/rules/typescript-best-practices.mdc
````
---
description: TypeScript coding standards and type safety guidelines
globs: \*_/_.{ts,tsx}
---
- Use strict null checks to prevent null or undefined errors
- Prefer interfaces over types for better extensibility
- Implement type guards and assertions for runtime type checking
- Use type inference where possible to reduce type annotations
````

## File: .github/workflows/release.yml
````yaml
name: Release

on:
  push:
    branches:
      - main

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build

      - name: Bump version and push tag
        id: tag_version
        uses: mathieudutour/github-tag-action@v6.1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ steps.tag_version.outputs.new_tag }}
          release_name: Release ${{ steps.tag_version.outputs.new_tag }}
          body: ${{ steps.tag_version.outputs.changelog }}
          draft: false
          prerelease: false
      
      - name: Update package.json version
        run: npm version ${{ steps.tag_version.outputs.new_tag }} --no-git-tag-version
      
      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
````

## File: docs/ARCHITECTURE.md
````markdown
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
````

## File: docs/build.md
````markdown
# Build Process

The build process for this package consists of two steps:

1. TypeScript Compilation (`tsc`)

   - Generates type definitions (`.d.ts` files)
   - Ensures type safety
   - Output directory: `dist/`

2. Bun Bundling
   - Bundles the JavaScript code
   - Optimizes for production
   - Output directory: `dist/`

## Commands

```bash
# Build the package
npm run build

# This will:
# 1. Run TypeScript compiler to generate types
# 2. Use Bun to create the optimized bundle
```

## Configuration

The TypeScript configuration in `tsconfig.json` is set up to:

- Generate declaration files (`declaration: true`)
- Use ES2018 as the target
- Enable strict type checking
- Output to the `dist/` directory
````

## File: docs/github-workflow.md
````markdown
# GitHub Workflow Documentation

## Release Workflow

The release workflow is configured to automatically create new releases and publish to NPM whenever changes are merged into the `main` branch.

### Workflow Trigger

- Triggered on push events to the `main` branch

### Steps

1. **Checkout Repository**

   - Uses `actions/checkout@v4`
   - Fetches complete git history for proper versioning

2. **Setup Node.js**

   - Uses Node.js 20.x
   - Configures NPM registry URL

3. **Build and Test**

   - Installs dependencies
   - Runs test suite
   - Builds the project

4. **Version Management**

   - Automatically determines next version based on commit messages
   - Creates a new git tag
   - Uses [github-tag-action](https://github.com/mathieudutour/github-tag-action)

5. **Release Creation**

   - Creates a GitHub release
   - Includes automatically generated changelog
   - Tags are based on semantic versioning

6. **NPM Publishing**
   - Updates package.json version
   - Publishes package to NPM registry

### Required Secrets

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `NPM_TOKEN`: Must be added to repository secrets for NPM publishing

### Version Bumping

The workflow uses conventional commits to determine version bumps:

- `fix:` or `fix(scope):` → patch bump
- `feat:` or `feat(scope):` → minor bump
- `BREAKING CHANGE:` in footer → major bump

### Example Commit Messages

```
feat: add new logger method
fix(core): resolve memory leak
feat!: redesign API (includes BREAKING CHANGE)
```
````

## File: docs/installation.md
````markdown
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
````

## File: docs/releases.md
````markdown
# Release Process

This project uses automated releases through GitHub Actions and a custom release script.

## Prerequisites

1. NPM account and token
2. GitHub repository access
3. Node.js installed

## Setting up NPM Token

1. Create an NPM token:

   - Go to npmjs.com
   - Access your account settings
   - Navigate to "Access Tokens"
   - Create a new token with "Publish" access

2. Add the token to GitHub repository secrets:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Create a new secret named `NPM_TOKEN`
   - Paste your NPM token as the value

## Creating a Release

1. Make sure your changes are committed and pushed to the main branch

2. Run the release script:

   ```bash
   ./scripts/release.sh
   ```

3. Select the release type:

   - `patch` (1): For bug fixes and minor changes
   - `minor` (2): For new features
   - `major` (3): For breaking changes

4. The script will:

   - Update the version in package.json
   - Create a git tag
   - Push changes and tag to GitHub

5. GitHub Actions will automatically:
   - Run tests
   - Build the project
   - Create a GitHub release
   - Publish to NPM

## Release Types

- **Patch** (1.0.0 -> 1.0.1): Bug fixes and minor changes
- **Minor** (1.0.0 -> 1.1.0): New features, backward compatible
- **Major** (1.0.0 -> 2.0.0): Breaking changes

## Troubleshooting

If the release fails:

1. Check GitHub Actions logs for errors
2. Verify NPM token is correctly set
3. Ensure all tests are passing
4. Check if version tag already exists
````

## File: docs/testing.md
````markdown
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
````

## File: docs/USAGE.md
````markdown
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
````

## File: examples/node-js/debug.ts
````typescript
import { LoggerStrategyType } from "../../src/types";

const TAG = 'DEBUG'

// Custom types example
export type CustomLogTags = 'custom_start' | 'custom_end';
export type CustomNetworkTags = 'GraphqlQuery_error_graphql' | 'RestApi_error' | 'api_call' | 'websocket';
export interface CustomUser {
	id: string;
	role: string;
	email?: string;
	name?: string;
	phone?: string;
	status?: string;
}
export interface CustomCheckout {
	currency?: string;
	value?: number;
	customField: string;
}
export interface CustomPurchase {
	type: 'credit_card';
	customStatus: string;
	affiliation?: string;
	coupon?: string;
	currency?: string;
}

type CustomEvent = {
	'app-open': Record<string, never>
	'user-login': { method: string }
	'user-register': { method: string }
	'add-to-cart': { product_id: string; quantity: number }
	'remove-from-cart': { product_id: string; quantity: number }
}

export class DebugInjector implements LoggerStrategyType<
	CustomLogTags,
	CustomNetworkTags,
	CustomUser,
	CustomCheckout,
	CustomPurchase,
	CustomEvent
> {
	init(): void {
		console.log(`${TAG}.init`)
	}

	info(feature: string, name: string, properties?: any): void {
		console.log(`${TAG}.info: `, feature, name, properties)
	}

	error(feature: string, name: string, critical = false, error: Error, extra: Record<string, unknown> = {}): void {
		console.error(`${TAG}.error: `, { critical, error, extra, feature, name })
	}

	log(name: CustomLogTags, properties?: Record<string, any> | undefined): void {
		if (properties) {
			console.log(`${TAG}.log: `, name, properties)
		} else {
			console.log(`${TAG}.log: `, name)
		}
	}

	event(name: string, properties?: Record<string, any> | undefined): void {
		if (properties) {
			console.log(`${TAG}.event: `, name, properties)
		} else {
			console.log(`${TAG}.event: `, name)
		}
	}

	network(name: CustomNetworkTags, properties?: Record<string, any>): void {
		if (properties) {
			console.log(`${TAG}.network: ${properties.operationName} | `, name, properties)
		} else {
			console.log(`${TAG}.network:`, name)
		}
	}

	logScreen(screenName: string): void {
		console.log(`${TAG}.logScreen: `, { screenName })
	}

	reset(): void {
		console.log(`${TAG}.reset`)
	}
	setUserId(userId: string): void {
		console.log(`${TAG}.setUserId: `, userId)
	}

	setUserProperty(name: string, value: any): void {
		console.log(`${TAG}.setUserProperty: `, name, value)
	}

	setUser(user: CustomUser): void {

		const userProperties = {
			colorScheme: 'light',
			email: user.email ?? '',
			id: user.id,
			name: user.name ?? '',
			phone: user.phone,
			status: user.status,
			username: user.phone,
		}

		console.log(`${TAG}.setUser: `, userProperties)

		this.setUserId(user.id)
	}

	setUserProperties(properties: CustomUser): void {
		console.log(`${TAG}.setUserProperties: `, properties)
	}

	getId(): string {
		return 'DebugInjector'
	}

	flush(): void {
		console.log(`${TAG}.flush`)
	}

	logBeginCheckout(checkoutId: string, properties: CustomCheckout): void {
		console.log(`${TAG}.logBeginCheckout: `, checkoutId, properties)
	}

	logPaymentSuccess(checkoutId: string, properties: CustomPurchase): void {
		console.log(`${TAG}.logPaymentSuccess: `, checkoutId, properties)
	}
}
````

## File: examples/node-js/index.ts
````typescript
import { LoggerStrategy } from '../../src';
import { DebugInjector } from './debug';
import type { CustomLogTags, CustomNetworkTags, CustomUser, CustomCheckout, CustomPurchase } from './debug';

// Initialize logger with debug injector
const logger = new LoggerStrategy<
  CustomLogTags,
  CustomNetworkTags,
  CustomUser,
  CustomCheckout,
  CustomPurchase
>([
  {
    class: new DebugInjector(),
    enabled: true,
  },
]);

// Initialize logger
logger.init();

// Log events
logger.event('app-open');

// Log user
logger.setUser({
  id: '123',
  role: 'user',
  name: 'John Doe',
  email: 'john@example.com'
});

// Log screen view
logger.logScreen('HomeScreen', { referrer: 'DeepLink' });

// Log error
try {
  throw new Error('Test error');
} catch (error) {
  logger.error(
    'Authentication',
    'login-failed',
    true,
    error as Error,
    { userId: '123' }
  );
}

// Log checkout
logger.logBeginCheckout('checkout-123', {
  currency: 'USD',
  value: 99.99,
  customField: 'test-checkout'
});

// Log payment
logger.logPaymentSuccess('checkout-123', {
  type: 'credit_card',
  customStatus: 'completed',
  currency: 'USD',
  affiliation: 'web-store',
  coupon: 'DISCOUNT10'
});

// Reset user
logger.reset();

// Flush logs
logger.flush();
````

## File: memory/activeContext.md
````markdown
# Active Context

## Current Focus
- Setting up the core logger interface
- Implementing Google Analytics strategy
- Establishing TypeScript types and interfaces

## Active Development
- Core logger implementation
- Strategy pattern implementation
- TypeScript type definitions

## Current Challenges
- Ensuring type safety across different logging strategies
- Maintaining performance with multiple loggers
- Handling async logging operations

## Immediate Tasks
1. Core logger interface implementation
2. Google Analytics strategy setup
3. Basic TypeScript types and interfaces
4. Initial testing framework setup

## Development Environment
- Using Bun for development
- TypeScript for type safety
- Jest for testing
- ESLint and Prettier for code quality
````

## File: memory/productContext.md
````markdown
# Product Context

## Purpose
Universal logger library that provides a unified interface for multiple logging strategies, making it easy to implement analytics and tracking in any JavaScript/TypeScript application.

## Target Users
- Frontend developers
- Backend developers
- Full-stack developers
- DevOps engineers

## Use Cases
1. Web Analytics
   - Page views
   - User interactions
   - Custom events

2. E-commerce Tracking
   - Purchase events
   - Cart actions
   - Product views

3. Error Monitoring
   - Error tracking
   - Exception handling
   - Performance monitoring

4. User Tracking
   - User identification
   - User properties
   - User sessions

## Integration Points
- Google Analytics
- Custom loggers
- Error tracking systems
- Network monitoring
````

## File: memory/progress.md
````markdown
# Project Progress

## Current Status

- Basic project structure set up
- Documentation initialized
- Memory bank created
- Initial package configuration completed
- GitHub Actions setup initialized
- Examples directory created
- Scripts directory added
- Distribution build configured

## Next Steps

1. Implement core logger interface
2. Add Google Analytics strategy
3. Add Mixpanel strategy
4. Add error tracking
5. Add network analytics
6. Add e-commerce tracking
7. Add screen tracking
8. Add user tracking
9. Add custom events
10. Add tests
11. Complete CI/CD setup

## Completed Tasks

- [x] Project initialization
- [x] Basic documentation
- [x] Memory bank setup
- [x] Package.json configuration
- [x] TypeScript configuration
- [x] ESLint setup
- [x] Project structure organization
- [x] GitHub repository setup
````

## File: memory/projectbrief.md
````markdown
# Universal Logger Project Brief

## Overview
A universal logging library that supports multiple logging strategies (Google Analytics and others) with TypeScript support.

## Goals
- Provide a unified logging interface
- Support multiple logging strategies
- Type-safe event tracking
- Performance optimized
- Easy integration

## Key Features
- Multiple logging strategies support
- User tracking
- E-commerce tracking
- Error tracking
- Network analytics
- Screen tracking
- Custom events
- TypeScript support
````

## File: memory/systemPatterns.md
````markdown
# System Patterns

## Design Patterns
1. Strategy Pattern
   - Used for implementing different logging strategies
   - Each logger implements a common interface
   - Easy to add new logging providers

2. Factory Pattern
   - Creates logger instances
   - Handles configuration and initialization

3. Observer Pattern
   - Event handling and propagation
   - Async event processing

4. Singleton Pattern
   - Single logger instance per application
   - Shared state management

## Code Organization
- src/
  - strategies/ (Different logging implementations)
  - interfaces/ (TypeScript interfaces)
  - utils/ (Helper functions)
  - types/ (TypeScript types)
  - constants/ (Shared constants)

## Testing Strategy
- Unit tests for each logger
- Integration tests for strategy combinations
- Performance benchmarks
- Type checking tests
````

## File: memory/techContext.md
````markdown
# Technical Context

## Development Environment

- TypeScript
- Node.js
- ESLint for code quality
- Jest for testing
- GitHub Actions for CI/CD
- NPM for package management

## Project Structure

- /src - Core source code
- /dist - Compiled output
- /docs - Documentation
- /examples - Usage examples
- /scripts - Build and utility scripts
- /memory - Project memory bank
- /coverage - Test coverage reports

## Build Configuration

- TypeScript compiler
- ESLint for linting
- Jest for testing
- NPM scripts for automation

## Dependencies

- Core development tools
- Testing frameworks
- Build tools
- Type definitions

## Stack

- TypeScript
- Bun for development and testing
- Jest for testing
- ESLint for code quality
- Prettier for code formatting

## Architecture

- Strategy Pattern for multiple loggers
- Factory Pattern for logger instantiation
- Observer Pattern for event handling
- Singleton Pattern for logger instance

## Build tools with Bun
````

## File: scripts/release.sh
````bash
#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")/.."

# Get the current version from package.json
current_version=$(node -p "require('./package.json').version")

# Determine release type
echo "Current version: $current_version"
echo "Select release type:"
echo "1) patch (bug fixes)"
echo "2) minor (new features)"
echo "3) major (breaking changes)"
read -p "Enter choice [1-3]: " choice

case $choice in
  1) release_type="patch";;
  2) release_type="minor";;
  3) release_type="major";;
  *) echo "Invalid choice" && exit 1;;
esac

# Update version
npm version $release_type

# Get the new version
new_version=$(node -p "require('./package.json').version")

# Push changes and tags
git push
git push origin v$new_version
````

## File: src/__tests__/bun.d.ts
````typescript
declare module 'bun:test' {
  export const test: (name: string, fn: () => void | Promise<void>) => void;
  export const describe: (name: string, fn: () => void) => void;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
  export const expect: (value: any) => {
    toBe: (expected: any) => void;
    toHaveBeenCalled: () => void;
    toHaveBeenCalledWith: (...args: any[]) => void;
    not: {
      toHaveBeenCalled: () => void;
    };
  };
  export const mock: {
    (fn: (...args: any[]) => any): {
      (...args: any[]): any;
      mockClear: () => void;
      mockReturnValue: (value: any) => any;
    };
  };
}
````

## File: src/__tests__/LoggerStrategy.test.ts
````typescript
import { test, expect, mock, beforeEach, afterEach, describe } from 'bun:test';
import { LoggerStrategy } from '../index';
import type { LoggerStrategyType, User, BeginCheckoutEvent, PurchaseLogEvent, EVENT_TAGS } from '../types';

class MockLoggerStrategy implements LoggerStrategyType<
  string,
  string,
  User,
  BeginCheckoutEvent,
  PurchaseLogEvent,
  EVENT_TAGS
> {
  init = mock(() => {});
  log = mock(() => {});
  event = mock(() => {});
  network = mock(() => {});
  info = mock(() => {});
  error = mock(() => {});
  reset = mock(() => {});
  logScreen = mock(() => {});
  setUserId = mock(() => {});
  setUserProperty = mock(() => {});
  setUser = mock(() => {});
  setUserProperties = mock(() => {});
  logBeginCheckout = mock(() => {});
  logPaymentSuccess = mock(() => {});
  flush = mock(() => {});
  getId = mock(() => 'mock-strategy');

  clearMocks() {
    this.init.mockClear();
    this.log.mockClear();
    this.event.mockClear();
    this.network.mockClear();
    this.info.mockClear();
    this.error.mockClear();
    this.reset.mockClear();
    this.logScreen.mockClear();
    this.setUserId.mockClear();
    this.setUserProperty.mockClear();
    this.setUser.mockClear();
    this.setUserProperties.mockClear();
    this.logBeginCheckout.mockClear();
    this.logPaymentSuccess.mockClear();
    this.flush.mockClear();
    this.getId.mockClear();
  }
}

describe('LoggerStrategy', () => {
  let mockStrategy: MockLoggerStrategy;
  let logger: LoggerStrategy;

  beforeEach(() => {
    mockStrategy = new MockLoggerStrategy();
    logger = new LoggerStrategy([
      { class: mockStrategy, enabled: true }
    ]);
  });

  afterEach(() => {
    mockStrategy.clearMocks();
  });

  test('should initialize correctly', () => {
    logger.init();
    expect(mockStrategy.init).toHaveBeenCalled();
    expect(mockStrategy.event).toHaveBeenCalledWith('app-open', undefined);
  });

  test('should get strategy by id', () => {
    expect(logger.getStrategy('mock-strategy')).toBe(mockStrategy);
  });

  test('should check if strategy exists', () => {
    expect(logger.hasStrategy('mock-strategy')).toBe(true);
    expect(logger.hasStrategy('non-existent')).toBe(false);
  });

  test('should log events', () => {
    const properties = { test: 'value' };
    logger.log('app_start', properties);
    expect(mockStrategy.log).toHaveBeenCalledWith('app_start', properties);
  });

  test('should handle custom events with typed properties', () => {
    const loginEvent: EVENT_TAGS['user-login'] = { method: 'email' };
    logger.event('user-login', loginEvent);
    expect(mockStrategy.event).toHaveBeenCalledWith('user-login', loginEvent);

    const cartEvent: EVENT_TAGS['add-to-cart'] = { product_id: '123', quantity: 1 };
    logger.event('add-to-cart', cartEvent);
    expect(mockStrategy.event).toHaveBeenCalledWith('add-to-cart', cartEvent);
  });

  test('should handle events without properties', () => {
    logger.event('app-open', {});
    expect(mockStrategy.event).toHaveBeenCalledWith('app-open', {});
  });

  test('should handle checkout events with correct types', () => {
    const checkoutEvent: EVENT_TAGS['begin-checkout'] = { total: 100, items: 2 };
    logger.event('begin-checkout', checkoutEvent);
    expect(mockStrategy.event).toHaveBeenCalledWith('begin-checkout', checkoutEvent);
  });

  test('should handle purchase events with correct types', () => {
    const purchaseEvent: EVENT_TAGS['purchase-complete'] = { order_id: '123', total: 100 };
    logger.event('purchase-complete', purchaseEvent);
    expect(mockStrategy.event).toHaveBeenCalledWith('purchase-complete', purchaseEvent);
  });

  test('should handle network events', () => {
    const properties = { url: 'test.com' };
    logger.network('RestApi_request', properties);
    expect(mockStrategy.network).toHaveBeenCalledWith('RestApi_request', properties);
  });

  test('should handle errors', () => {
    const error = new Error('Test error');
    const extra = { context: 'test' };
    logger.error('TestFeature', 'TestError', true, error, extra);
    expect(mockStrategy.error).toHaveBeenCalledWith('TestFeature', 'TestError', true, error, extra);
  });

  test('should handle user properties', () => {
    const user: User = { id: 'test-user', name: 'Test User' };
    logger.setUser(user);
    expect(mockStrategy.setUser).toHaveBeenCalledWith(user);
  });

  test('should validate user id when setting user', () => {
    const invalidUser = { name: 'Test User' } as User;
    logger.setUser(invalidUser);
    expect(mockStrategy.error).toHaveBeenCalled();
    expect(mockStrategy.setUser).not.toHaveBeenCalled();
  });

  test('should handle begin checkout', () => {
    const checkoutData: BeginCheckoutEvent = {
      currency: 'USD',
      value: 100
    };
    logger.logBeginCheckout('checkout-1', checkoutData);
    expect(mockStrategy.logBeginCheckout).toHaveBeenCalledWith('checkout-1', checkoutData);
  });

  test('should validate checkout id', () => {
    const checkoutData: BeginCheckoutEvent = {
      currency: 'USD',
      value: 100
    };
    logger.logBeginCheckout('', checkoutData);
    expect(mockStrategy.error).toHaveBeenCalled();
    expect(mockStrategy.logBeginCheckout).not.toHaveBeenCalled();
  });

  test('should handle payment success', () => {
    const paymentData: PurchaseLogEvent = {
      type: 'credit_card',
      currency: 'USD',
      value: 100
    };
    logger.logPaymentSuccess('checkout-1', paymentData);
    expect(mockStrategy.logPaymentSuccess).toHaveBeenCalledWith('checkout-1', paymentData);
  });

  test('should validate payment data', () => {
    const invalidPaymentData = { currency: 'USD' } as PurchaseLogEvent;
    logger.logPaymentSuccess('checkout-1', invalidPaymentData);
    expect(mockStrategy.error).toHaveBeenCalled();
    expect(mockStrategy.logPaymentSuccess).not.toHaveBeenCalled();
  });

  test('should handle screen logging', () => {
    const params = { id: 'test' };
    logger.logScreen('TestScreen', params);
    expect(mockStrategy.logScreen).toHaveBeenCalledWith('TestScreen', params);
  });

  test('should handle flush', () => {
    logger.flush();
    expect(mockStrategy.flush).toHaveBeenCalled();
  });
});
````

## File: src/__tests__/types.test.ts
````typescript
import { test, expect, describe } from 'bun:test';
import type { LOG_TAGS, EVENT_TAGS, NETWORK_ANALYTICS_TAGS, User, LogItem, CheckoutData, PaymentData, BeginCheckoutEvent, PurchaseLogEvent, Item } from '../types';

describe('Types', () => {
  test('should validate LOG_TAGS type', () => {
    const validTags: LOG_TAGS[] = [
      'app_start',
      'app_background',
      'app_foreground',
      'app_crash',
      'user_login',
      'user_logout',
      'view_item',
      'add_to_cart',
      'remove_from_cart',
      'begin_checkout',
      'purchase',
      'custom_tag' // string literal is valid
    ];
    
    // TypeScript will catch invalid types at compile time
    expect(validTags.length).toBe(12);
  });

  test('should validate EVENT_TAGS type', () => {
    const validEvents: {
      [K in keyof EVENT_TAGS]: EVENT_TAGS[K]
    } = {
      'app-open': {},
      'user-login': { method: 'email' },
      'user-register': { method: 'google' },
      'add-to-cart': { product_id: '123', quantity: 1 },
      'remove-from-cart': { product_id: '123', quantity: 1 },
      'begin-checkout': { total: 100, items: 2 },
      'purchase-complete': { order_id: '123', total: 100 }
    };

    expect(Object.keys(validEvents).length).toBe(7);
  });

  test('should validate NETWORK_ANALYTICS_TAGS type', () => {
    const validTags: NETWORK_ANALYTICS_TAGS[] = [
      'GraphqlQuery_error_graphql',
      'GraphqlQuery_info_graphql',
      'GraphqlQuery_request_graphql',
      'RestApi_error',
      'RestApi_info',
      'RestApi_request',
      'WebSocket_error',
      'WebSocket_info',
      'WebSocket_request'
    ];

    expect(validTags.length).toBe(9);
  });

  test('should validate User interface', () => {
    const validUser: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      phone: '1234567890',
      status: 'active',
      customField: 'value'
    };

    expect(validUser.id).toBeDefined();
    expect(typeof validUser.id).toBe('string');
  });

  test('should validate LogItem interface', () => {
    const validItem: LogItem = {
      item_id: '123',
      item_name: 'Test Item',
      price: 10.99,
      quantity: 1,
      customField: 'value'
    };

    expect(validItem.item_id).toBeDefined();
    expect(validItem.price).toBeDefined();
  });

  test('should validate CheckoutData interface', () => {
    const validCheckout: CheckoutData = {
      currency: 'USD',
      value: 100,
      items: [
        {
          item_id: '123',
          item_name: 'Test Item',
          price: 100,
          quantity: 1
        }
      ]
    };

    expect(validCheckout.currency).toBeDefined();
    expect(validCheckout.items.length).toBe(1);
  });

  test('should validate PaymentData interface', () => {
    const validPayment: PaymentData = {
      currency: 'USD',
      value: 100,
      items: [
        {
          item_id: '123',
          item_name: 'Test Item',
          price: 100,
          quantity: 1
        }
      ],
      transaction_id: '123',
      type: 'credit_card',
      tax: 10,
      shipping: 5
    };

    expect(validPayment.transaction_id).toBeDefined();
    expect(validPayment.type).toBeDefined();
  });

  test('should validate BeginCheckoutEvent interface', () => {
    const validEvent: BeginCheckoutEvent = {
      currency: 'USD',
      value: 100,
      coupon: 'TEST10',
      items: [
        {
          item_id: '123',
          item_name: 'Test Item',
          price: 100,
          quantity: 1
        }
      ]
    };

    expect(validEvent.currency).toBeDefined();
    expect(validEvent.items?.length).toBe(1);
  });

  test('should validate PurchaseLogEvent interface', () => {
    const validEvent: PurchaseLogEvent = {
      type: 'credit_card',
      currency: 'USD',
      value: 100,
      transaction_id: '123',
      affiliation: 'store',
      coupon: 'TEST10',
      shipping: 5,
      tax: 10,
      items: [
        {
          item_id: '123',
          item_name: 'Test Item',
          price: 100,
          quantity: 1
        }
      ]
    };

    expect(validEvent.type).toBe('credit_card');
    expect(validEvent.items?.length).toBe(1);
  });

  test('should validate Item interface', () => {
    const validItem: Item = {
      item_brand: 'Test Brand',
      item_id: '123',
      item_name: 'Test Item',
      item_category: 'Category 1',
      item_category2: 'Category 2',
      item_category3: 'Category 3',
      item_category4: 'Category 4',
      item_category5: 'Category 5',
      item_list_id: 'list-123',
      item_list_name: 'Featured Items',
      item_location_id: 'store-123',
      item_variant: 'Red',
      quantity: 1,
      price: 100
    };

    expect(validItem.item_id).toBeDefined();
    expect(validItem.item_name).toBeDefined();
  });
});
````

## File: src/index.ts
````typescript
import type {EVENT_TAGS, LOG_TAGS, NETWORK_ANALYTICS_TAGS, User, BeginCheckoutEvent, LoggerStrategyConstructor, LoggerStrategyType, PurchaseLogEvent } from './types'

export class LoggerStrategy<
  TLogTags extends string = LOG_TAGS,
  TNetworkTags extends string = NETWORK_ANALYTICS_TAGS,
  TUser extends { id: string } = User,
  TBeginCheckout extends { currency?: string; value?: number } = BeginCheckoutEvent,
  TPurchase extends { type: string } = PurchaseLogEvent,
  TEvent extends Record<string, any> = EVENT_TAGS
> {
  private readonly logStrategies: LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent>[]
  private readonly strategyMap: Map<string, LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent>>

  constructor(
    private readonly injectors: LoggerStrategyConstructor<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent>[]
  ) {
    this.logStrategies = injectors.filter(logger => logger.enabled).map(logger => logger.class)
    this.strategyMap = new Map(
      this.logStrategies
        .filter((strategy): strategy is LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent> & { getId: () => string } => 
          typeof strategy.getId === 'function'
        )
        .map(strategy => [strategy.getId(), strategy])
    )
  }

  getStrategy(id: string) {
    return this.strategyMap.get(id)
  }

  hasStrategy(id: string): boolean {
    return this.strategyMap.has(id)
  }

  init() {
    for (const strategy of this.logStrategies) {
      strategy.init?.()
    }
    this.event('app-open')
  }

  info(feature: string, name: string, properties?: Record<string, any> | string | boolean) {
    for (const strategy of this.logStrategies) {
      strategy.info?.(feature, name, properties)
    }
  }

  private executeStrategy<T>(
    methodName: string,
    callback: (strategy: LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase, TEvent>) => T
  ) {
    try {
      for (const strategy of this.logStrategies) {
        callback(strategy)
      }
    } catch (e) {
      this.error('LoggerStrategy', methodName, true, e)
    }
  }

  log(name: TLogTags, properties?: Record<string, any>) {
    this.executeStrategy('log', (strategy) => {
      strategy.log?.(name, properties)
    })
  }

  event<T extends keyof TEvent>(name: T, properties?: TEvent[T]) {
    this.executeStrategy('event', (strategy) => {
      strategy.event?.(name, properties)
    })
  }

  network(name: TNetworkTags, properties?: Record<string, any>) {
    this.executeStrategy('network', (strategy) => {
      strategy.network?.(name, properties)
    })
  }

  error(feature: string, name: string, critical: boolean, error: unknown, extra?: Record<string, unknown>) {
    for (const strategy of this.logStrategies) {
      strategy.error?.(feature, name, critical, error as Error, extra)
    }
  }

  logScreen(screenName: string, params?: Record<string, any>) {
    for (const strategy of this.logStrategies) {
      strategy.logScreen?.(screenName, params)
    }
  }

  reset() {
    for (const strategy of this.logStrategies) {
      strategy.reset?.()
    }
  }

  setUserId(userId: string) {
    for (const strategy of this.logStrategies) {
      strategy.setUserId?.(userId)
    }
  }

  setUser(properties: TUser) {
    if (!properties?.id) {
      this.error('LoggerStrategy', 'setUser', false, new Error('User ID is required'))
      return
    }

    this.executeStrategy('setUser', (strategy) => {
      strategy.setUser?.(properties)
    })
  }

  setUserProperties(properties: Record<string, any>) {
    if (!properties || Object.keys(properties).length === 0) {
      return
    }

    this.executeStrategy('setUserProperties', (strategy) => {
      strategy.setUserProperties?.(properties)
    })
  }

  setUserProperty(name: string, value: Record<string, any>) {
    for (const strategy of this.logStrategies) {
      strategy.setUserProperty?.(name, value)
    }
  }

  logBeginCheckout(checkoutId: string, params: TBeginCheckout) {
    if (!checkoutId) {
      this.error('LoggerStrategy', 'logBeginCheckout', false, new Error('Checkout ID is required'))
      return
    }

    this.executeStrategy('logBeginCheckout', (strategy) => {
      strategy.logBeginCheckout?.(checkoutId, params)
    })
  }

  logPaymentSuccess(checkoutId: string, params: TPurchase) {
    if (!checkoutId || !params?.type) {
      this.error('LoggerStrategy', 'logPaymentSuccess', false, new Error('Checkout ID and payment type are required'))
      return
    }

    this.executeStrategy('logPaymentSuccess', (strategy) => {
      strategy.logPaymentSuccess?.(checkoutId, params)
    })
  }

  flush() {
    for (const strategy of this.logStrategies) {
      strategy.flush?.()
    }
  }
}
````

## File: src/types.ts
````typescript
export type LOG_TAGS = 
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

export type EVENT_TAGS = {
  'app-open': Record<string, never>
  'user-login': { method: string }
  'user-register': { method: string }
  'add-to-cart': { product_id: string; quantity: number }
  'remove-from-cart': { product_id: string; quantity: number }
  'begin-checkout': { total: number; items: number }
  'purchase-complete': { order_id: string; total: number }
}

export type NETWORK_ANALYTICS_TAGS =
  | 'GraphqlQuery_error_graphql'
  | 'GraphqlQuery_info_graphql'
  | 'GraphqlQuery_request_graphql'
  | 'RestApi_error'
  | 'RestApi_info'
  | 'RestApi_request'
  | 'WebSocket_error'
  | 'WebSocket_info'
  | 'WebSocket_request';

export interface User {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  status?: string;
  [key: string]: any;
}

export interface LogItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

export interface CheckoutData {
  currency: string;
  value: number;
  items: LogItem[];
  [key: string]: any;
}

export interface PaymentData extends CheckoutData {
  tax?: number;
  shipping?: number;
  transaction_id: string;
  type: string;
}

export interface LoggerStrategyConstructor<
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



/* eslint-disable @typescript-eslint/member-ordering */
export abstract class LoggerStrategyType<
	TLogTags extends string = LOG_TAGS,
	TNetworkTags extends string = NETWORK_ANALYTICS_TAGS,
	TUser extends { id: string } = User,
	TBeginCheckout extends { currency?: string; value?: number } = BeginCheckoutEvent,
	TPurchase extends { type: string } = PurchaseLogEvent,
	TEvent extends Record<string, any> = EVENT_TAGS
> {
	abstract init(): void
	abstract log?(name: TLogTags, properties?: Record<string, any>): void
	abstract event?<T extends keyof TEvent>(name: T, properties?: TEvent[T]): void
	abstract network?(name: TNetworkTags, properties?: Record<string, any>): void

	abstract info?(feature: string, name: string, properties?: Record<string, any> | string | boolean): void
	abstract error?(feature: string, name: string, critical: boolean, error: Error, extra?: Record<string, unknown>): void

	abstract reset?(): void
	abstract logScreen?(screenName: string, params?: Record<string, any>): void

	abstract setUserId?(userId: string): void
	abstract setUserProperty?(name: string, value: Record<string, any>): void
	abstract setUser?(properties: TUser): void
	abstract setUserProperties?(properties: Record<string, any>): void

	abstract logBeginCheckout?(checkoutId: string, properties: TBeginCheckout): void
	abstract logPaymentSuccess?(checkoutId: string, properties: TPurchase): void

	abstract flush?(): void
	abstract getId?(): string
}

export interface PurchaseLogEvent {
	/**
	 * A product affiliation to designate a supplying company or brick and mortar store location
	 */
	affiliation?: string
	/**
	 * Coupon code for a purchasable item.
	 */
	coupon?: string
	/**
	 * Purchase currency in 3 letter [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) format. E.g. `USD`.
	 */
	currency?: string

	items?: Item[]
	/**
	 * Shipping cost.
	 */
	shipping?: number
	/**
	 * Tax amount.
	 */
	tax?: number
	/**
	 * A context-specific numeric value which is accumulated automatically for each event type. Values
	 * can include revenue, distance, time and points. When a value is set, the accompanying `currency`
	 * parameter should also be defined.
	 */
	value?: number
	/**
	 * A single ID for a ecommerce group transaction.
	 */
	transaction_id?: string

	type: 'credit_card'
}

export interface BeginCheckoutEvent {
	/**
	 * Purchase currency in 3 letter [ISO_4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) format. E.g. `USD`.
	 */
	//TODO if value is a param, so must currency: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.Event#public-static-final-string-add_to_wishlist
	currency?: string
	value?: number
	/**
	 * Coupon code for a purchasable item.
	 */
	coupon?: string

	items?: Item[]
}
export interface Item {
	/**
	 * The item's brand.
	 */
	item_brand?: string
	/**
	 * An item ID.
	 */
	item_id?: string
	/**
	 * An item name.
	 */
	item_name?: string
	/**
	 * First class item category.
	 */
	item_category?: string
	/**
	 * Second class item category.
	 */
	item_category2?: string
	/**
	 * Third class item category.
	 */
	item_category3?: string
	/**
	 * Fourth class item category.
	 */
	item_category4?: string
	/**
	 * Fifth class item category.
	 */
	item_category5?: string
	/**
	 * The ID of the list in which the item was presented to the user.
	 */
	item_list_id?: string
	/**
	 * The name of the list in which the item was presented to the user.
	 */
	item_list_name?: string
	/**
	 * The Google [Place ID](https://developers.google.com/places/place-id) that corresponds to the associated item (String). Alternatively, you can supply your own custom Location ID.
	 */
	item_location_id?: string
	/**
	 * The Item variant.
	 */
	item_variant?: string
	/**
	 * The Item quantity.
	 */
	quantity?: number
	/**
	 * The Item price.
	 * Note that firebase analytics will display this as an integer with trailing zeros, due to some firebase-internal conversion.
	 * See https://github.com/invertase/react-native-firebase/issues/4578#issuecomment-771703420 for more information
	 */
	price?: number
}
````

## File: .clinerules
````
# Cursor Rules for Universal Logger

## TypeScript Best Practices
- Use strict TypeScript configuration
- Always define return types for functions
- Use interfaces for object types
- Use enums for fixed sets of values
- Use type guards for runtime type checking
- Use generics when appropriate
- Document public APIs with JSDoc comments
- Use readonly for immutable properties
- Use const assertions for literal types
- Use union types instead of enums for simple cases

## Testing Guidelines
- Use Bun's built-in test runner
- Write descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Clean up after each test
- Test edge cases and error conditions
- Maintain high test coverage
- Use beforeEach and afterEach hooks
- Group related tests with describe blocks
- Test type validations

## Code Style
- Use prettier for code formatting
- Use ESLint for code quality
- Use meaningful variable names
- Keep functions small and focused
- Use early returns
- Avoid nested conditionals
- Use optional chaining and nullish coalescing
- Use async/await over promises
- Use template literals for string interpolation
- Use object destructuring

## Error Handling
- Use custom error classes
- Always include error context
- Log errors with appropriate severity
- Use try/catch blocks appropriately
- Validate function inputs
- Handle edge cases explicitly
- Use type-safe error handling
- Document error conditions
- Use error boundaries where appropriate
- Return Result types for operations that can fail

## Performance
- Use strategy caching
- Minimize memory allocations
- Use appropriate data structures
- Avoid unnecessary re-renders
- Use lazy loading where appropriate
- Optimize bundle size
- Use code splitting
- Profile performance bottlenecks
- Use web workers for heavy computations
- Implement request batching

## Documentation
- Document public APIs
- Include usage examples
- Document error conditions
- Keep documentation up to date
- Use markdown for documentation
- Include type information
- Document breaking changes
- Include troubleshooting guides
- Document performance considerations
- Include architecture diagrams
````

## File: .eslintrc.json
````json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": [
    "@typescript-eslint"
  ],
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_"
      }
    ]
  }
}
````

## File: .gitignore
````
# Cursor MCP
.cursor/mcp.json

# Dependencies
node_modules/

# Build
dist/
build/
lib/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test coverage
coverage/

# Temporary files
*.tmp
*.temp
````

## File: .npmignore
````
# Source
src/
examples/

# Tests
__tests__/
*.test.ts
*.spec.ts
coverage/

# Config files
tsconfig.json
.eslintrc
.prettierrc
jest.config.js

# Git files
.git/
.gitignore

# IDE files
.idea/
.vscode/

# Logs
*.log

# Environment variables
.env
.env.*

# Documentation source
docs/

# CI/CD
.github/
.travis.yml
.gitlab-ci.yml

# Misc
*.tgz
.DS_Store
````

## File: .repomixignore
````
# Add patterns to ignore here, one per line
# Example:
# *.log
# tmp/
````

## File: LICENSE
````
MIT License

Copyright (c) 2024 Movibe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
````

## File: package.json
````json
{
  "name": "@movibe/logger",
  "version": "1.1.0",
  "description": "A flexible and type-safe logging system for JavaScript/TypeScript applications",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc && bun build ./src/index.ts --outdir=dist",
    "test": "bun test",
    "lint": "eslint src --ext .ts",
    "prepare": "bun run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/movibe/logger.git"
  },
  "keywords": [
    "logger",
    "analytics",
    "typescript",
    "logging",
    "events"
  ],
  "author": "Movibe",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/movibe/logger/issues"
  },
  "homepage": "https://github.com/movibe/logger#readme",
  "devDependencies": {
    "@types/node": "^20.11.19",
    "@typescript-eslint/eslint-plugin": "^7.0.1",
    "@typescript-eslint/parser": "^7.0.1",
    "eslint": "^8.56.0",
    "typescript": "^5.3.3"
  },
  "publishConfig": {
    "access": "public"
  }
}
````

## File: README.md
````markdown
# @movibe/logger

A flexible and type-safe logging system for JavaScript/TypeScript applications, built with Bun.

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
````

## File: repomix.config.json
````json
{
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "parsableStyle": false,
    "fileSummary": true,
    "directoryStructure": true,
    "removeComments": false,
    "removeEmptyLines": false,
    "compress": false,
    "topFilesLength": 5,
    "showLineNumbers": false,
    "copyToClipboard": false
  },
  "include": [],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  },
  "security": {
    "enableSecurityCheck": true
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
````
