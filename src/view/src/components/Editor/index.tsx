import { FC } from 'react'
import { usePad } from '../../store/pad'
import { Container } from './styles'
import { Title } from './title'

export const Editor: FC = () => {
  const { pad } = usePad()

  if (!pad) return null

  return (
    <Container>
      <Title />
    </Container>
  )
}
