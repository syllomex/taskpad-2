import { FC } from 'react'
import { IoCheckmark } from 'react-icons/io5'
import { Container } from './styles'

interface Props {
  checked?: boolean
  onChange?: (value: boolean) => void
}

export const CheckBox: FC<Props> = ({ checked, onChange }) => {
  return (
    <Container onClick={() => onChange?.(!checked)} itemType="checkbox">
      {checked && <IoCheckmark className="icon" />}
    </Container>
  )
}
