import { FC, useCallback } from 'react'
import { useConfirm, usePad } from '../../store'
import { Line } from '../../store/pad/type'
import { CheckBox } from '../CheckBox'
import { LineContainer } from './styles'

export const LineComponent: FC<{ line: Line }> = ({ line }) => {
  const { confirm } = useConfirm()
  const { deleteLine, updateLine } = usePad()

  const handleDelete = useCallback(() => {
    confirm({
      title: 'Excluir item',
      description: 'Tem certeza de que deseja excluir esse item?',
      onConfirm: () => deleteLine(line.id)
    })
  }, [confirm, deleteLine, line.id])

  return (
    <LineContainer onContextMenu={handleDelete} checked={line.checked}>
      <CheckBox
        checked={line.checked}
        onChange={(value) => updateLine({ ...line, checked: value })}
      />
      {line.text}
    </LineContainer>
  )
}
