import * as Effect from "effect/Effect"
import * as Schema from "effect/Schema"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerRequest from "effect/unstable/http/HttpServerRequest"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"
import { getWorkshop, listWorkshops, register } from "./application-handlers.ts"
import {
    RegistrationRequest,
    RegistrationResponse,
    WorkshopDetailsResponse,
    WorkshopsResponse,
} from "./api-contracts.ts"
import { WorkshopId } from "./domain.ts"

const WorkshopIdPath = Schema.Struct({ id: WorkshopId })

const encodeWorkshops = HttpServerResponse.schemaJson(WorkshopsResponse)
const encodeWorkshop = HttpServerResponse.schemaJson(WorkshopDetailsResponse)
const encodeRegistration = HttpServerResponse.schemaJson(RegistrationResponse)

const badRequest = HttpServerResponse.json({ error: "InvalidRequest" }, { status: 400 })
const notFound = HttpServerResponse.json({ error: "NotFound" }, { status: 404 })
const conflict = (error: "WorkshopFull" | "AlreadyRegistered") =>
    HttpServerResponse.json({ error }, { status: 409 })
const internalServerError = HttpServerResponse.json(
    { error: "Internal server error" },
    { status: 500 },
)

const healthRoute = Effect.succeed(HttpServerResponse.empty({ status: 200 }))

const listWorkshopsRoute = Effect.gen(function* () {
    const workshops = yield* listWorkshops
    return yield* encodeWorkshops(workshops)
}).pipe(
    Effect.catchTags({
        HttpBodyError: () => internalServerError,
    }),
)

const getWorkshopRoute = Effect.gen(function* () {
    const { id } = yield* HttpRouter.schemaPathParams(WorkshopIdPath)
    const workshop = yield* getWorkshop(id)
    return yield* encodeWorkshop(workshop)
}).pipe(
    Effect.catchTags({
        SchemaError: () => badRequest,
        WorkshopNotFound: () => notFound,
        HttpBodyError: () => internalServerError,
    }),
)

const registerRoute = Effect.gen(function* () {
    const { id } = yield* HttpRouter.schemaPathParams(WorkshopIdPath)
    const request = yield* HttpServerRequest.schemaBodyJson(RegistrationRequest)
    const registration = yield* register(id, request)
    return yield* encodeRegistration(registration, { status: 201 })
}).pipe(
    Effect.catchTags({
        SchemaError: () => badRequest,
        HttpServerError: () => badRequest,
        WorkshopNotFound: () => notFound,
        WorkshopFull: () => conflict("WorkshopFull"),
        AlreadyRegistered: () => conflict("AlreadyRegistered"),
        HttpBodyError: () => internalServerError,
    }),
)

export const WorkshopApiRouter = HttpRouter.addAll([
    HttpRouter.route("GET", "/health", healthRoute),
    HttpRouter.route("GET", "/workshops", listWorkshopsRoute),
    HttpRouter.route("GET", "/workshops/:id", getWorkshopRoute),
    HttpRouter.route("POST", "/workshops/:id/registrations", registerRoute),
])
