import {
  createContext,
  FC,
  MutableRefObject,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { v4 } from 'uuid'
import { insertAfter, insertBefore, replaceIndex, SetState } from '../../utils'
import { Pad, usePads } from '../pads'
import { Item, ItemHeight, Line, PadContent } from './type'

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
    movingItemId: string | null
    setMovingItemId: SetState<string | null>
    movingOverItemId: string | null
    setMovingOverItemId: SetState<string | null>
    dropDirection: 'up' | 'down' | null
    setDropDirection: SetState<'up' | 'down' | null>
    scrollY: MutableRefObject<number>
    containerRef: RefObject<HTMLDivElement>
    heights: ItemHeight[]
    setHeights: SetState<ItemHeight[]>
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

  /** DRAG AND DORP */
  const [movingItemId, setMovingItemId] = useState<string | null>(null)
  const [movingOverItemId, setMovingOverItemId] = useState<string | null>(null)
  const [dropDirection, setDropDirection] = useState<'up' | 'down' | null>(null)
  const scrollY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [heights, setHeights] = useState<ItemHeight[]>([])

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
        titleRef,
        movingItemId,
        setMovingItemId,
        movingOverItemId,
        setMovingOverItemId,
        dropDirection,
        setDropDirection,
        scrollY,
        containerRef,
        heights,
        setHeights
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
    selectedItemIndex,
    heights,
    setHeights
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

  const setItemHeight = useCallback(
    (id: string, height: number) => {
      setHeights((cur) => {
        const index = cur.findIndex(({ itemId }) => itemId === id)
        if (index === -1) return [...cur, { itemId: id, height }]

        return replaceIndex({ array: cur, index, item: { itemId: id, height } })
      })
    },
    [setHeights]
  )

  const getItemHeight = useCallback(
    (id: string) => {
      return heights.find((item) => item.itemId === id) as ItemHeight
    },
    [heights]
  )

  const getItemHeightsBeforeId = useCallback(
    (id: string) => {
      if (!content) return null
      const idIndex = content.items.findIndex(({ id: _id }) => _id === id)
      if (idIndex === -1) return null

      const itemIdsBeforeIndex = content.items
        .filter((_, index) => index < idIndex)
        .map((item) => item.id)

      return heights.reduce((prev, item) => {
        if (!itemIdsBeforeIndex.includes(item.itemId)) return prev
        return prev + item.height
      }, 0)
    },
    [content, heights]
  )

  const getItemHeightsAfterId = useCallback(
    (id: string) => {
      if (!content) return null
      const idIndex = content.items.findIndex(({ id: _id }) => _id === id)
      if (idIndex === -1) return null

      const itemIdsAfterIndex = content.items
        .filter((_, index) => index > idIndex)
        .map((item) => item.id)

      return heights.reduce((prev, item) => {
        if (!itemIdsAfterIndex.includes(item.itemId)) return prev
        return prev + item.height
      }, 0)
    },
    [content, heights]
  )

  const moveIdToAbove = useCallback(
    (itemId: string, aboveId: string) => {
      const items = content?.items
      if (!items) return

      const movingItem = items.find((item) => item.id === itemId)
      const itemsWithoutMovingId = items.filter((item) => item.id !== itemId)
      const beforeIndex = itemsWithoutMovingId.findIndex(
        (item) => item.id === aboveId
      )

      if (beforeIndex === -1 || !movingItem) return

      const updated = insertBefore({
        array: itemsWithoutMovingId,
        beforeIndex,
        element: movingItem
      })

      updateContent(updated)
    },
    [content?.items, updateContent]
  )

  const moveIdToBelow = useCallback(
    (itemId: string, belowId: string) => {
      const items = content?.items
      if (!items) return

      const movingItem = items.find((item) => item.id === itemId)
      const itemsWithoutMovingId = items.filter((item) => item.id !== itemId)
      const afterIndex = itemsWithoutMovingId.findIndex(
        (item) => item.id === belowId
      )

      if (afterIndex === -1 || !movingItem) return

      const updated = insertAfter({
        array: itemsWithoutMovingId,
        afterIndex,
        element: movingItem
      })

      updateContent(updated)
    },
    [content?.items, updateContent]
  )

  const getHeightBetweenIndexes = useCallback(
    (startIndex: number, endIndex: number) => {
      const items = content?.items
      if (!items) return

      const getHeightFromIds = items
        .filter((_item, index) => {
          return index > startIndex && index < endIndex
        })
        .map(({ id }) => id)

      const heights = context.heights.filter(({ itemId }) =>
        getHeightFromIds.includes(itemId)
      )

      return heights.reduce((prev, item) => {
        return prev + item.height
      }, 0)
    },
    [content?.items, context.heights]
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
    selectPreviousItem,
    selectFirstItem,
    selectLastItem,
    selectTitle,
    selectTextEditor,
    getItemHeight,
    setItemHeight,
    getItemHeightsBeforeId,
    getItemHeightsAfterId,
    moveIdToAbove,
    moveIdToBelow,
    getHeightBetweenIndexes
  }
}
