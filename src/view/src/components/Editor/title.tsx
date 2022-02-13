import { FC, KeyboardEvent, useCallback, useState } from 'react'

import { usePad } from '../../store/pad'
import { useKeyHandlers } from '../../utils/key-handlers'
import { TitleHeading } from './styles'

export const Title: FC = () => {
  const [isEditing, setIsEditing] = useState(false)

  const {
    updateTitle,
    pad,
    unselectItem,
    titleRef,
    selectFirstItem,
    selectTextEditor
  } = usePad()

  const handleFocus = useCallback(() => {
    setIsEditing(true)
    unselectItem()
  }, [unselectItem])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (!titleRef.current || !pad) return

    const text = titleRef.current.innerText.trim()
    if (text.length) updateTitle(text)
    else titleRef.current.innerText = pad?.title
  }, [pad, titleRef, updateTitle])

  const handleKeyPress = useCallback(
    (ev: KeyboardEvent<HTMLHeadingElement>) => {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        titleRef.current?.blur()
      }
    },
    [titleRef]
  )

  useKeyHandlers({
    disabled: !isEditing,
    arrowDown (ev) {
      ev.preventDefault()
      if (selectFirstItem()) titleRef.current?.blur()
      else selectTextEditor()
    }
  })

  return (
    <TitleHeading
      ref={titleRef}
      className={`title${isEditing ? ' editing' : ''}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      contentEditable
      suppressContentEditableWarning
      onKeyDown={handleKeyPress}
    >
      {pad?.title}
    </TitleHeading>
  )
}
