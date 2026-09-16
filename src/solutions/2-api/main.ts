import { createServer } from "node:http"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as Config from "effect/Config"
import * as Layer from "effect/Layer"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import { WorkshopApiRouter } from "./router.ts"
import { InMemoryRegistrationRepositoryLive, InMemoryWorkshopCatalogLive } from "./layers.ts"

const ServerLive = NodeHttpServer.layerConfig(() => createServer(), {
    port: Config.Port("PORT").pipe(Config.withDefault(3000)),
})

const MainLive = HttpRouter.serve(WorkshopApiRouter).pipe(
    Layer.provide(InMemoryWorkshopCatalogLive),
    Layer.provide(InMemoryRegistrationRepositoryLive),
    Layer.provide(ServerLive),
)

NodeRuntime.runMain(Layer.launch(MainLive))
