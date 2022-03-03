import React, {
  FC,
  FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { IoReorderThree } from 'react-icons/io5'
import { useConfirm, usePad } from '../../store'
import { Line } from '../../store/pad/type'
import { useKeyHandlers } from '../../utils/key-handlers'
import { CheckBox } from '../CheckBox'
import { LineContainer, LineWrapper, MoveContainer } from './styles'

export const LineComponent: FC<{ line: Line }> = ({ line }) => {
  const spanRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const lineWrapperRef = useRef<HTMLDivElement>(null)

  const [isEditing, setIsEditing] = useState(false)

  const { confirm } = useConfirm()
  const {
    content,
    deleteLine,
    updateLine,
    setSelectedItemId,
    selectedItemId,
    selectPreviousItem,
    selectNextItem,
    selectTextEditor,
    movingItemId,
    setMovingItemId,
    movingOverItemId,
    setMovingOverItemId,
    scrollY,
    dropDirection,
    setDropDirection,
    setItemHeight,
    moveIdToAbove,
    moveIdToBelow,
    getItemHeightsBeforeId,
    getItemHeightsAfterId,
    getHeightBetweenIndexes,
    getItemHeight
  } = usePad()

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Excluir item',
      description: 'Tem certeza de que deseja excluir esse item?',
      onConfirm: () => deleteLine(line.id)
    })
  }, [confirm, deleteLine, line.id])

  const handleCheck = useCallback(
    (value: boolean) => {
      spanRef.current?.blur()
      updateLine({ ...line, checked: value })
    },
    [line, updateLine]
  )

  useKeyHandlers({
    disabled: selectedItemId !== line.id,
    escape () {
      spanRef.current?.blur()
    },
    space (ev) {
      if (!isEditing) {
        ev.preventDefault()
        handleCheck(!line.checked)
      }
    },
    enter (ev) {
      ev.preventDefault()
      if (!isEditing) spanRef.current?.focus()
      else {
        spanRef.current?.blur()
        selectTextEditor()
      }
    },
    del () {
      if (!isEditing) handleDelete()
    },
    arrowUp (ev) {
      ev.preventDefault()
      if (selectPreviousItem() && isEditing) {
        setIsEditing(false)
        spanRef.current?.blur()
      }
    },
    arrowDown (ev) {
      ev.preventDefault()
      if (selectNextItem() && isEditing) {
        setIsEditing(false)
        spanRef.current?.blur()
      }
    },
    keyOrDigit () {
      if (!isEditing) {
        spanRef.current?.focus()
        if (spanRef.current) spanRef.current.innerText = ''
      }
    }
  })

  const handleSpanBlur = useCallback(
    (ev: FocusEvent<HTMLSpanElement>) => {
      const text = ev.currentTarget.innerText
      setIsEditing(false)
      if (!text.length) deleteLine(line.id)
      else updateLine({ ...line, text })
    },
    [deleteLine, line, updateLine]
  )

  useEffect(() => {
    if (movingItemId !== line.id) return

    const listener = () => {
      if (movingItemId === movingOverItemId || !movingOverItemId) return

      if (dropDirection === 'up') {
        moveIdToAbove(movingItemId, movingOverItemId)
      } else {
        moveIdToBelow(movingItemId, movingOverItemId)
      }

      setMovingItemId(null)
      setMovingOverItemId(null)

      if (lineWrapperRef.current) {
        lineWrapperRef.current.style.transform = 'translateY(0px)'
      }
    }

    window.addEventListener('mouseup', listener)
    return () => window.removeEventListener('mouseup', listener)
  }, [
    dropDirection,
    line.id,
    moveIdToAbove,
    moveIdToBelow,
    movingItemId,
    movingOverItemId,
    setMovingItemId,
    setMovingOverItemId
  ])

  useEffect(() => {
    if (!movingItemId && lineWrapperRef.current) {
      lineWrapperRef.current.style.transform = 'translateY(0)'
    }
  }, [movingItemId])

  useEffect(() => {
    if (!lineWrapperRef.current) return
    setItemHeight(line.id, lineWrapperRef.current.clientHeight)
  }, [line, movingItemId, setItemHeight])

  const handleMouseOver = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      ev.preventDefault()
      if (!movingItemId) return
      if (movingItemId !== line.id) setMovingOverItemId(line.id)

      const { currentTarget, clientY } = ev
      const lineCenter =
        currentTarget.offsetTop +
        currentTarget.offsetHeight / 2 -
        scrollY.current

      if (clientY < lineCenter) {
        setDropDirection('up')
      } else {
        setDropDirection('down')
      }
    },
    [line.id, movingItemId, scrollY, setDropDirection, setMovingOverItemId]
  )

  useEffect(() => {
    if (
      !movingItemId ||
      !movingOverItemId ||
      !content ||
      !lineWrapperRef.current
    ) {
      return
    }

    const movingIndex = content.items.findIndex(
      (item) => item.id === movingItemId
    )
    const movingOverIndex = content.items.findIndex(
      (item) => item.id === movingOverItemId
    )

    const moveDraggedItemDown = () => {
      if (!lineWrapperRef.current) return
      const overIndex =
        dropDirection === 'down' ? movingOverIndex + 1 : movingOverIndex

      const height = getHeightBetweenIndexes(movingIndex, overIndex)
      if (height === null) return
      lineWrapperRef.current.style.transform = `translateY(${height}px)`
    }

    const moveDraggedItemUp = () => {
      if (!lineWrapperRef.current) return
      const overIndex =
        dropDirection === 'up' ? movingOverIndex - 1 : movingOverIndex

      const height = getHeightBetweenIndexes(overIndex, movingIndex)
      if (height === null) return
      lineWrapperRef.current.style.transform = `translateY(-${height}px)`
    }

    const moveCurrentLineDown = () => {
      if (!lineWrapperRef.current) return
      const movingItemHeight = getItemHeight(movingItemId).height
      lineWrapperRef.current.style.transform = `translateY(${movingItemHeight}px)`
    }

    const moveCurrentLineUp = () => {
      if (!lineWrapperRef.current) return
      const movingItemHeight = getItemHeight(movingItemId).height
      lineWrapperRef.current.style.transform = `translateY(-${movingItemHeight}px)`
    }

    const resetCurrentLine = () => {
      if (!lineWrapperRef.current) return
      lineWrapperRef.current.style.transform = 'translateY(0)'
    }

    if (line.id === movingItemId) {
      if (movingIndex > movingOverIndex) {
        moveDraggedItemUp()
      } else {
        moveDraggedItemDown()
      }
    } else {
      const lineIndex = content.items.findIndex((item) => item.id === line.id)

      if (lineIndex < movingIndex) {
        if (lineIndex === movingOverIndex) {
          if (dropDirection === 'up') moveCurrentLineDown()
          else resetCurrentLine()
        } else if (lineIndex > movingOverIndex) {
          moveCurrentLineDown()
        } else if (lineIndex < movingOverIndex) {
          resetCurrentLine()
        }
      } else if (lineIndex > movingIndex) {
        if (lineIndex === movingOverIndex) {
          if (dropDirection === 'down') moveCurrentLineUp()
          else resetCurrentLine()
        } else if (lineIndex < movingOverIndex) {
          moveCurrentLineUp()
        } else if (lineIndex > movingOverIndex) {
          resetCurrentLine()
        }
      }
    }
  }, [
    content,
    dropDirection,
    getHeightBetweenIndexes,
    getItemHeight,
    getItemHeightsAfterId,
    getItemHeightsBeforeId,
    line.id,
    movingItemId,
    movingOverItemId
  ])

  return (
    <LineWrapper
      ref={lineWrapperRef}
      isMoving={movingItemId === line.id}
      onMouseOver={handleMouseOver}
    >
      <MoveContainer
        onMouseDown={(ev) => {
          ev.preventDefault()
          setMovingItemId(line.id)
        }}
        onMouseUp={() => {
          setMovingItemId(null)
          setMovingOverItemId(null)
        }}
      >
        <IoReorderThree />
      </MoveContainer>

      <LineContainer
        withTransition={!!movingItemId}
        ref={lineRef}
        onContextMenu={(ev) => {
          ev.preventDefault()
          handleDelete()
        }}
        checked={line.checked}
        selected={selectedItemId === line.id}
        onClick={() => {
          setSelectedItemId(line.id)
        }}
      >
        <div className="checkbox-container">
          <CheckBox checked={line.checked} onChange={handleCheck} />
        </div>
        <span
          ref={spanRef}
          contentEditable={selectedItemId === line.id}
          suppressContentEditableWarning
          onFocus={() => {
            setIsEditing(true)
            setSelectedItemId(line.id)
          }}
          onBlur={handleSpanBlur}
        >
          {line.text}
        </span>
      </LineContainer>
    </LineWrapper>
  )
}
