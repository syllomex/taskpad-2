import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-overlay);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  color: var(--color-regular);

  z-index: 100;
`

export const Backdrop = styled.div`
  /* opacity: 0.1; */
  flex: 1;
`

export const Container = styled.div`
  display: flex;
`

export const ContentContainer = styled.div`
  padding: 32px;
  background-color: var(--color-background-darker);
  border-radius: 4px;

  h2 {
    margin-bottom: 16px;
  }

  p {
  }

  div.buttons-container {
    display: flex;

    margin-top: 16px;

    .spacer {
      width: 8px;
    }
  }

  button {
    flex: 1;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 2px;
    color: var(--color-regular);
    border: 0;

    transition-duration: 0.2s;

    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.6;
    }
  }

  button.confirm {
    background-color: var(--color-primary);
  }

  button.cancel {
    background-color: var(--color-muted);
  }
`
