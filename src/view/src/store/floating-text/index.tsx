import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { SetState } from '../../utils'
import { FloatingSpan } from './styles'

const FloatingTextContext = createContext(
  {} as {
    floatingText: string | null
    setFloatingText: SetState<string | null>
  }
)

export const useFloatingText = () => {
  return useContext(FloatingTextContext)
}

export const FloatingText: FC = () => {
  const ref = useRef<HTMLSpanElement>(null)

  const { floatingText } = useFloatingText()

  useEffect(() => {
    const listener = (ev: MouseEvent) => {
      if (!ref.current) return

      const { clientX, clientY } = ev
      const translateX = `${clientX + 16}px`
      const translateY = `${clientY - 8}px`

      ref.current.style.transform = `translate(${translateX}, ${translateY})`
      ref.current.style.opacity = '0.6'
      ref.current.style.display = 'block'
    }

    document.addEventListener('mousemove', listener)

    return () => document.removeEventListener('mousemove', listener)
  }, [])

  if (!floatingText?.length) return null
  return <FloatingSpan ref={ref}>{floatingText}</FloatingSpan>
}

export const FloatingTextProvider: FC = ({ children }) => {
  const [floatingText, setFloatingText] = useState<string | null>(null)

  return (
    <FloatingTextContext.Provider value={{ floatingText, setFloatingText }}>
      {children}
      <FloatingText />
    </FloatingTextContext.Provider>
  )
}
