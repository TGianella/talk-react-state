import type { ReactNode } from 'react'

interface LayoutFooterProps {
  children: ReactNode
}

export default function LayoutFooter({ children }: LayoutFooterProps) {
  return <footer>{children}</footer>
}
