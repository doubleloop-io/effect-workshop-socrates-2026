import * as Schema from "effect/Schema"
import { Email, WorkshopId } from "./domain.ts"

// GET /workshops

export const WorkshopItem = Schema.Struct({
    id: WorkshopId,
    title: Schema.NonEmptyString,
    startsAt: Schema.DateFromString,
}).annotate({ identifier: "WorkshopItem" })

export type WorkshopItem = typeof WorkshopItem.Type

export const WorkshopsResponse = Schema.Array(WorkshopItem).annotate({
    identifier: "WorkshopsResponse",
})

export type WorkshopsResponse = typeof WorkshopsResponse.Type

// GET /workshops/:id

export const WorkshopDetailsResponse = Schema.Struct({
    id: WorkshopId,
    title: Schema.NonEmptyString,
    startsAt: Schema.DateFromString,
    availableSeats: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)),
}).annotate({ identifier: "WorkshopDetailsResponse" })

export type WorkshopDetailsResponse = typeof WorkshopDetailsResponse.Type

// POST /workshops/:id/registrations

export const RegistrationRequest = Schema.Struct({
    name: Schema.NonEmptyString,
    email: Email,
}).annotate({ identifier: "RegistrationRequest" })

export type RegistrationRequest = typeof RegistrationRequest.Type

export const RegistrationResponse = Schema.Struct({
    workshopId: WorkshopId,
    email: Email,
}).annotate({ identifier: "RegistrationResponse" })

export type RegistrationResponse = typeof RegistrationResponse.Type
