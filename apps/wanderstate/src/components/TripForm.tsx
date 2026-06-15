import { useState } from 'react'
import type { Trip } from '../types'
import styles from './TripForm.module.css'

export interface TripFormProps {
  onAddTrip: (trip: Trip) => void
}

const INITIAL_BUDGET = 500

export default function TripForm({ onAddTrip }: TripFormProps) {
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [budget, setBudget] = useState(INITIAL_BUDGET)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): Record<string, string> {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Nom requis'
    if (!destination.trim()) next.destination = 'Destination requise'
    if (budget === 0) next.budget = 'Budget requis'
    return next
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    onAddTrip({
      id: crypto.randomUUID(),
      name: name.trim(),
      destination: destination.trim(),
      budget,
    })
    setName('')
    setDestination('')
    setBudget(INITIAL_BUDGET)
    setErrors({})
  }

  return (
    <section className={styles.formSection}>
      <div className={styles.sectionTitle}>Nouveau voyage</div>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label htmlFor="trip-name">Nom du voyage</label>
            <input
              id="trip-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className={styles.fieldError}>{errors.name ? errors.name : '\u00a0'}</span>
          </div>
          <div className={styles.field}>
            <label htmlFor="trip-destination">Destination</label>
            <input
              id="trip-destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <span className={styles.fieldError}>{errors.destination ? errors.destination : '\u00a0'}</span>
          </div>
        </div>

        <div className={styles.budgetRow}>
          <div className={styles.budgetLabelCol}>
            <label htmlFor="trip-budget">Budget</label>
            <div className={styles.budgetValue}>
              {budget.toLocaleString('fr-FR')} <span>€</span>
            </div>
          </div>
          <input
            id="trip-budget"
            type="range"
            min={0}
            max={10000}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
          <span className={styles.fieldError}>{errors.budget ? errors.budget : '\u00a0'}</span>
        </div>

        <button type="submit" className={styles.btnSubmit}>
          Créer le voyage
        </button>
      </form>
    </section>
  )
}
