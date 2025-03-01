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
