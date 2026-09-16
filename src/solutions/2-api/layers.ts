import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as Option from "effect/Option"
import { staticWorkshops } from "../../common/static-workshops.ts"
import { type Registration, WorkshopNotFound } from "./domain.ts"
import { RegistrationRepository, WorkshopCatalog } from "./services.ts"

export const InMemoryWorkshopCatalogLive = Layer.succeed(WorkshopCatalog, {
    loadAll: Effect.succeed(staticWorkshops),
    loadById: (workshopId) =>
        Effect.suspend(() => {
            const workshop = staticWorkshops.find((candidate) => candidate.id === workshopId)
            return workshop === undefined
                ? Effect.fail(new WorkshopNotFound({ workshopId }))
                : Effect.succeed(workshop)
        }),
})

export const InMemoryRegistrationRepositoryLive = Layer.effect(
    RegistrationRepository,
    Effect.sync(() => {
        const registrations: Array<Registration> = []

        return {
            findByWorkshopAndEmail: (workshopId, email) =>
                Effect.sync(() =>
                    Option.fromNullishOr(
                        registrations.find(
                            (item) => item.workshopId === workshopId && item.email === email,
                        ),
                    ),
                ),
            countWorkshopRegistrations: (workshopId) =>
                Effect.sync(
                    () => registrations.filter((item) => item.workshopId === workshopId).length,
                ),
            save: (registration) =>
                Effect.sync(() => {
                    registrations.push(registration)
                }),
        }
    }),
)
