import {
  createContext,
  FC,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
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
    textEditorRef: RefObject<HTMLDivElement>
    titleRef: RefObject<HTMLHeadingElement>
  }
)

export const PadProvider: FC = ({ children }) => {
  const textEditorRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

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
        padContentIndex,
        textEditorRef,
        titleRef
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

  const unselectItem = useCallback(
    () => setSelectedItemId(null),
    [setSelectedItemId]
  )

  const selectTitle = useCallback(() => {
    context.titleRef.current?.focus()
    unselectItem()
  }, [context.titleRef, unselectItem])

  const selectTextEditor = useCallback(() => {
    context.textEditorRef.current?.focus()
  }, [context.textEditorRef])

  const selectNextItem = useCallback(
    (preventEditorSelect?: boolean) => {
      if (!content) {
        selectTextEditor()
        return false
      }
      const isLast = selectedItemIndex === content.items.length - 1
      if (selectedItemIndex === -1 || isLast) {
        if (!preventEditorSelect) selectTextEditor()
        return false
      }

      setSelectedItemId(content.items[selectedItemIndex + 1].id)
      return true
    },
    [content, selectTextEditor, selectedItemIndex, setSelectedItemId]
  )

  const selectPreviousItem = useCallback(
    (preventTitleSelect?: boolean) => {
      if (!content) return false
      const isFirst = selectedItemIndex === 0
      if (isFirst) {
        if (!preventTitleSelect) selectTitle()
        return false
      }
      if (selectedItemIndex === -1) return false

      setSelectedItemId(content.items[selectedItemIndex - 1].id)
      return true
    },
    [content, selectTitle, selectedItemIndex, setSelectedItemId]
  )

  const selectLastItem = useCallback(() => {
    if (!content) return false
    if (!content.items.length) return false
    setSelectedItemId(content.items[content.items.length - 1].id)
    return true
  }, [content, setSelectedItemId])

  const selectFirstItem = useCallback(() => {
    if (!content) return false
    if (!content.items.length) return false
    setSelectedItemId(content.items[0].id)
    return true
  }, [content, setSelectedItemId])

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
      if (!selectNextItem(true)) selectPreviousItem(true)
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

  useEffect(() => {
    if (padId) selectTextEditor()
  }, [padId, selectTextEditor])

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
    selectPreviousItem,
    selectFirstItem,
    selectLastItem,
    selectTitle,
    selectTextEditor
  }
}
