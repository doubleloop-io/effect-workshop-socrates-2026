import * as Result from "effect/Result"
import * as Match from "effect/Match"
import { pipe } from "effect/Function"
import * as Schema from "effect/Schema"
import * as Effect from "effect/Effect"

export const reportSchema = <A>(test: string, result: Result.Result<A, Schema.SchemaError>) => {
    const output = pipe(
        Match.value(result),
        Match.tag("Success", (x) => x.success),
        Match.tag("Failure", (error) => error.failure.message),
        Match.exhaustive,
    )

    console.log()
    console.log(`${test}:`, output)
}

export const runSync = <A, E>(effect: Effect.Effect<A, E>) => console.log(Effect.runSync(effect))
