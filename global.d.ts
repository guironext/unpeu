export {}

export type AppRoles = "admin" | "commercial" | "dealer" | "visitor"

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: AppRoles
      userId?: string
    }
  }
}