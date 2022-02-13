import { useEffect } from 'react'

// type Key = 'space' | 'enter' | 'arrowUp' | 'arrowDown' | 'keyOrDigit' | 'delete'

type Handlers = {
  escape?: (ev: KeyboardEvent) => void
  space?: (ev: KeyboardEvent) => void
  enter?: (ev: KeyboardEvent) => void
  arrowUp?: (ev: KeyboardEvent) => void
  arrowDown?: (ev: KeyboardEvent) => void
  keyOrDigit?: (ev: KeyboardEvent) => void
  del?: (ev: KeyboardEvent) => void
  disabled?: boolean
}

export const useKeyHandlers = ({
  space,
  arrowDown,
  arrowUp,
  enter,
  del,
  keyOrDigit,
  escape,
  disabled
}: Handlers) => {
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (disabled) return

      if (ev.code === 'Escape') {
        escape?.(ev)
      } else if (ev.code === 'Space') {
        space?.(ev)
      } else if (ev.key === 'Enter') {
        enter?.(ev)
      } else if (ev.code === 'Delete') {
        del?.(ev)
      } else if (ev.code === 'ArrowUp') {
        arrowUp?.(ev)
      } else if (ev.code === 'ArrowDown') {
        arrowDown?.(ev)
      } else if (ev.code.startsWith('Key') || ev.code.startsWith('Digit')) {
        keyOrDigit?.(ev)
      }
    }

    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [arrowDown, arrowUp, del, disabled, enter, escape, keyOrDigit, space])
}
