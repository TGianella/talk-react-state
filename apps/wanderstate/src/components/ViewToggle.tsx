import styles from './ViewToggle.module.css'

interface ViewToggleProps {
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className={styles.group}>
      <button
        type="button"
        className={`${styles.btn} ${view === 'grid' ? styles.btnActive : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Vue grille"
        aria-pressed={view === 'grid'}
      >
        ⊞
      </button>
      <button
        type="button"
        className={`${styles.btn} ${view === 'list' ? styles.btnActive : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="Vue liste"
        aria-pressed={view === 'list'}
      >
        ☰
      </button>
    </div>
  )
}
