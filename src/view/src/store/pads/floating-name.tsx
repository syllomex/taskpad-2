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

      const { clientX, clientY } = ev
      const translateX = `${clientX + 16}px`
      const translateY = `${clientY - 8}px`

      ref.current.style.transform = `translate(${translateX}, ${translateY})`
    }

    document.addEventListener('mousemove', listener)

    return () => document.removeEventListener('mousemove', listener)
  }, [])

  if (!mouseOverPad || movingPadId) return null
  return <FloatingNameSpan ref={ref}>{mouseOverPad.title}</FloatingNameSpan>
}
