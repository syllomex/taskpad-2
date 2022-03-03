import { FC } from 'react'
import { usePad } from '../../store/pad'
import { Content } from './content'
import { Container } from './styles'
import { Title } from './title'

export const Editor: FC = () => {
  const { pad, scrollY, containerRef, movingItemId } = usePad()

  if (!pad) return null

  return (
    <Container
      ref={containerRef}
      withTransition={!!movingItemId}
      onScroll={(ev) => {
        scrollY.current = ev.currentTarget.scrollTop
      }}
    >
      <Title />
      <Content />
    </Container>
  )
}
