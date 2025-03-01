declare module 'bun:test' {
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect<T>(actual: T): {
    toBe(expected: T): void;
    toBeDefined(): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: any[]): void;
    not: {
      toHaveBeenCalled(): void;
      toBe(expected: T): void;
    };
    toContain(expected: any): void;
  };
  export function mock<T extends (...args: any[]) => any>(implementation?: T): jest.Mock<ReturnType<T>, Parameters<T>>;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function describe(name: string, fn: () => void): void;
} 