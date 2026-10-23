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
        organizerEmail: "mario@example.com",
        createdAt: new Date("2026-06-03T14:12:00.000Z"),
    },
    {
        id: workshopIds.httpApi,
        title: "Building a HTTP API",
        startsAt: new Date("2026-09-21T11:00:00.000Z"),
        capacity: 2,
        organizerEmail: "carlo@example.com",
        createdAt: new Date("2026-06-10T08:45:00.000Z"),
    },
    {
        id: workshopIds.effectAdvanced,
        title: "Effect advanced",
        startsAt: new Date("2026-09-22T09:00:00.000Z"),
        capacity: 5,
        organizerEmail: "mario@example.com",
        createdAt: new Date("2026-07-01T16:30:00.000Z"),
    },
]
