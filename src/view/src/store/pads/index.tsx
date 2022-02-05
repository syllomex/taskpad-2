import { createContext, FC, useContext, useEffect, useState } from 'react'
import { insertAfter, insertBefore } from '../../utils'
import { useFloatingText } from '../floating-text'

import { Pad, PadsContextType } from './types'

export * from './types'

const PadsContext = createContext({} as PadsContextType)

export const PadsProvider: FC = ({ children }) => {
  const { setFloatingText } = useFloatingText()

  const [pads, setPads] = useState<Pad[]>([
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    },
    {
      id: Math.floor(Math.random() * 16777215).toString(16),
      items: [],
      title: `Página ${Math.random()}`
    }
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // },
    // {
    //   id: Math.floor(Math.random() * 16777215).toString(16),
    //   items: [],
    //   title: `Página ${Math.random()}`
    // }
  ])

  const [movingPadId, setMovingPadId] = useState<string | null>(null)
  const [movingOverPadId, setMovingOverPadId] = useState<string | null>(null)
  const [dropDirection, setDropDirection] = useState<'up' | 'down' | null>(null)
  const [mouseOverPadId, setMouseOverPadId] = useState<string | null>(null)

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
        setMouseOverPadId
      }}
    >
      {children}
    </PadsContext.Provider>
  )
}

export const usePads = () => {
  const context = useContext(PadsContext)
  return context
}
