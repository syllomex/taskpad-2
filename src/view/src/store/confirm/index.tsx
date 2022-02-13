import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { SetState } from '../../utils'
import { Backdrop, Container, ContentContainer, Wrapper } from './styles'

type Props = {
  title: string
  description: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const ConfirmContext = createContext(
  {} as {
    props: Props | null
    setProps: SetState<Props | null>
  }
)

export const ConfirmProvider: FC = ({ children }) => {
  const [props, setProps] = useState<Props | null>(null)

  const close = useCallback(() => setProps(null), [])

  const handleConfirm = useCallback(() => {
    props?.onConfirm?.()
    close()
  }, [close, props])

  const handleCancel = useCallback(() => {
    props?.onCancel?.()
    close()
  }, [close, props])

  useEffect(() => {
    if (!props) return

    const keyListener = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key.toUpperCase() === 'S' || e.key === 'Enter') handleConfirm()
      else if (e.key.toUpperCase() === 'N' || e.key === 'Escape') handleCancel()
    }

    document.addEventListener('keydown', keyListener)

    return () => document.removeEventListener('keydown', keyListener)
  }, [handleCancel, handleConfirm, props])

  return (
    <ConfirmContext.Provider value={{ props, setProps }}>
      {props && (
        <Wrapper>
          <Backdrop onClick={handleCancel} />
          <Container>
            <Backdrop onClick={handleCancel} />
            <ContentContainer>
              <h2>{props.title}</h2>
              <p>{props.description}</p>
              <div className="buttons-container">
                <button className="cancel" onClick={handleCancel}>
                  <u>N</u>ão
                </button>
                <div className="spacer" />
                <button className="confirm" onClick={handleConfirm}>
                  <u>S</u>im
                </button>
              </div>
            </ContentContainer>
            <Backdrop onClick={handleCancel} />
          </Container>
          <Backdrop onClick={handleCancel} />
        </Wrapper>
      )}
      {children}
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => {
  const { setProps } = useContext(ConfirmContext)
  return { confirm: setProps }
}
