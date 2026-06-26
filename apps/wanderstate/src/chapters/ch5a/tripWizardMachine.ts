import { setup, assign } from 'xstate'

export const tripWizardMachine = setup({
  types: {
    context: {} as {
      name: string
      destination: string
      budget: number
    },
    events: {} as
      | { type: 'OPEN' }
      | { type: 'CANCEL' }
      | { type: 'NEXT' }
      | { type: 'BACK' }
      | { type: 'SUBMIT' }
      | { type: 'SUCCESS' }
      | { type: 'FAILURE' }
      | { type: 'RETRY' }
      | { type: 'SET_NAME'; value: string }
      | { type: 'SET_DESTINATION'; value: string }
      | { type: 'SET_BUDGET'; value: number },
  },
  guards: {
    hasName: ({ context }) => context.name.trim().length > 0,
    hasDestination: ({ context }) => context.destination.trim().length > 0,
    hasBudget: ({ context }) => context.budget > 0,
  },
  actions: {
    setName: assign(({ event }) =>
      event.type === 'SET_NAME' ? { name: event.value } : {}
    ),
    setDestination: assign(({ event }) =>
      event.type === 'SET_DESTINATION' ? { destination: event.value } : {}
    ),
    setBudget: assign(({ event }) =>
      event.type === 'SET_BUDGET' ? { budget: event.value } : {}
    ),
    resetContext: assign(() => ({ name: '', destination: '', budget: 100 })),
  },
}).createMachine({
  id: 'tripWizard',
  initial: 'closed',
  context: { name: '', destination: '', budget: 100 },
  // CANCEL disponible depuis n'importe quel état sauf closed
  on: {
    CANCEL: { target: '.closed', actions: 'resetContext' },
  },
  states: {
    closed: {
      on: { OPEN: 'name' },
    },
    name: {
      on: {
        SET_NAME: { actions: 'setName' },
        NEXT: { target: 'destination', guard: 'hasName' },
      },
    },
    destination: {
      on: {
        SET_DESTINATION: { actions: 'setDestination' },
        NEXT: { target: 'budget', guard: 'hasDestination' },
        BACK: 'name',
      },
    },
    budget: {
      on: {
        SET_BUDGET: { actions: 'setBudget' },
        NEXT: { target: 'confirm', guard: 'hasBudget' },
        BACK: 'destination',
      },
    },
    confirm: {
      on: {
        SUBMIT: 'submitting',
        BACK: 'budget',
      },
    },
    submitting: {
      on: {
        SUCCESS: { target: 'closed', actions: 'resetContext' },
        FAILURE: 'error',
      },
    },
    error: {
      on: {
        RETRY: 'confirm',
      },
    },
  },
})

export type TripWizardEvent =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS' }
  | { type: 'FAILURE' }
  | { type: 'RETRY' }
  | { type: 'SET_NAME'; value: string }
  | { type: 'SET_DESTINATION'; value: string }
  | { type: 'SET_BUDGET'; value: number }
