export const workshopIds = {
    effectBasics: "effect-basics",
    httpApi: "http-api",
    effectAdvanced: "effect-advanced",
} as const

export const staticWorkshops = [
    {
        id: workshopIds.effectBasics,
        title: "Effect basics",
        startsAt: new Date("2026-09-21T09:00:00.000Z"),
        capacity: 2,
    },
    {
        id: workshopIds.httpApi,
        title: "Building a HTTP API",
        startsAt: new Date("2026-09-21T11:00:00.000Z"),
        capacity: 2,
    },
    {
        id: workshopIds.effectAdvanced,
        title: "Effect advanced",
        startsAt: new Date("2026-09-22T09:00:00.000Z"),
        capacity: 5,
    },
]
