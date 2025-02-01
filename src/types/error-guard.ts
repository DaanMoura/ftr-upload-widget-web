export type ErrorGuard<T = unknown> = [Error | never, undefined] | [undefined, T]
