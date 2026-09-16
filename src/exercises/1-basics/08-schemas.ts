import * as Schema from "effect/Schema"
import { reportSchema } from "./helpers.ts"

// 1. What is a Schema?
/* A module to define, validate and transform data in TypeScript.

      ┌─── Type of the decoded value
      │     ┌─── Type of the encoded value
      │     │
      │     │
      ▼     ▼
Schema<Decoded, Encoded>

--------------------------------------------------------------

decode/encode in other languages:

| Name                    | Language                         |
|-------------------------|----------------------------------|
| decode / encode         | Kotlin, Scala, TypeScript, Swift |
| deserialize / serialize | .NET, Java, Rust                 |
| unmarshal / marshal     | Go, Ruby                         |
| read / show             | Haskell                          |
| load / dump             | Python                           |
| parse / stringify       | JavaScript                       |

*/

// 2. Create a schema
const User = Schema.Struct({
    name: Schema.String,
    age: Schema.Finite,
})
type User = typeof User.Type
type UserEncoded = typeof User.Encoded

// 3. How do you validate a Schema?
{
    const decode = Schema.decodeUnknownResult(User)

    reportSchema("Decode valid user", decode({ name: "John", age: 30 }))
    reportSchema("Decode invalid user", decode({ name: "John" }))
}

// 4. Decoded and Encoded types can differ
{
    const User = Schema.Struct({
        name: Schema.String, // Decoded: string | Encoded: string
        createdOn: Schema.DateFromString, // Decoded: Date | Encoded: string
    })
    type User = typeof User.Type
    type UserEncoded = typeof User.Encoded

    const decode = Schema.decodeUnknownResult(User)

    reportSchema(
        "Decode user with createdOn",
        decode({ name: "John", createdOn: "2026-09-11T09:29:01.993Z" }),
    )
    reportSchema(
        "Decode user with invalid createdOn date",
        decode({ name: "John", createdOn: "not-a-date" }),
    )

    const encode = Schema.encodeResult(User)

    reportSchema(
        "Encode User",
        encode(User.make({ name: "John", createdOn: new Date("2026-09-11T09:29:01.993Z") })),
    )
}

// 5. How can I customize a Schema validation?
{
    const AccessToken = Schema.String.check(Schema.isStartsWith("wt_"))
    type AccessToken = typeof AccessToken.Type

    const decode = Schema.decodeUnknownResult(AccessToken)

    reportSchema("Decode valid access token", decode("wt_123456789"))
    reportSchema("Decode invalid access token", decode("gho_987654321"))
}

// 6. Use custom schemas
{
    const AccessToken = Schema.String.check(Schema.isStartsWith("wt_"))

    const User = Schema.Struct({
        name: Schema.String,
        createdOn: Schema.DateFromString,
        accessToken: AccessToken, // Same as Schema.*
    })
    type User = typeof User.Type
}

// BONUS 7. New type pattern with branded types
{
    const AccessToken = Schema.String.check(Schema.isStartsWith("wt_")).pipe(
        Schema.brand("AccessToken"),
    )
    type AccessToken = typeof AccessToken.Type

    // @ts-expect-error
    const token: AccessToken = "wt_1234" // You can't assign any string to AccessToken, but need to validate it first
}
