import { FC, FocusEvent, useCallback, useRef, useState } from 'react'
import { useConfirm, usePad } from '../../store'
import { Line } from '../../store/pad/type'
import { useKeyHandlers } from '../../utils/key-handlers'
import { CheckBox } from '../CheckBox'
import { LineContainer } from './styles'

export const LineComponent: FC<{ line: Line }> = ({ line }) => {
  const spanRef = useRef<HTMLSpanElement>(null)

  const [isEditing, setIsEditing] = useState(false)

  const { confirm } = useConfirm()
  const {
    deleteLine,
    updateLine,
    setSelectedItemId,
    selectedItemId,
    selectPreviousItem,
    selectNextItem
  } = usePad()

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Excluir item',
      description: 'Tem certeza de que deseja excluir esse item?',
      onConfirm: () => deleteLine(line.id)
    })
  }, [confirm, deleteLine, line.id])

  const handleClick = useCallback(() => {
    setSelectedItemId(line.id)
  }, [line.id, setSelectedItemId])

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
    space () {
      if (!isEditing) handleCheck(!line.checked)
    },
    enter (ev) {
      ev.preventDefault()
      if (!isEditing) spanRef.current?.focus()
      else spanRef.current?.blur()
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

  return (
    <LineContainer
      onContextMenu={handleDelete}
      checked={line.checked}
      onClick={handleClick}
      selected={selectedItemId === line.id}
    >
      <CheckBox checked={line.checked} onChange={handleCheck} />
      <span
        ref={spanRef}
        contentEditable={selectedItemId === line.id}
        suppressContentEditableWarning
        onFocus={() => setIsEditing(true)}
        onBlur={handleSpanBlur}
      >
        {line.text}
      </span>
    </LineContainer>
  )
}
