import styles from './LayoutHeader.module.css'

interface LayoutHeaderProps {
  chapter: string
}

export default function LayoutHeader({ chapter }: LayoutHeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>WanderState</span>
      <span className={styles.badge}>{chapter}</span>
    </header>
  )
}
