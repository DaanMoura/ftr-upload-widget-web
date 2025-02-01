export type ErrorGuard<T = unknown> = [Error | unknown, undefined] | [undefined, T]
