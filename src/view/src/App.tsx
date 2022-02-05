import { FC } from 'react'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { Wrapper } from './components/Wrapper'

import { FloatingTextProvider, PadsProvider } from './store'
import { ConfirmProvider } from './store/confirm'

const App: FC = () => {
  return (
    <FloatingTextProvider>
      <ConfirmProvider>
        <PadsProvider>
          <Wrapper>
            <Menu />
            <Main />
          </Wrapper>
        </PadsProvider>
      </ConfirmProvider>
    </FloatingTextProvider>
  )
}

export default App
