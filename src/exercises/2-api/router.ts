import * as Effect from "effect/Effect"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"
import { workshops } from "./handlers.ts"
import { WorkshopsResponse } from "./api-contracts.ts"

/* Effect HTTP server cheatsheet:

## How do extract path parameters from /<endpoint>/:id?

const EndpointPath = Schema.Struct({ id: Schema.String })

The in your handler:
const { id } = yield* HttpRouter.schemaPathParams(EndpointPath)

## How do you read the request body?

const Request = Schema.Struct({ name: Schema.String })

The in your handler:
const request = yield* HttpServerRequest.schemaBodyJson(RegistrationRequest)
*/

const healthRoute = Effect.succeed(HttpServerResponse.empty({ status: 200 }))

const helloWorldRoute = Effect.succeed(HttpServerResponse.text("Hello, world"))

const workshopEndpoint = Effect.gen(function* () {
    const response = yield* workshops()

    const encodeWorkshopsResponse = HttpServerResponse.schemaJson(WorkshopsResponse)

    return yield* encodeWorkshopsResponse(response)
})

export const WorkshopApiRouter = HttpRouter.addAll([
    HttpRouter.route("GET", "/health", healthRoute), // NOTE: keep this endpoint or the e2e tests will fail!
    HttpRouter.route("GET", "/", helloWorldRoute),
    HttpRouter.route("GET", "/workshops", workshopEndpoint),
])
