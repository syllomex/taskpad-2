import { createContext, FC, useCallback, useContext, useState } from 'react'
import { v4 } from 'uuid'
import { SetState } from '../../utils'
import { usePads } from '../pads'
import { Item, Line, PadContent } from './type'

export const PadContext = createContext(
  {} as {
    contents: PadContent[]
    setContents: SetState<PadContent[]>
  }
)

export const PadProvider: FC = ({ children }) => {
  const [contents, setContents] = useState<PadContent[]>([])

  return (
    <PadContext.Provider value={{ contents, setContents }}>
      {children}
    </PadContext.Provider>
  )
}

export const usePad = () => {
  const { pads, setPads, selectedPadId: id } = usePads()
  const { contents, setContents } = useContext(PadContext)

  const padIndex = pads.findIndex((pad) => pad.id === id)
  const pad = id ? pads[padIndex] : null

  const content = contents.find(({ padId }) => padId === id)

  const updateTitle = useCallback(
    (newTitle: string) => {
      setPads((cur) =>
        !pad
          ? cur
          : [
              ...[...cur].splice(0, padIndex),
              {
                ...pad,
                title: newTitle
              },
              ...[...cur].splice(padIndex + 1)
            ]
      )
    },
    [pad, padIndex, setPads]
  )

  const updateContent = useCallback(
    (padId: string, items: Item[]) => {
      setContents((cur) => {
        const contentIndex = cur.findIndex((content) => content.padId === padId)
        if (contentIndex === -1) return [...cur, { padId, items }]
        return [
          ...[...cur].splice(0, contentIndex),
          { ...cur[contentIndex], items },
          ...[...cur].splice(contentIndex + 1)
        ]
      })
    },
    [setContents]
  )

  const createLine = useCallback(
    (text: string) => {
      if (!id) return

      const newLine: Line = {
        id: v4(),
        text,
        type: 'line',
        checked: false
      }

      updateContent(id, !content ? [newLine] : [...content.items, newLine])
    },
    [content, id, updateContent]
  )

  const deleteLine = useCallback(
    (lineId: string) => {
      if (!id) return

      updateContent(
        id,
        content?.items.filter((item) => item.id !== lineId) || []
      )
    },
    [content?.items, id, updateContent]
  )

  const updateLine = useCallback(
    (data: Line) => {
      if (!id) return
      const lineIndex = content?.items.findIndex((item) => item.id === data.id)
      const updated =
        !content || lineIndex === undefined || lineIndex === -1
          ? [data]
          : [
              ...[...content.items].splice(0, lineIndex),
              data,
              ...[...content.items].splice(lineIndex + 1)
            ]

      updateContent(id, updated)
    },
    [content, id, updateContent]
  )

  return {
    pad,
    updateTitle,
    content,
    updateContent,
    createLine,
    deleteLine,
    updateLine
  }
}
