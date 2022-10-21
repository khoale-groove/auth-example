import { SessionStrategy } from "@keystone-6/core/types"
import { statelessSessions } from "@keystone-6/core/session"
import jwt from "jsonwebtoken"
import { randomBytes } from "crypto"

const MAX_AGE = 60 * 60 * 8 // 8 hours, in seconds
const ALGORITHM = "HS256"
const SECRET = randomBytes(32)
  .toString("base64")
  .replace(/[^a-zA-Z0-9]/g, "")
  .slice(0, 32)

declare type CustomizeStatelessSessionsOptions = {
  secret: string
  /**
   * Specifies the number (in seconds) to be the value for the `Max-Age`
   * @default 60 * 60 * 8 // 8 hours
   */
  maxAge?: number
  /**
   * *Note* be careful when setting this to `true`, as compliant clients will
   * not send the cookie back to the server in the future if the browser does
   * not have an HTTPS connection.
   *
   * @default process.env.NODE_ENV === 'production'
   */
  secure?: boolean
}

export function customizeStatelessSessions<T>({
  secret,
  maxAge = MAX_AGE,
  secure = process.env.NODE_ENV === "production",
}: CustomizeStatelessSessionsOptions): SessionStrategy<T> {
  if (!secret) {
    throw new Error("You must specify a session secret to use sessions")
  }

  return {
    async get(args) {
      const { req } = args
      const token = req.headers.authorization?.replace("Bearer ", "")
      if (!token) return

      try {
        const data = jwt.verify(token, secret, { maxAge }) as T
        return data
      } catch (error) {
        return
      }
    },
    async end(args) {
      const { res } = args
      res.setHeader("Authorization", "")
    },
    async start(args) {
      const { data, res } = args

      try {
        const newToken = jwt.sign({ ...Object(data) }, secret, {
          algorithm: ALGORITHM,
          expiresIn: maxAge,
        })
        res.setHeader("Authorization", "Bearer " + newToken)
        return newToken
      } catch (error) {
        return ""
      }
    },
  }
}

export const session = customizeStatelessSessions({
  maxAge: MAX_AGE,
  secret: SECRET,
})
// export const session = statelessSessions({
//   maxAge: MAX_AGE,
//   secret: SECRET,
// })
