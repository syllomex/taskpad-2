import { FC, useRef } from 'react'
import { usePad } from '../../store'
import { LineComponent } from './line'
import { ContentContainer, TextEditor } from './styles'

export const Content: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)

  const { content, createLine } = usePad()

  return (
    <ContentContainer>
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
          if (ev.key === 'Enter') {
            ev.preventDefault()
            const text = ev.currentTarget.innerText.trim()
            if (text.length) createLine(text)
            ev.currentTarget.innerText = ''
          }
        }}
      />
    </ContentContainer>
  )
}
