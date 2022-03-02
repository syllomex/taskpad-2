import { FC } from 'react'
import { IoClose, IoRemove } from 'react-icons/io5'
import { Container } from './styles'

const { ipcRenderer } = window.require('electron')

export const TitleBar: FC = () => {
  return (
    <Container>
      <div className="movable" />
      <div
        className="icon-container"
        onClick={() => ipcRenderer.send('minimize')}
      >
        <IoRemove className="icon" />
      </div>
      <div className="icon-container" onClick={() => window.close()}>
        <IoClose className="icon" />
      </div>
    </Container>
  )
}
