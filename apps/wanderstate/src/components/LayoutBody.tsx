import type { ReactNode } from 'react'
import styles from './LayoutBody.module.css'

interface LayoutBodyProps {
  children: ReactNode
}

export default function LayoutBody({ children }: LayoutBodyProps) {
  return <main className={styles.body}>{children}</main>
}
