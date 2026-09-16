import * as Schema from "effect/Schema"

// HINT: Try to use branded types to make this schema unique
export const Email = Schema.NonEmptyString.check(Schema.isPattern(/^\S+@\S+\.\S+$/))
export type Email = typeof Email.Type

// HINT: Try to use branded types to make this schema unique
export const WorkshopId = Schema.NonEmptyString
export type WorkshopId = typeof WorkshopId.Type

export const Workshop = Schema.Struct({
    id: WorkshopId,
    title: Schema.NonEmptyString,
    startsAt: Schema.Date,
    capacity: Schema.Int.check(Schema.isGreaterThan(0)),
}).annotate({ identifier: "Workshop" })

export type Workshop = typeof Workshop.Type

export const Registration = Schema.Struct({
    workshopId: WorkshopId,
    name: Schema.NonEmptyString,
    email: Email,
    registeredAt: Schema.Date,
}).annotate({ identifier: "Registration" })

export type Registration = typeof Registration.Type

export class WorkshopNotFound extends Schema.TaggedError<WorkshopNotFound>()("WorkshopNotFound", {
    workshopId: WorkshopId,
}) {}

export class WorkshopFull extends Schema.TaggedError<WorkshopFull>()("WorkshopFull", {
    workshopId: WorkshopId,
}) {}

export class AlreadyRegistered extends Schema.TaggedError<AlreadyRegistered>()(
    "AlreadyRegistered",
    {
        workshopId: WorkshopId,
        email: Email,
    },
) {}
