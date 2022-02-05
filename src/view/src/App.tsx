import { FC } from 'react'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { Wrapper } from './components/Wrapper'

import { FloatingTextProvider, PadsProvider } from './store'

const App: FC = () => {
  return (
    <FloatingTextProvider>
      <PadsProvider>
        <Wrapper>
          <Menu />
          <Main />
        </Wrapper>
      </PadsProvider>
    </FloatingTextProvider>
  )
}

export default App
