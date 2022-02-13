import { FC, KeyboardEvent, useCallback, useRef, useState } from 'react'

import { usePad } from '../../store/pad'
import { TitleHeading } from './styles'

export const Title: FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)

  const [isEditing, setIsEditing] = useState(false)

  const { updateTitle, pad, unselectItem } = usePad()

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
  }, [pad, updateTitle])

  const handleKeyPress = useCallback(
    (ev: KeyboardEvent<HTMLHeadingElement>) => {
      if (ev.key === 'Enter') {
        ev.preventDefault()
        titleRef.current?.blur()
      }
    },
    []
  )

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
