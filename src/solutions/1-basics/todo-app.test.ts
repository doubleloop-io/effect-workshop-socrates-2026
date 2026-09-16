import { test } from "vitest"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import {
    expectFailureAndEqual,
    expectSuccessAndEqual,
    runEffect,
} from "../../common/test-helpers.ts"
import * as Layer from "effect/Layer"
import { completeTodo, createTodo, Todo, TodoNotFound, TodoRepository } from "./todo-app.ts"

test("create todo", async () => {
    const existingTodos: Todo[] = []

    const result = await pipe(
        createTodo("1234", "Buy milk"),
        Effect.provide(TodoRepositoryTest(existingTodos)),
        runEffect,
    )

    expectSuccessAndEqual(result, Todo.make({ id: "1234", title: "Buy milk", isCompleted: false }))
})

test("complete todo", async () => {
    const buyMilkId = "1234"
    const buyMilk = Todo.make({ id: buyMilkId, title: "Buy milk", isCompleted: false })
    const existingTodos = [buyMilk]

    const result = await pipe(
        completeTodo(buyMilkId),
        Effect.provide(TodoRepositoryTest(existingTodos)),
        runEffect,
    )

    expectSuccessAndEqual(result, Todo.make({ id: "1234", title: "Buy milk", isCompleted: true }))
})

test("missing todo", async () => {
    const todoId = "5678"
    const existingTodos = [Todo.make({ id: "1234", title: "Buy milk", isCompleted: false })]

    const result = await pipe(
        completeTodo(todoId),
        Effect.provide(TodoRepositoryTest(existingTodos)),
        runEffect,
    )

    expectFailureAndEqual(result, new TodoNotFound({ id: "5678" }))
})

const TodoRepositoryTest = (todos: Todo[]) =>
    Layer.sync(TodoRepository, () => {
        const db = new Map(todos.map((x) => [x.id, x]))

        return {
            load: (id) => {
                const value = db.get(id)
                if (!value) return Effect.fail(new TodoNotFound({ id }))
                return Effect.succeed(value)
            },
            save: (todo) =>
                Effect.sync(() => {
                    db.set(todo.id, todo)
                }),
        }
    })
