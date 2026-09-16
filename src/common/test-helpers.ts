import * as Effect from "effect/Effect"
import * as Result from "effect/Result"
import { pipe } from "effect/Function"
import * as Match from "effect/Match"
import { expect } from "vitest"

export const runEffect = <A, E>(effect: Effect.Effect<A, E>) =>
    pipe(effect, Effect.result, Effect.runPromise)

export const expectSuccessAndEqual = <A, E>(result: Result.Result<A, E>, expected: unknown) =>
    pipe(
        Match.value(result),
        Match.tag("Success", (x) => expect(x.success).toEqual(expected)),
        Match.tag("Failure", (x) => {
            throw new Error(`Expected Success, got Failure: ${JSON.stringify(x.failure, null, 2)}`)
        }),
        Match.exhaustive,
    )

export const expectFailureAndEqual = <A, E>(result: Result.Result<A, E>, expected: unknown) =>
    pipe(
        Match.value(result),
        Match.tag("Success", (x) => {
            throw new Error(`Expected Failure, got Success: ${JSON.stringify(x.success, null, 2)}`)
        }),
        Match.tag("Failure", (x) => expect(x.failure).toEqual(expected)),
        Match.exhaustive,
    )
