import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  trips: defineTable({
    name: v.string(),
    destination: v.string(),
    budget: v.number(),
  }),
})
