import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"

// DOCS: https://effect.website/docs/v4/getting-started/using-generators
//      https://effect.website/docs/v4/getting-started/building-pipelines

type Todo = { isCompleted: boolean }

const notCompletedTodos = (allTodos: Todo[]) => allTodos.filter((x) => !x.isCompleted)

declare const loadTodos: () => Effect.Effect<Todo[]>

// 1. Effect with JavaScript Generators
{
    const program = Effect.gen(function* () {
        const allTodos = yield* loadTodos()
        const todos = notCompletedTodos(allTodos)

        console.log(todos)
        return todos
    })
}

declare const loadTodosPromise: () => Promise<Todo[]>

// 1.b It reminds of async/await!
{
    const program = async () => {
        const allTodos = await loadTodosPromise()
        const todos = notCompletedTodos(allTodos)

        console.log(todos)
        return todos
    }
}
// 2. Effect with pipelines
{
    const program = pipe(
        loadTodos(),
        Effect.map((allTodos) => notCompletedTodos(allTodos)),
        Effect.tap((todos) => Effect.sync(() => console.log(todos))), // NOTE: You can replace this with Effect.log(todos)
    )
}

// 2.b Effect with pipelines (pipe method)
{
    const program = loadTodos().pipe(
        Effect.map((allTodos) => notCompletedTodos(allTodos)),
        Effect.tap((todos) => Effect.sync(() => console.log(todos))), // NOTE: You can replace this with Effect.log(todos)
    )
}
