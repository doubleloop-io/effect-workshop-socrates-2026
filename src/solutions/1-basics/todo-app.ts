import * as Schema from "effect/Schema"
import * as Effect from "effect/Effect"
import * as Data from "effect/Data"
import * as Context from "effect/Context"

export const Todo = Schema.Struct({
    id: Schema.String,
    title: Schema.String,
    isCompleted: Schema.Boolean,
})
export type Todo = typeof Todo.Type

export class TodoNotFound extends Data.TaggedError("TodoNotFound")<{ id: string }> {}

type TodoRepositoryService = {
    load: (id: string) => Effect.Effect<Todo, TodoNotFound>
    save: (todo: Todo) => Effect.Effect<void>
}

export class TodoRepository extends Context.Service<TodoRepository, TodoRepositoryService>()(
    "TodoRepository",
) {}

export const createTodo = (id: string, title: string) =>
    Effect.gen(function* () {
        const repository = yield* TodoRepository
        const todo = Todo.make({ id, title, isCompleted: false })
        yield* repository.save(todo)
        return todo
    })

export const completeTodo = (id: string) =>
    Effect.gen(function* () {
        const repository = yield* TodoRepository
        const todo = yield* repository.load(id)

        const completedTodo = Todo.make({ ...todo, isCompleted: true })

        yield* repository.save(completedTodo)
        return completedTodo
    })
