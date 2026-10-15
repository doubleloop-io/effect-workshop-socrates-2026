import { Context, Effect, Schema } from "effect"
import { WorkshopDto } from "./api-contracts.ts"

const Workshop = Schema.Struct({
    id: Schema.String,
    title: Schema.String,
    startsAt: Schema.Date,
})
type Workshop = typeof Workshop.Type

type WorkshopRepositoryService = {
    loadAll: () => Effect.Effect<Workshop[]>
}

export class WorkshopRepository extends Context.Service<
    WorkshopRepository,
    WorkshopRepositoryService
>()("WorkshopRepository") {}

export const workshops = () =>
    Effect.gen(function* () {
        const workshopRepository = yield* WorkshopRepository
        const workshops = yield* workshopRepository.loadAll()
        return workshops.map((x) =>
            WorkshopDto.make({
                id: x.id,
                title: x.title,
                startsAt: x.startsAt,
            }),
        )
    })
