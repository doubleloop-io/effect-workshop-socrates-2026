import * as Effect from "effect/Effect"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as HttpServerResponse from "effect/unstable/http/HttpServerResponse"

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

export const WorkshopApiRouter = HttpRouter.addAll([
    HttpRouter.route("GET", "/health", healthRoute), // NOTE: keep this endpoint or the e2e tests will fail!
    HttpRouter.route("GET", "/", helloWorldRoute),
])
