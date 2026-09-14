# Effect in practice: building a type-safe, composable, and robust HTTP API in TypeScript

Effect brings concepts such as explicit error handling, dependency injection, schema-based validation, and functional composition to TypeScript.

In this workshop, we'll build a small HTTP API using Effect. After a brief introduction to the core concepts, we'll dive straight into the code: endpoints, request validation, error modeling, application services, and composition through layers.

The workshop is designed for TypeScript developers who want to understand hands-on, how Effect can help them build applications that are more robust, testable, and maintainable.

## Getting Started

Install Node.js >= 24 and `pnpm` v11 package manager.

Install dependencies:

```shell
pnpm install
```

Run linter:

```shell
pnpm run lint
```

Run typechecker:

```shell
pnpm run typecheck
# watch mode
pnpm run typecheck:w
```

Run exercise tests:

```shell
pnpm run test:exercises
# watch mode
pnpm run test:w:exercises
```
