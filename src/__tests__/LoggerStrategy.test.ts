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