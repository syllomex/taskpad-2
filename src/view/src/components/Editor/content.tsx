import { FC, useEffect } from 'react'
import { usePad } from '../../store'
import { LineComponent } from './line'
import { ContentContainer, TextEditor } from './styles'

export const Content: FC = () => {
  const {
    content,
    createLine,
    unselectItem,
    textEditorRef: editorRef,
    selectLastItem,
    selectTitle,
    movingItemId,
    selectedItemId
  } = usePad()

  useEffect(() => {
    if (selectedItemId || movingItemId) editorRef.current?.blur()
  }, [editorRef, movingItemId, selectedItemId])

  return (
    <ContentContainer isMoving={!!movingItemId}>
      {content?.items.map((item) => {
        if (item.type === 'line') {
          return <LineComponent key={item.id} line={item} />
        }
        return null
      })}

      {!!content?.items.length && <div style={{ height: 8 }} />}

      <TextEditor
        ref={editorRef}
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 200
        }}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(ev) => {
          if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            const text = ev.currentTarget.innerText.trim()
            if (text.length) createLine(text)
            ev.currentTarget.innerText = ''
          } else if (ev.code === 'ArrowUp') {
            ev.preventDefault()
            if (selectLastItem()) editorRef.current?.blur()
            else selectTitle()
          }
        }}
        onFocus={unselectItem}
        onClick={unselectItem}
      />
    </ContentContainer>
  )
}
