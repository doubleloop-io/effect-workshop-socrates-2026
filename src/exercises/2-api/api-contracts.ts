import { Schema } from "effect"

export const WorkshopDto = Schema.Struct({
    id: Schema.String,
    title: Schema.String,
    startsAt: Schema.DateFromString,
})
export type WorkshopDto = typeof WorkshopDto.Type
export type WorkshopDtoEncoded = typeof WorkshopDto.Encoded

export const WorkshopsResponse = Schema.Array(WorkshopDto)
export type WorkshopsResponse = typeof WorkshopsResponse.Type
export type WorkshopsResponseEncoded = typeof WorkshopsResponse.Encoded
