import * as Context from "effect/Context"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { Email, type Registration, type Workshop, WorkshopId, WorkshopNotFound } from "./domain.ts"

type WorkshopCatalogService = {
    loadAll: Effect.Effect<ReadonlyArray<Workshop>>
    loadById: (workshopId: WorkshopId) => Effect.Effect<Workshop, WorkshopNotFound>
}
export class WorkshopCatalog extends Context.Service<WorkshopCatalog, WorkshopCatalogService>()(
    "WorkshopCatalog",
) {}

type RegistrationRepositoryService = {
    findByWorkshopAndEmail: (
        workshopId: WorkshopId,
        email: Email,
    ) => Effect.Effect<Option.Option<Registration>>
    countWorkshopRegistrations: (workshopId: WorkshopId) => Effect.Effect<number>
    save: (registration: Registration) => Effect.Effect<void>
}
export class RegistrationRepository extends Context.Service<
    RegistrationRepository,
    RegistrationRepositoryService
>()("RegistrationRepository") {}
