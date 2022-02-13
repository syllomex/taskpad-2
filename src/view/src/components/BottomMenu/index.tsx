import React, { useCallback } from 'react'

import { IoHomeSharp, IoSettingsSharp, IoCreate } from 'react-icons/io5'
import { useFloatingText, usePad, usePads } from '../../store'

import { Container } from './styles'

export const BottomMenu: React.FC = () => {
  const { setFloatingText } = useFloatingText()
  const { createPad } = usePads()
  const { unselectItem } = usePad()

  const handleMouseEnter = useCallback(
    (option: string) => {
      setFloatingText(option)
    },
    [setFloatingText]
  )

  const handleMouseLeave = useCallback(() => {
    setFloatingText(null)
  }, [setFloatingText])

  return (
    <Container>
      <IoHomeSharp
        className="icon"
        onMouseEnter={() => handleMouseEnter('Início')}
        onMouseLeave={handleMouseLeave}
        onClick={unselectItem}
      />
      <IoCreate
        className="icon"
        onMouseEnter={() => handleMouseEnter('Nova página')}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          unselectItem()
          createPad()
        }}
      />
      <IoSettingsSharp
        className="icon"
        onMouseEnter={() => handleMouseEnter('Configurações')}
        onMouseLeave={handleMouseLeave}
        onClick={unselectItem}
      />
    </Container>
  )
}
