import { useEffect, useRef } from 'react'
import type { AnyMachineSnapshot } from 'xstate'
import WizardStepName from './WizardStepName'
import WizardStepDestination from './WizardStepDestination'
import WizardStepBudget from './WizardStepBudget'
import WizardStepConfirm from './WizardStepConfirm'
import styles from './WizardModal.module.css'

interface WizardModalProps {
  snapshot: AnyMachineSnapshot
  send: (event: { type: string; [key: string]: unknown }) => void
}

export default function WizardModal({ snapshot, send }: WizardModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isClosed = snapshot.matches('closed')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleClose = () => send({ type: 'CANCEL' })
    dialog.addEventListener('close', handleClose)

    if (!isClosed) {
      dialog.showModal()
    } else {
      dialog.close()
    }

    return () => dialog.removeEventListener('close', handleClose)
  }, [isClosed, send])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      send({ type: 'CANCEL' })
    }
  }

  const ctx = snapshot.context as { name: string; destination: string; budget: number }
  const isSubmitting = snapshot.matches('submitting')
  const hasError = snapshot.matches('error')

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClick={handleBackdropClick}>
      <div className={styles.content}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: snapshot.matches('name') ? '33%'
                : snapshot.matches('destination') ? '66%'
                : '100%',
            }}
          />
        </div>

        {snapshot.matches('name') ? (
          <WizardStepName
            name={ctx.name}
            onChange={(value) => send({ type: 'SET_NAME', value })}
            onNext={() => send({ type: 'NEXT' })}
            onCancel={() => send({ type: 'CANCEL' })}
          />
        ) : null}

        {snapshot.matches('destination') ? (
          <WizardStepDestination
            destination={ctx.destination}
            onChange={(value) => send({ type: 'SET_DESTINATION', value })}
            onNext={() => send({ type: 'NEXT' })}
            onBack={() => send({ type: 'BACK' })}
            onCancel={() => send({ type: 'CANCEL' })}
          />
        ) : null}

        {snapshot.matches('budget') ? (
          <WizardStepBudget
            budget={ctx.budget}
            onChange={(value) => send({ type: 'SET_BUDGET', value })}
            onNext={() => send({ type: 'NEXT' })}
            onBack={() => send({ type: 'BACK' })}
            onCancel={() => send({ type: 'CANCEL' })}
          />
        ) : null}

        {snapshot.matches('confirm') || isSubmitting || hasError ? (
          <WizardStepConfirm
            name={ctx.name}
            destination={ctx.destination}
            budget={ctx.budget}
            isSubmitting={isSubmitting}
            hasError={hasError}
            onSubmit={() => send({ type: 'SUBMIT' })}
            onBack={() => send({ type: 'BACK' })}
            onCancel={() => send({ type: 'CANCEL' })}
            onRetry={() => send({ type: 'RETRY' })}
          />
        ) : null}
      </div>
    </dialog>
  )
}
