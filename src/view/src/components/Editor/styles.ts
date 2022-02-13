import styled from 'styled-components'

export const Container = styled.div`
  color: var(--color-regular);
  width: 90%;
  margin: 0 auto;
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

export const LineContainer = styled.div<{
  checked: boolean
  selected: boolean
}>`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition-duration: 0.2s;
  outline: 0;

  span {
    flex: 1;
    outline: 0;
  }

  ${({ checked }) => checked && 'text-decoration: line-through; opacity: 0.7;'}
  ${({ selected }) =>
    selected && 'background-color: var(--color-background-dark);'}

  &:hover {
    background-color: var(--color-background-dark);
  }
`
