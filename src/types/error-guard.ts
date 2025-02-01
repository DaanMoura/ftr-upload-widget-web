export type ErrorGuard<T = unknown, E = Error> = [E, undefined] | [undefined, T]
