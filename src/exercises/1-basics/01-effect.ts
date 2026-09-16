import * as Effect from "effect/Effect"

// DOCS: https://effect.website/docs/v4/getting-started/the-effect-type

// 1. What is an Effect?
/*
         ┌─── Represents the success type
         │        ┌─── Represents the error type
         │        │
         ▼        ▼
Effect<Success, Error>

You can think of Effect like the following function:

type Effect<Success, Error> = () => Success | Error
*/

// 2. How do you create an Effect?
{
    const success: Effect.Effect<number> = Effect.succeed(15)

    const error: Effect.Effect<never, string> = Effect.fail("Error!")
}

// 3. An effect program
{
    const divide = (a: number, b: number): Effect.Effect<number, Error> =>
        b === 0 ? Effect.fail(new Error("Cannot divide by zero")) : Effect.succeed(a / b)
}

// 4. Why my effect doesn't do anything?
{
    const program = Effect.succeed("Hello world!")

    console.log(program)
}
