import { createContext, FC, useCallback, useContext, useState } from 'react'
import { v4 } from 'uuid'
import { replaceIndex, SetState } from '../../utils'
import { Pad, usePads } from '../pads'
import { Item, Line, PadContent } from './type'

export const PadContext = createContext(
  {} as {
    contents: PadContent[]
    setContents: SetState<PadContent[]>
    selectedItemId: string | null
    setSelectedItemId: SetState<string | null>
    selectedItem: Item | null
    selectedPad: Pad | null
    padContent: PadContent | null
    padContentIndex: number
    selectedPadIndex: number
    selectedItemIndex: number
  }
)

export const PadProvider: FC = ({ children }) => {
  const [contents, setContents] = useState<PadContent[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const { pads, selectedPadId } = usePads()

  const selectedPadIndex = pads.findIndex((pad) => pad.id === selectedPadId)
  const selectedPad = selectedPadId ? pads[selectedPadIndex] : null

  const padContentIndex = contents.findIndex(
    ({ padId }) => padId === selectedPadId
  )
  const padContent = padContentIndex === -1 ? null : contents[padContentIndex]

  const selectedItemIndex = !padContent
    ? -1
    : padContent?.items.findIndex(({ id }) => id === selectedItemId)

  const selectedItem = padContent?.items[selectedItemIndex] || null

  return (
    <PadContext.Provider
      value={{
        contents,
        setContents,
        selectedItemId,
        setSelectedItemId,
        selectedItem,
        selectedItemIndex,
        selectedPad,
        selectedPadIndex,
        padContent,
        padContentIndex
      }}
    >
      {children}
    </PadContext.Provider>
  )
}

export const usePad = () => {
  const context = useContext(PadContext)

  const {
    setContents,
    selectedPad: pad,
    selectedPadIndex: padIndex,
    padContentIndex: contentIndex,
    padContent: content,
    setSelectedItemId,
    selectedItemIndex
  } = context

  const { setPads, selectedPadId: padId } = usePads()

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
    (items: Item[]) => {
      if (!padId) return
      setContents((cur) => {
        if (contentIndex === -1) return [...cur, { padId, items }]
        return replaceIndex({
          array: cur,
          index: contentIndex,
          item: { ...cur[contentIndex], items }
        })
      })
    },
    [contentIndex, padId, setContents]
  )

  const selectNextItem = useCallback(() => {
    if (!content) return false
    const isLast = selectedItemIndex === content.items.length - 1
    if (selectedItemIndex === -1 || isLast) return false

    setSelectedItemId(content.items[selectedItemIndex + 1].id)
    return true
  }, [content, selectedItemIndex, setSelectedItemId])

  const selectPreviousItem = useCallback(() => {
    if (!content) return false
    const isFirst = selectedItemIndex === 0
    if (selectedItemIndex === -1 || isFirst) return false

    setSelectedItemId(content.items[selectedItemIndex - 1].id)
    return true
  }, [content, selectedItemIndex, setSelectedItemId])

  const createLine = useCallback(
    (text: string) => {
      if (!padId) return

      const newLine: Line = {
        id: v4(),
        text,
        type: 'line',
        checked: false
      }

      updateContent(!content ? [newLine] : [...content.items, newLine])
    },
    [content, padId, updateContent]
  )

  const deleteLine = useCallback(
    (lineId: string) => {
      if (!padId) return
      if (!selectNextItem()) selectPreviousItem()
      updateContent(content?.items.filter((item) => item.id !== lineId) || [])
    },
    [content?.items, padId, selectNextItem, selectPreviousItem, updateContent]
  )

  const updateLine = useCallback(
    (data: Line) => {
      if (!padId) return
      const lineIndex = content?.items.findIndex((item) => item.id === data.id)
      const updated =
        !content || lineIndex === undefined || lineIndex === -1
          ? [data]
          : [
              ...[...content.items].splice(0, lineIndex),
              data,
              ...[...content.items].splice(lineIndex + 1)
            ]

      updateContent(updated)
    },
    [content, padId, updateContent]
  )

  const unselectItem = useCallback(
    () => setSelectedItemId(null),
    [setSelectedItemId]
  )

  return {
    ...context,
    pad,
    updateTitle,
    content,
    updateContent,
    createLine,
    deleteLine,
    updateLine,
    unselectItem,
    selectNextItem,
    selectPreviousItem
  }
}
