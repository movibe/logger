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