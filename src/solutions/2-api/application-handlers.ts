import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import { AlreadyRegistered, Registration, Workshop, WorkshopFull, WorkshopId } from "./domain.ts"
import { RegistrationRepository, WorkshopCatalog } from "./services.ts"
import {
    RegistrationRequest,
    RegistrationResponse,
    WorkshopDetailsResponse,
    WorkshopItem,
} from "./api-contracts.ts"
import * as Clock from "effect/Clock"

export const listWorkshops = Effect.gen(function* () {
    const workshopCatalog = yield* WorkshopCatalog
    const workshops = yield* workshopCatalog.loadAll
    return workshops.map(toWorkshopItem)
})

const toWorkshopItem = (x: Workshop) =>
    WorkshopItem.make({ id: x.id, title: x.title, startsAt: x.startsAt })

export const getWorkshop = (workshopId: WorkshopId) =>
    Effect.gen(function* () {
        const workshopCatalog = yield* WorkshopCatalog
        const registrationRepository = yield* RegistrationRepository
        const workshop = yield* workshopCatalog.loadById(workshopId)
        const registrationCount =
            yield* registrationRepository.countWorkshopRegistrations(workshopId)

        return WorkshopDetailsResponse.make({
            id: workshop.id,
            title: workshop.title,
            startsAt: workshop.startsAt,
            availableSeats: workshop.capacity - registrationCount,
        })
    })

export const register = (workshopId: WorkshopId, request: RegistrationRequest) =>
    Effect.gen(function* () {
        const workshopCatalog = yield* WorkshopCatalog
        const registrationRepository = yield* RegistrationRepository

        const workshop = yield* workshopCatalog.loadById(workshopId)
        const existingRegistration = yield* registrationRepository.findByWorkshopAndEmail(
            workshopId,
            request.email,
        )

        if (Option.isSome(existingRegistration)) {
            return yield* new AlreadyRegistered({ workshopId, email: request.email })
        }

        const registrationCount =
            yield* registrationRepository.countWorkshopRegistrations(workshopId)
        if (registrationCount >= workshop.capacity) {
            return yield* new WorkshopFull({ workshopId })
        }

        // NOTE: Effect provides some default services, like Clock (https://effect.website/docs/v4/requirements-management/default-services).
        //      This is particularly useful while testing (https://effect.website/docs/v4/testing/testclock)
        const clock = yield* Clock.Clock
        const now = new Date(yield* clock.currentTimeMillis)

        const registration = Registration.make({
            workshopId,
            name: request.name,
            email: request.email,
            registeredAt: now,
        })
        yield* registrationRepository.save(registration)

        return RegistrationResponse.make({
            workshopId: registration.workshopId,
            email: registration.email,
        })
    })
