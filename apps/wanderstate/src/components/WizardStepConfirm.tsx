import { formatBudget } from '../utils/format'
import styles from './WizardStepConfirm.module.css'

interface WizardStepConfirmProps {
  name: string
  destination: string
  budget: number
  isSubmitting: boolean
  hasError: boolean
  onSubmit: () => void
  onBack: () => void
  onCancel: () => void
  onRetry: () => void
}

export default function WizardStepConfirm({
  name,
  destination,
  budget,
  isSubmitting,
  hasError,
  onSubmit,
  onBack,
  onCancel,
  onRetry,
}: WizardStepConfirmProps) {
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>Tout est bon ?</h2>
      <dl className={styles.summary}>
        <dt>Nom</dt>
        <dd>{name}</dd>
        <dt>Destination</dt>
        <dd>{destination}</dd>
        <dt>Budget</dt>
        <dd>{formatBudget(budget)}</dd>
      </dl>
      {hasError ? (
        <div className={styles.errorBanner}>
          Une erreur est survenue. Vérifie ta connexion et réessaie.
        </div>
      ) : null}
      <div className={styles.actions}>
        {!isSubmitting && !hasError ? (
          <button type="button" className={styles.btnSecondary} onClick={onCancel}>
            Annuler
          </button>
        ) : null}
        {!isSubmitting && !hasError ? (
          <button type="button" className={styles.btnSecondary} onClick={onBack}>
            Retour
          </button>
        ) : null}
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={hasError ? onRetry : onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Création…' : hasError ? 'Réessayer' : 'Créer le voyage'}
        </button>
      </div>
    </div>
  )
}
