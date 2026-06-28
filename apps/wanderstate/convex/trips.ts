import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async (ctx) => {
    return ctx.db.query('trips').collect()
  },
})

export const create = mutation({
  args: {
    name: v.string(),
    destination: v.string(),
    budget: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('trips', args)
  },
})

export const remove = mutation({
  args: {
    id: v.id('trips'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
