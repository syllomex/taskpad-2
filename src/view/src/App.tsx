import { FC } from 'react'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { TitleBar } from './components/TitleBar'
import { Wrapper } from './components/Wrapper'

import { FloatingTextProvider, PadProvider, PadsProvider } from './store'
import { ConfirmProvider } from './store/confirm'

const App: FC = () => {
  return (
    <FloatingTextProvider>
      <ConfirmProvider>
        <PadsProvider>
          <PadProvider>
            <Wrapper>
              <Menu />
              <Main />
              <TitleBar />
            </Wrapper>
          </PadProvider>
        </PadsProvider>
      </ConfirmProvider>
    </FloatingTextProvider>
  )
}

export default App
