import { useState } from 'react'
import { useMachine } from '@xstate/react'
import { createBrowserInspector } from '@statelyai/inspect'
import { tripWizardMachine } from './tripWizardMachine'
import Layout from '../../Layout'
import LayoutHeader from '../../components/LayoutHeader'
import LayoutBody from '../../components/LayoutBody'
import TripList from '../../components/TripList'
import WizardModal from '../../components/WizardModal'
import type { Trip } from '../../types'
import type { TripWizardEvent } from './tripWizardMachine'

const inspector = createBrowserInspector({ autoStart: false })

export function Ch5aApp() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [snapshot, send] = useMachine(tripWizardMachine, { inspect: inspector.inspect })

  function toggleInspector() {
    if (inspectorOpen) {
      inspector.stop()
      setInspectorOpen(false)
    } else {
      inspector.start()
      setInspectorOpen(true)
    }
  }

  function handleSubmit() {
    // Capturer le contexte avant d'envoyer SUBMIT (snapshot sera périmé dans le setTimeout)
    const { name, destination, budget } = snapshot.context
    send({ type: 'SUBMIT' })
    setTimeout(() => {
      setTrips((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name,
          destination,
          budget,
        },
      ])
      send({ type: 'SUCCESS' })
    }, 800)
  }

  // Intercepter SUBMIT pour déclencher la logique asynchrone
  function sendWithSubmit(event: { type: string; [key: string]: unknown }) {
    if (event.type === 'SUBMIT') {
      handleSubmit()
    } else {
      send(event as TripWizardEvent)
    }
  }

  return (
    <Layout>
      <LayoutHeader chapter="Ch. 5a · XState" />
      <LayoutBody>
        <section style={{
          padding: '28px 32px',
          borderBottom: '3px solid var(--color-primary)',
        }}>
          <button
            type="button"
            onClick={() => send({ type: 'OPEN' })}
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
              padding: '14px 32px',
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: '3px 3px 0 var(--color-primary)',
            }}
          >
            + Nouveau voyage
          </button>
        </section>
        <TripList trips={trips} />
      </LayoutBody>

      <WizardModal snapshot={snapshot} send={sendWithSubmit} />

      <button
        type="button"
        onClick={toggleInspector}
        title={inspectorOpen ? "Fermer l'Inspector" : "Ouvrir l'Inspector"}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '48px',
          height: '48px',
          background: inspectorOpen ? 'var(--color-primary)' : 'var(--color-surface)',
          color: inspectorOpen ? 'var(--color-surface)' : 'var(--color-primary)',
          border: '2px solid var(--color-primary)',
          fontFamily: 'inherit',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '3px 3px 0 var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ⚙
      </button>
    </Layout>
  )
}
