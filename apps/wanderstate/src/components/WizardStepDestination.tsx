import DropdownSelect from './DropdownSelect'
import styles from './WizardStepDestination.module.css'

const DESTINATIONS = [
  'Collonges-la-Rouge',
  'Cordes-sur-Ciel',
  'Eguisheim',
  'Entrevaux',
  'Gordes',
  'Hunspach',
  'Les Baux-de-Provence',
  'Locronan',
  'Pérouges',
  'Rochefort-en-Terre',
  'Saint-Cirq-Lapopie',
  'Sophia Antipolis',
  'Vézelay',
]

interface WizardStepDestinationProps {
  destination: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  onCancel: () => void
}

export default function WizardStepDestination({
  destination,
  onChange,
  onNext,
  onBack,
  onCancel,
}: WizardStepDestinationProps) {
  return (
    <div className={styles.step}>
      <div className={styles.stepLabel}>Étape 2 / 3</div>
      <h2 className={styles.stepTitle}>Où part-on ?</h2>
      <div className={styles.field}>
        <label htmlFor="wizard-destination">Destination</label>
        <DropdownSelect
          id="wizard-destination"
          options={DESTINATIONS}
          value={destination}
          onChange={onChange}
          placeholder="Choisir une destination…"
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
