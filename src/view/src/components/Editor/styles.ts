import styled from 'styled-components'

export const Container = styled.div`
  color: var(--color-regular);
  width: 90%;
  margin: 0 auto;
  user-select: none;
  padding: 32px 0 0;

  display: flex;
  flex-direction: column;

  * {
    transition-duration: 0.2s;
  }
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0;
  }

`

export const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

`

export const TitleHeading = styled.h1`
  cursor: pointer;
  padding: 8px 16px;
  outline: 0;

  &.editing {
    cursor: auto;
  }

  &:hover,
  &.editing {
    background-color: var(--color-background-dark);
  }

  &:active {
    background-color: var(--color-background-darker);
  }

  margin-bottom: 16px;
`

export const TextEditor = styled.div`
  outline: 0;
  padding: 0 16px;
`

export const LineContainer = styled.div`
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-background-dark);
  }
`
