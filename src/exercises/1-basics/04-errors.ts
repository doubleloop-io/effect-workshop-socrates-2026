import * as Effect from "effect/Effect"
import * as Data from "effect/Data"

// DOCS: https://effect.website/docs/v4/error-management/expected-errors

// 1. Expected errors
{
    class ProductNotFound extends Data.TaggedError("ProductNotFound")<{ id: string }> {}

    const findProduct = (id: string): Effect.Effect<string, ProductNotFound> =>
        id === "1" ? Effect.succeed("Raspberry Pi 5") : Effect.fail(new ProductNotFound({ id }))

    Effect.runSync(findProduct("2"))
    /* output:
ProductNotFound
    at findProduct (file:///home/user/workshop-socrates-2026/src/exercises/1-basics/04-errors.ts:17:69)
    at file:///home/user/workshop-socrates-2026/src/exercises/1-basics/04-errors.ts:19:20
    at ModuleJob.run (node:internal/modules/esm/module_job:439:25)
    at async node:internal/modules/esm/loader:643:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  id: '2',
  _tag: 'ProductNotFound'
}
*/
}

// 2. Multiple errors
{
    class ProductNotFound extends Data.TaggedError("ProductNotFound")<{ id: string }> {}

    class InvalidProductId extends Data.TaggedError("InvalidProductId")<{ id: string }> {}

    const findProduct = (id: string): Effect.Effect<string, ProductNotFound | InvalidProductId> =>
        Effect.gen(function* () {
            if (id.length > 50) return yield* new InvalidProductId({ id })
            if (id !== "1") return yield* new ProductNotFound({ id })

            return "Raspberry Pi 5"
        })
}

// 3. Automatic error tracking
{
    class ProductNotFound extends Data.TaggedError("ProductNotFound")<{ id: string }> {}

    class InvalidProductId extends Data.TaggedError("InvalidProductId")<{ id: string }> {}

    const findProduct = (id: string) =>
        Effect.gen(function* () {
            if (id.length > 50) return yield* new InvalidProductId({ id })
            if (id !== "1") return yield* new ProductNotFound({ id })

            return "Raspberry Pi 5"
        })
}
