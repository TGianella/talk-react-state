import type { ReactNode } from 'react'
import styles from './StatusBanner.module.css'

interface StatusBannerProps {
  children: ReactNode
  tone?: 'loading' | 'error'
  // compact = barre fine d'activité (refetch en arrière-plan), n'occupe pas tout l'espace
  compact?: boolean
  // présence du callback = bouton de fermeture affiché
  onClose?: () => void
}

export default function StatusBanner({ children, tone = 'loading', compact = false, onClose }: StatusBannerProps) {
  const className = [styles.banner, tone === 'error' ? styles.error : '', compact ? styles.compact : '']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={className} role="status">
      {children}
      {onClose ? (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fermer">
          ×
        </button>
      ) : null}
    </div>
  )
}
