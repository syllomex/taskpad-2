import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { v4 } from 'uuid'

import { insertAfter, insertBefore } from '../../utils'
import { useFloatingText } from '../floating-text'

import { Pad, PadsContextType } from './types'

export * from './types'

const PadsContext = createContext({} as PadsContextType)

export const PadsProvider: FC = ({ children }) => {
  const { setFloatingText } = useFloatingText()

  const [pads, setPads] = useState<Pad[]>([])

  const [movingPadId, setMovingPadId] = useState<string | null>(null)
  const [movingOverPadId, setMovingOverPadId] = useState<string | null>(null)
  const [dropDirection, setDropDirection] = useState<'up' | 'down' | null>(null)
  const [mouseOverPadId, setMouseOverPadId] = useState<string | null>(null)
  const [selectedPadId, setSelectedPadId] = useState<string | null>(null)

  useEffect(() => {
    if (!movingPadId) return

    const listener = () => {
      if (movingPadId !== movingOverPadId) {
        setPads((cur) => {
          const movingPad = cur.find(({ id }) => id === movingPadId)
          if (!movingPad) return cur

          const padsWithoutMovingPad = cur.filter(
            ({ id }) => id !== movingPadId
          )

          const movingOverIndex = padsWithoutMovingPad.findIndex(
            ({ id }) => id === movingOverPadId
          )

          if (movingOverIndex === -1) return cur

          if (dropDirection === 'up') {
            return insertBefore({
              array: padsWithoutMovingPad,
              beforeIndex: movingOverIndex,
              element: movingPad
            })
          } else {
            return insertAfter({
              array: padsWithoutMovingPad,
              afterIndex: movingOverIndex,
              element: movingPad
            })
          }
        })
      }

      setMovingPadId(null)
      setMovingOverPadId(null)
      setDropDirection(null)
    }

    document.addEventListener('mouseup', listener)

    return () => document.removeEventListener('mouseup', listener)
  }, [dropDirection, movingOverPadId, movingPadId])

  useEffect(() => {
    if (!mouseOverPadId || movingPadId) return

    const pad = pads.find(({ id }) => id === mouseOverPadId)
    if (pad) setFloatingText(pad.title)

    return () => setFloatingText(null)
  }, [mouseOverPadId, movingPadId, pads, setFloatingText])

  return (
    <PadsContext.Provider
      value={{
        pads,
        setPads,
        movingPadId,
        setMovingPadId,
        movingOverPadId,
        setMovingOverPadId,
        dropDirection,
        setDropDirection,
        mouseOverPadId,
        setMouseOverPadId,
        selectedPadId,
        setSelectedPadId
      }}
    >
      {children}
    </PadsContext.Provider>
  )
}

export const usePads = () => {
  const context = useContext(PadsContext)

  const { pads, setPads, setSelectedPadId, selectedPadId } = context

  const selectNextPad = useCallback(() => {
    if (!selectedPadId) return false

    const currentIndex = pads.findIndex(({ id }) => id === selectedPadId)
    const notFound = currentIndex === -1
    const isLast = currentIndex === pads.length - 1

    if (notFound || isLast) return false

    setSelectedPadId(pads[currentIndex + 1].id)

    return true
  }, [pads, selectedPadId, setSelectedPadId])

  const selectPreviousPad = useCallback(() => {
    if (!selectedPadId) return false

    const currentIndex = pads.findIndex(({ id }) => id === selectedPadId)
    const notFound = currentIndex === -1
    const isFirst = currentIndex === 0

    if (notFound || isFirst) return false

    setSelectedPadId(pads[currentIndex - 1].id)

    return true
  }, [pads, selectedPadId, setSelectedPadId])

  const createPad = useCallback(() => {
    const id = v4()
    setPads((cur) => [...cur, { id, items: [], title: 'Nova página' }])
    context.setSelectedPadId(id)
  }, [context, setPads])

  const deletePad = useCallback(
    (id: string) => {
      setPads((cur) => cur.filter((pad) => pad.id !== id))
      if (id === selectedPadId) selectNextPad() || selectPreviousPad()
    },
    [selectNextPad, selectPreviousPad, selectedPadId, setPads]
  )

  return {
    ...context,
    createPad,
    deletePad,
    selectPad: context.setSelectedPadId
  }
}
