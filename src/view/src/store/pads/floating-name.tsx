import { FC, useEffect, useRef } from 'react'
import { usePads } from './index'
import { FloatingNameSpan } from './styles'

export const FloatingName: FC = () => {
  const ref = useRef<HTMLSpanElement>(null)

  const { mouseOverPadId, pads, movingPadId } = usePads()

  const mouseOverPad = pads.find(({ id }) => id === mouseOverPadId)

  useEffect(() => {
    const listener = (ev: MouseEvent) => {
      if (!ref.current) return

      const { clientY, clientX } = ev

      ref.current.style.transform = `translate(${clientX + 16}px, ${clientY}px)`
    }

    document.addEventListener('mousemove', listener)

    return () => document.removeEventListener('mousemove', listener)
  }, [])

  if (!mouseOverPad || movingPadId) return null
  return <FloatingNameSpan ref={ref}>{mouseOverPad.title}</FloatingNameSpan>
}
