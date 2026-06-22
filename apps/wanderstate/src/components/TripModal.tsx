import { useEffect, useRef } from 'react'
import { formatBudget } from '../utils/format'
import styles from './TripModal.module.css'
import type { Trip } from '../types'

interface TripModalProps {
  trip: Trip | null
  onClose: () => void
}

/** Génère une teinte HSL (0–360) depuis une chaîne */
function idToHue(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff
  }
  return Math.abs(hash) % 360
}

export default function TripModal({ trip, onClose }: TripModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (trip) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [trip])

  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    // Fermeture au clic sur le backdrop (la zone hors du contenu)
    if (e.target === dialogRef.current) onClose()
  }

  const hue = trip ? idToHue(trip.id) : 0

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={onClose}
      onClick={handleDialogClick}
    >
      {trip ? (
        <div className={styles.content}>
          <div
            className={styles.cover}
            style={{
              background: `linear-gradient(135deg, hsl(${hue} 60% 55%), hsl(${(hue + 60) % 360} 70% 40%))`,
            }}
          >
            <div className={styles.coverShape1} style={{ borderColor: `hsl(${(hue + 180) % 360} 80% 80%)` }} />
            <div className={styles.coverShape2} style={{ borderColor: `hsl(${(hue + 120) % 360} 80% 80%)` }} />
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Fermer"
              onClick={onClose}
            >
              ✕
            </button>

            <div className={styles.destination}>{trip.destination}</div>
            <h2 className={styles.name}>{trip.name}</h2>
            <div className={styles.budget}>{formatBudget(trip.budget)}</div>

            <button type="button" className={styles.ctaBtn} inert>
              + Ajouter une étape
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
