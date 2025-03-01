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

  test('should validate optional fields in User interface', () => {
    const minimalUser: User = {
      id: '123'
    };

    const fullUser: User = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      phone: '1234567890',
      status: 'active',
      customField: 'value',
      address: {
        street: 'Test St',
        city: 'Test City'
      }
    };

    expect(minimalUser.id).toBeDefined();
    expect(fullUser.address?.street).toBeDefined();
  });

  test('should validate nested objects in LogItem', () => {
    const itemWithMetadata: LogItem = {
      item_id: '123',
      item_name: 'Test Item',
      price: 10.99,
      quantity: 1,
      metadata: {
        color: 'red',
        size: 'M'
      }
    };

    expect(itemWithMetadata.metadata).toBeDefined();
  });

  test('should validate array fields in CheckoutData', () => {
    const checkoutWithMultipleItems: CheckoutData = {
      currency: 'USD',
      value: 200,
      items: [
        {
          item_id: '123',
          item_name: 'Item 1',
          price: 100,
          quantity: 1
        },
        {
          item_id: '456',
          item_name: 'Item 2',
          price: 100,
          quantity: 1
        }
      ],
      metadata: {
        source: 'web'
      }
    };

    expect(checkoutWithMultipleItems.items.length).toBe(2);
    expect(checkoutWithMultipleItems.metadata).toBeDefined();
  });

  test('should validate all payment types in PaymentData', () => {
    const paymentTypes: PaymentData['type'][] = [
      'credit_card',
      'debit_card',
      'pix',
      'bank_slip',
      'bank_transfer'
    ];

    const payments = paymentTypes.map(type => ({
      currency: 'USD',
      value: 100,
      transaction_id: '123',
      type,
      items: [{
        item_id: '123',
        item_name: 'Test Item',
        price: 100,
        quantity: 1
      }]
    }));

    payments.forEach(payment => {
      expect(paymentTypes).toContain(payment.type);
    });
  });

  test('should validate optional fields in BeginCheckoutEvent', () => {
    const minimalCheckout: BeginCheckoutEvent = {
      currency: 'USD',
      value: 100
    };

    const fullCheckout: BeginCheckoutEvent = {
      currency: 'USD',
      value: 100,
      coupon: 'TEST10',
      items: [{
        item_id: '123',
        item_name: 'Test Item',
        price: 100,
        quantity: 1
      }]
    };

    expect(minimalCheckout.currency).toBeDefined();
    expect(fullCheckout.items).toBeDefined();
  });

  test('should validate all required fields in PurchaseLogEvent', () => {
    const requiredFields: (keyof PurchaseLogEvent)[] = ['type', 'currency', 'value'];
    
    const purchase: PurchaseLogEvent = {
      type: 'credit_card',
      currency: 'USD',
      value: 100
    };

    requiredFields.forEach(field => {
      expect(purchase[field]).toBeDefined();
    });
  });
}); 