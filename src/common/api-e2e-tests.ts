// oxlint-disable effecttsgo/global-fetch, effecttsgo/new-promise
import { type ChildProcess, spawn } from "node:child_process"
import { once } from "node:events"
import { createServer } from "node:net"
import { setTimeout } from "node:timers/promises"
import { afterAll, beforeAll, describe, expect, test } from "vitest"
import { workshopIds } from "./static-workshops.ts"

export const testWorkshopApiContracts = (entrypoint: string) => {
    let api: ChildProcess | undefined
    let baseUrl: string
    let stderr = ""

    beforeAll(() => startApi())
    afterAll(() => stopApi())

    describe("GET /workshops", () => {
        test("all workshops", async () => {
            const response = await getWorkshops()

            expect(response.status).toEqual(200)
            const result = await response.json()
            expect(result).toEqual([
                {
                    id: workshopIds.effectBasics,
                    title: "Effect basics",
                    startsAt: "2026-09-21T09:00:00.000Z",
                },
                {
                    id: workshopIds.httpApi,
                    title: "Building a HTTP API",
                    startsAt: "2026-09-21T11:00:00.000Z",
                },
                {
                    id: workshopIds.effectAdvanced,
                    title: "Effect advanced",
                    startsAt: "2026-09-22T09:00:00.000Z",
                },
            ])
        })
    })

    describe("GET /workshops/:id", () => {
        test("workshop details", async () => {
            const response = await getWorkshop(workshopIds.effectBasics)

            expect(response.status).toEqual(200)
            const result = await response.json()
            expect(result).toEqual({
                id: workshopIds.effectBasics,
                title: "Effect basics",
                startsAt: "2026-09-21T09:00:00.000Z",
                availableSeats: 2,
            })
        })

        test("unknown workshop", async () => {
            const response = await getWorkshop("this-workshop-not-exists")

            expect(response.status).toEqual(404)
            const result = await response.json()
            expect(result).toEqual({ error: "NotFound" })
        })
    })

    describe("POST /workshops/:id/registrations", () => {
        test("invalid request", async () => {
            const response = await postRegistration(workshopIds.effectBasics, {
                name: "",
                email: "not-an-email",
            })

            expect(response.status).toEqual(400)
            const result = await response.json()
            expect(result).toEqual({ error: "InvalidRequest" })
        })

        test("unknown workshop", async () => {
            const response = await postRegistration("this-workshop-not-exists", {
                name: "John Doe",
                email: "john@example.com",
            })

            expect(response.status).toEqual(404)
            const result = await response.json()
            expect(result).toEqual({ error: "NotFound" })
        })

        test("successful registration", async () => {
            const response = await postRegistration(workshopIds.effectBasics, {
                name: "Jane Roe",
                email: "jane@example.com",
            })

            expect(response.status).toEqual(201)
            const result = await response.json()
            expect(result).toEqual({
                workshopId: workshopIds.effectBasics,
                email: "jane@example.com",
            })
        })

        test("already registered", async () => {
            const registration = { name: "John Doe", email: "john@example.com" }
            await postRegistration(workshopIds.effectBasics, registration)

            const response = await postRegistration(workshopIds.effectBasics, registration)

            expect(response.status).toEqual(409)
            const result = await response.json()
            expect(result).toEqual({ error: "AlreadyRegistered" })
        })

        test("workshop is full", async () => {
            await postRegistration(workshopIds.httpApi, {
                name: "John Doe",
                email: "john@example.com",
            })
            await postRegistration(workshopIds.httpApi, {
                name: "Jane Roe",
                email: "jane@example.com",
            })

            const response = await postRegistration(workshopIds.httpApi, {
                name: "Bob Smith",
                email: "bob@example.com",
            })

            expect(response.status).toEqual(409)
            const result = await response.json()
            expect(result).toEqual({ error: "WorkshopFull" })
        })
    })

    const getHealth = () => fetch(`${baseUrl}/health`)

    const getWorkshops = () => fetch(`${baseUrl}/workshops`)

    const getWorkshop = (workshopId: string) => fetch(`${baseUrl}/workshops/${workshopId}`)

    const postRegistration = (workshopId: string, body: unknown) =>
        fetch(`${baseUrl}/workshops/${workshopId}/registrations`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        })

    async function startApi() {
        const port = await availablePort()
        baseUrl = `http://127.0.0.1:${port}`
        api = spawn(process.execPath, [entrypoint], {
            cwd: process.cwd(),
            env: { ...process.env, PORT: String(port) },
            stdio: ["ignore", "ignore", "pipe"],
        })
        api.stderr?.setEncoding("utf8")
        api.stderr?.on("data", (chunk: string) => {
            stderr += chunk
        })

        await waitForApi()
    }

    async function stopApi() {
        if (api === undefined || api.exitCode !== null) return
        const exited = once(api, "exit")
        api.kill("SIGTERM")
        await exited
    }

    const availablePort = () =>
        new Promise<number>((resolve, reject) => {
            const server = createServer()
            server.once("error", reject)
            server.listen(0, "127.0.0.1", () => {
                const address = server.address()
                if (address === null || typeof address === "string") {
                    reject(new Error("Could not determine test server port"))
                    return
                }

                server.close((error) =>
                    error === undefined ? resolve(address.port) : reject(error),
                )
            })
        })

    const waitForApi = async () => {
        const deadline = Date.now() + 5_000

        while (Date.now() < deadline) {
            if (api?.exitCode !== null) {
                throw new Error(`API process exited during startup:\n${stderr}`)
            }

            try {
                const response = await getHealth()
                if (response.status === 200) return
            } catch {
                // The server is still starting
            }

            await setTimeout(50)
        }

        throw new Error(`API did not start within 5 seconds:\n${stderr}`)
    }
}
