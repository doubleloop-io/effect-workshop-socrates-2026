import { WorkshopRepository } from "./handlers.ts"
import { Effect, Layer } from "effect"
import { staticWorkshops } from "../../common/static-workshops.ts"

export const InMemoryWorkshopRepositoryLive = Layer.succeed(WorkshopRepository, {
    loadAll: () => Effect.succeed(staticWorkshops),
})
