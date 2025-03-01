import { LoggerStrategy } from '../../src';
import { DebugInjector } from './debug';
import type { CustomLogTags, CustomNetworkTags, CustomUser, CustomCheckout, CustomPurchase, CustomEvent } from './debug';

// Initialize logger with debug injector
const logger = new LoggerStrategy<
  CustomLogTags,
  CustomNetworkTags,
  CustomUser,
  CustomCheckout,
  CustomPurchase,
  CustomEvent
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