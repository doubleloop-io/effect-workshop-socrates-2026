import * as Context from "effect/Context"
import * as Data from "effect/Data"
import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import { pipe } from "effect/Function"
import { runSync } from "./helpers.ts"

// DOCS: https://effect.website/docs/v4/requirements-management/layers

// 1. Domain models

type User = {
    id: string
    role: "admin" | "member"
}

class UserNotFound extends Data.TaggedError("UserNotFound")<{ id: string }> {}

type Permission = "users:read" | "users:write"

// 2. Services

type UserRepositoryService = {
    load: (id: string) => Effect.Effect<User, UserNotFound>
}
class UserRepository extends Context.Service<UserRepository, UserRepositoryService>()(
    "UserRepository",
) {}

type UserPermissionsService = {
    resolve: (user: User) => Permission[]
}
class UserPermissions extends Context.Service<UserPermissions, UserPermissionsService>()(
    "UserPermissions",
) {}

// 3. Service implementations

const inMemoryUserRepository = UserRepository.of({
    load: (id) =>
        id === "1"
            ? Effect.succeed({ id, name: "John Doe", role: "admin" })
            : Effect.fail(new UserNotFound({ id })),
})

const inMemoryUserPermissions = UserPermissions.of({
    resolve: (user) => (user.role === "admin" ? ["users:read", "users:write"] : ["users:read"]),
})

// 4. Using multiple services in a program

const program = Effect.gen(function* () {
    const userRepository = yield* UserRepository
    const userPermissions = yield* UserPermissions

    const user = yield* userRepository.load("1")

    return userPermissions.resolve(user)
})

// 5. Layers: an alternative way to provide service implementations

/*
        ┌─── The service to be created
        │                ┌─── The possible error
        │                │
        ▼                ▼
Layer<RequirementsOut, Error>
*/

const UserRepositoryLive = Layer.succeed(UserRepository, inMemoryUserRepository)

const UserPermissionsLive = Layer.succeed(UserPermissions, inMemoryUserPermissions)

// 6. How do you provide layers?
{
    const runnable = pipe(
        program,
        Effect.provide(UserRepositoryLive),
        Effect.provide(UserPermissionsLive),
    )

    runSync(runnable)
    // output: [ 'users:read', 'users:write' ]
}

// 7. Combine layers (instead of multiple provides)
{
    const AppLive = Layer.merge(UserRepositoryLive, UserPermissionsLive)

    const runnable = pipe(program, Effect.provide(AppLive))

    runSync(runnable)
    // output: [ 'users:read', 'users:write' ]
}
