import styles from './WizardStepName.module.css'

interface WizardStepNameProps {
  name: string
  onChange: (value: string) => void
  onNext: () => void
  onCancel: () => void
}

export default function WizardStepName({ name, onChange, onNext, onCancel }: WizardStepNameProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNext()
  }

  return (
    <form className={styles.step} onSubmit={handleSubmit} noValidate>
      <div className={styles.stepLabel}>Étape 1 / 3</div>
      <h2 className={styles.stepTitle}>Comment s'appelle ce voyage ?</h2>
      <div className={styles.field}>
        <label htmlFor="wizard-name">Nom</label>
        <input
          id="wizard-name"
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          placeholder="Ex : Road trip Provence"
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className={styles.btnPrimary}>
          Suivant
        </button>
      </div>
    </form>
  )
}
