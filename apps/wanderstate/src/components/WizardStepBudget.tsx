import styles from './WizardStepBudget.module.css'

interface WizardStepBudgetProps {
  budget: number
  onChange: (value: number) => void
  onNext: () => void
  onBack: () => void
  onCancel: () => void
}

export default function WizardStepBudget({
  budget,
  onChange,
  onNext,
  onBack,
  onCancel,
}: WizardStepBudgetProps) {
  return (
    <div className={styles.step}>
      <div className={styles.stepLabel}>Étape 3 / 3</div>
      <h2 className={styles.stepTitle}>Combien on se donne ?</h2>
      <div className={styles.budgetRow}>
        <div className={styles.budgetLabelCol}>
          <label htmlFor="wizard-budget">Budget</label>
          <div className={styles.budgetValue}>
            {budget.toLocaleString('fr-FR')}
            <span>€</span>
          </div>
        </div>
        <input
          id="wizard-budget"
          type="range"
          min={100}
          max={10000}
          step={100}
          value={budget}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={onCancel}>
          Annuler
        </button>
        <button type="button" className={styles.btnSecondary} onClick={onBack}>
          Retour
        </button>
        <button type="button" className={styles.btnPrimary} onClick={onNext}>
          Suivant
        </button>
      </div>
    </div>
  )
}
