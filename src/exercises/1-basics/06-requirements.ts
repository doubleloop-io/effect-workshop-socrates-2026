import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Data from "effect/Data"
import { pipe } from "effect/Function"

// DOCS: https://effect.website/docs/v4/requirements-management/services

// 1. What is an Effect (part 2)?
/*
         ┌─── Represents the success type
         │        ┌─── Represents the error type
         │        │      ┌─── Represents required dependencies
         ▼        ▼      ▼
Effect<Success, Error, Requirements>
*/

// 2. What is a Service?

export class UserNotFound extends Data.TaggedError("UserNotFound")<{ id: string }> {}

type UserRepositoryService = {
    load: (id: string) => Effect.Effect<string, UserNotFound>
}

// 3. How do you create a Service?

export class UserRepository extends Context.Service<UserRepository, UserRepositoryService>()(
    "UserRepository",
) {}

// 4. How do you implement a Service?

const inMemoryUserRepository = UserRepository.of({ load: (id) => Effect.succeed(id) })

// 5. How do you use a Service?

const program = Effect.gen(function* () {
    const userRepository = yield* UserRepository

    const user = yield* userRepository.load("1")

    console.log(`User is ${user}`)
})

// 6. I can't run my program anymore...
{
    // @ts-expect-error
    Effect.runSync(program)
}

// 7. How do you provide a Service implementation?
{
    const runnable = pipe(program, Effect.provideService(UserRepository, inMemoryUserRepository))

    Effect.runSync(runnable)
}
