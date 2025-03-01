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
