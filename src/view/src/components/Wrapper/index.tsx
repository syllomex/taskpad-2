import { FC } from 'react'
import { Container } from './styles'

export const Wrapper: FC = ({ children }) => {
  return <Container>{children}</Container>
}
