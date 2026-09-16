import * as Effect from "effect/Effect"
import { setTimeout } from "node:timers/promises"

// DOCS: https://effect.website/docs/v4/getting-started/running-effects

// 1. Synchronous runtime
{
    const program = Effect.sync(() => {
        console.log("Hello from Synchronous runtime!")
    })

    Effect.runSync(program)
}

// 2. Asynchronous runtime
{
    const program = Effect.promise(async () => {
        await setTimeout(500)
        console.log("Hello from Asynchronous runtime!")
    })

    await Effect.runPromise(program)
}
