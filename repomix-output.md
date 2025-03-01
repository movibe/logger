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
docs/
  ARCHITECTURE.md
  USAGE.md
examples/
  node-js/
    basic.ts
    debug.ts
src/
  index.ts
  types.ts
.eslintrc.json
.gitignore
.npmignore
.repomixignore
jest.config.js
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

## File: docs/USAGE.md
````markdown
# Universal Logger Usage Guide

## Installation

```bash
npm install universal-logger
# or
yarn add universal-logger
```

## Basic Usage

```typescript
import { LoggerStrategy } from 'universal-logger';

// Initialize with your logging strategies
const logger = new LoggerStrategy([
  {
    class: GoogleAnalyticsLogger,
    enabled: true
  }
]);

// Initialize the logger
logger.init();

// Log events
logger.log('user_login', { method: 'email' });
logger.event('add-to-cart', { product_id: '123', quantity: 1 });

// Track user
logger.setUserId('user123');
logger.setUserProperties({
  plan: 'premium',
  country: 'BR'
});

// E-commerce tracking
logger.logBeginCheckout('checkout123', {
  currency: 'USD',
  value: 99.99,
  items: [{
    item_id: 'prod123',
    item_name: 'Premium Plan',
    price: 99.99,
    quantity: 1
  }]
});

// Network analytics
logger.network('RestApi_request', {
  endpoint: '/api/users',
  method: 'GET'
});
```

## Error Handling

The logger automatically handles errors in all operations:

```typescript
// This will not throw, but will log an error
logger.setUser({ /* missing id */ });

// Invalid events are caught and logged
logger.event('invalid-event', {});
```

## Custom Logging Strategy

Create your own logging strategy by extending `LoggerStrategyType`:

```typescript
class CustomLogger extends LoggerStrategyType {
  getId(): string {
    return 'custom-logger'
  }

  init(): void {
    console.log('Custom logger initialized')
  }

  log(name: string, properties?: Record<string, any>): void {
    console.log(`[${name}]`, properties)
  }

  // Implement other required methods...
}
```

## Type Safety

The logger is fully typed and will provide TypeScript errors for invalid usage:

```typescript
// TypeScript error: invalid event name
logger.event('invalid-event');

// TypeScript error: missing required property
logger.setUser({});

// TypeScript error: invalid property type
logger.logPaymentSuccess('checkout123', { type: 123 });
```
````

## File: examples/node-js/basic.ts
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

export class DebugInjector implements LoggerStrategyType<
	CustomLogTags,
	CustomNetworkTags,
	CustomUser,
	CustomCheckout,
	CustomPurchase
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

## File: src/index.ts
````typescript
import  type {EVENT_TAGS, LOG_TAGS, NETWORK_ANALYTICS_TAGS, User, BeginCheckoutEvent, LoggerStrategyConstructor, LoggerStrategyType, PurchaseLogEvent } from './types'

export class LoggerStrategy<
  TLogTags extends string = LOG_TAGS,
  TNetworkTags extends string = NETWORK_ANALYTICS_TAGS,
  TUser extends { id: string } = User,
  TBeginCheckout extends { currency?: string; value?: number } = BeginCheckoutEvent,
  TPurchase extends { type: string } = PurchaseLogEvent
> {
  private readonly logStrategies: LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase>[]
  private readonly strategyMap: Map<string, LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase>>

  constructor(
    private readonly injectors: LoggerStrategyConstructor<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase>[]
  ) {
    this.logStrategies = injectors.filter(logger => logger.enabled).map(logger => logger.class)
    this.strategyMap = new Map(
      this.logStrategies.map(strategy => [strategy.getId(), strategy])
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
    callback: (strategy: LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase>) => T
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

  event<T extends keyof EVENT_TAGS>(name: T, properties?: EVENT_TAGS[T]) {
    this.executeStrategy('event', (strategy) => {
      strategy.event?.(name.toLowerCase() as keyof EVENT_TAGS, properties)
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
  TPurchase extends { type: string } = PurchaseLogEvent
> {
  class: LoggerStrategyType<TLogTags, TNetworkTags, TUser, TBeginCheckout, TPurchase>;
  enabled: boolean;
}



/* eslint-disable @typescript-eslint/member-ordering */
export abstract class LoggerStrategyType<
	TLogTags extends string = LOG_TAGS,
	TNetworkTags extends string = NETWORK_ANALYTICS_TAGS,
	TUser extends { id: string } = User,
	TBeginCheckout extends { currency?: string; value?: number } = BeginCheckoutEvent,
	TPurchase extends { type: string } = PurchaseLogEvent
> {
	abstract init(): void
	abstract log(name: TLogTags, properties?: Record<string, any>): void
	abstract event(name: keyof EVENT_TAGS, properties?: EVENT_TAGS[keyof EVENT_TAGS]): void
	abstract network(name: TNetworkTags, properties?: Record<string, any>): void

	abstract info(feature: string, name: string, properties?: Record<string, any> | string | boolean): void
	abstract error(feature: string, name: string, critical: boolean, error: Error, extra?: Record<string, unknown>): void

	abstract reset(): void
	abstract logScreen(screenName: string, params?: Record<string, any>): void

	abstract setUserId(userId: string): void
	abstract setUserProperty(name: string, value: Record<string, any>): void
	abstract setUser(properties: TUser): void
	abstract setUserProperties(properties: Record<string, any>): void

	abstract logBeginCheckout(checkoutId: string, properties: TBeginCheckout): void
	abstract logPaymentSuccess(checkoutId: string, properties: TPurchase): void

	abstract flush(): void
	abstract getId(): string
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

## File: .eslintrc.json
````json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
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

## File: jest.config.js
````javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
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
  "version": "1.0.0",
  "description": "A flexible and type-safe logging system for JavaScript/TypeScript applications",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src --ext .ts",
    "prepare": "npm run build"
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
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.19",
    "@typescript-eslint/eslint-plugin": "^7.0.1",
    "@typescript-eslint/parser": "^7.0.1",
    "eslint": "^8.56.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.2",
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

A flexible and type-safe logging system for JavaScript/TypeScript applications.

## Installation

```bash
npm install @movibe/logger
# or
yarn add @movibe/logger
```

## Features

- 🎯 Type-safe logging with TypeScript
- 🔄 Multiple logging strategies support
- 📊 Built-in analytics events
- 🛍️ E-commerce tracking
- 🌐 Network analytics
- 🔒 Error handling and validation
- 🚀 High performance with strategy caching

## Quick Start

```typescript
import { LoggerStrategy } from '@movibe/logger';

const logger = new LoggerStrategy([
  {
    class: GoogleAnalyticsLogger,
    enabled: true
  }
]);

logger.init();
logger.log('user_login', { method: 'email' });
```

## Documentation

- [Usage Guide](docs/USAGE.md)
- [Architecture](docs/ARCHITECTURE.md)

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
