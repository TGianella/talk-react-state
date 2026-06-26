import { useState, useId, useEffect, useRef } from 'react'
import styles from './DropdownSelect.module.css'

export interface DropdownSelectProps {
  id?: string
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function DropdownSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Choisir…',
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const uid = useId()
  const listboxId = `${uid}-listbox`
  const getOptionId = (index: number) => `${uid}-option-${index}`
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!isOpen || activeIndex < 0 || !listRef.current) return
    const activeEl = listRef.current.children[activeIndex] as HTMLElement | undefined
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isOpen])

  function open() {
    const currentIndex = value ? options.indexOf(value) : 0
    setActiveIndex(currentIndex === -1 ? 0 : currentIndex)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function confirmSelection(index: number) {
    if (index >= 0 && index < options.length) {
      onChange(options[index])
    }
    close()
  }

  function handleButtonKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          open()
        } else {
          setActiveIndex((i) => Math.min(i + 1, options.length - 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          open()
          setActiveIndex(options.length - 1)
        } else {
          setActiveIndex((i) => Math.max(i - 1, 0))
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen) {
          confirmSelection(activeIndex)
        } else {
          open()
        }
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          close()
        }
        break
      case 'Home':
        if (isOpen) {
          e.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (isOpen) {
          e.preventDefault()
          setActiveIndex(options.length - 1)
        }
        break
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      close()
    }
  }

  return (
    <div className={styles.dropdown} onBlur={handleBlur}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && activeIndex >= 0 ? getOptionId(activeIndex) : undefined}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {value ? value : placeholder}
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>

      {isOpen ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          className={styles.options}
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={getOptionId(index)}
              role="option"
              aria-selected={option === value}
              tabIndex={-1}
              className={`${styles.option} ${option === value ? styles.optionSelected : ''} ${index === activeIndex ? styles.optionActive : ''}`}
              onClick={() => confirmSelection(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
