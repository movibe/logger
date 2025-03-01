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
