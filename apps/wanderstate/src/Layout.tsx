import type { ComponentType, ReactNode } from 'react'
import type { Trip } from './types'
import type { TripFormProps } from './components/TripForm'
import TripFormDefault from './components/TripForm'
import TripList from './components/TripList'
import styles from './Layout.module.css'

interface LayoutProps {
  trips: Trip[]
  onAddTrip: (trip: Trip) => void
  badge: string
  subtitle: string
  TripFormOverride?: ComponentType<TripFormProps>
  children?: ReactNode
}

export default function Layout({
  trips,
  onAddTrip,
  badge,
  subtitle,
  TripFormOverride,
  children,
}: LayoutProps) {
  const TripForm = TripFormOverride ?? TripFormDefault

  return (
    <div className={styles.appWrapper}>
      <header className={styles.topbar}>
        <span className={styles.topbarLogo}>WanderState</span>
        <span className={styles.topbarBadge}>{badge}</span>
        <span className={styles.topbarSub}>{subtitle}</span>
      </header>
      <main className={styles.appFrame}>
        <TripForm onAddTrip={onAddTrip} />
        <TripList trips={trips} />
        {children}
      </main>
    </div>
  )
}
