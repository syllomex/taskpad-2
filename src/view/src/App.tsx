import { FC } from 'react'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { Wrapper } from './components/Wrapper'

import { PadsProvider } from './store'

const App: FC = () => {
  return (
    <PadsProvider>
      <Wrapper>
        <Menu />
        <Main />
      </Wrapper>
    </PadsProvider>
  )
}

export default App
