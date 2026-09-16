import * as Data from "effect/Data"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import { runSync } from "./helpers.ts"

// DOCS: https://effect.website/docs/v4/error-management/expected-errors#catching-selected-errors

// 1. Recover from typed errors with catchTag

type AppConfig = { port: number; logLevel: string }

const appConfig = (config: AppConfig): AppConfig => config

class ConfigFileNotFound extends Data.TaggedError("ConfigFileNotFound")<{ path: string }> {}

class InvalidConfigFile extends Data.TaggedError("InvalidConfigFile")<{ path: string }> {}

const readConfig = (path: string) =>
    Effect.gen(function* () {
        if (path === "broken.json") return yield* new InvalidConfigFile({ path })
        if (path === "missing.json") return yield* new ConfigFileNotFound({ path })

        return appConfig({ port: 8080, logLevel: "debug" })
    })

const defaultAppConfig = appConfig({ port: 3000, logLevel: "info" })

const loadConfig = (path: string) =>
    pipe(
        readConfig(path),
        Effect.catchTag("ConfigFileNotFound", () => Effect.succeed(defaultAppConfig)),
        // NOTE:        ^^^ this is the type-safe error tag string
    )

runSync(loadConfig("app.json"))
// output: { port: 8080, logLevel: 'debug' }

runSync(loadConfig("missing.json"))
// output: { port: 3000, logLevel: 'info' }

runSync(loadConfig("broken.json"))
// output: InvalidConfigFile
