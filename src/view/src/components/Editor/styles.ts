import styled from 'styled-components'

export const Container = styled.div<{ withTransition: boolean }>`
  color: var(--color-regular);
  width: 100%;
  margin: 0 auto;
  padding: 32px 5% 0;

  display: flex;
  flex-direction: column;

  * {
    ${({ withTransition }) => withTransition && 'transition-duration: 0.2s'}
  }

  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--color-primary);
    &:hover {
      background-color: var(--color-primary-transparent-1);
    }
    &:active {
      background-color: var(--color-primary-transparent-2);
    }
  }
`

export const ContentContainer = styled.div<{ isMoving?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;

  ${({ isMoving }) => isMoving && 'user-select: none'}
`

export const TitleHeading = styled.h1`
  cursor: pointer;
  padding: 8px 16px;
  outline: 0;

  transition: background-color 0.2s;

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

export const LineWrapper = styled.div<{ isMoving?: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${({ isMoving }) => isMoving && 'opacity: 0.5'}
`

export const MoveContainer = styled.div`
  margin-left: -32px;
  width: 32px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding-top: 12px;

  opacity: 0;
  user-select: none;

  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.5;
  }
`

export const LineContainer = styled.div<{
  checked: boolean
  selected: boolean
  withTransition: boolean
}>`
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  flex: 1;

  outline: 0;

  .checkbox-container {
    margin-top: 2.25px;
  }

  word-wrap: break-word;
  width: 100%;

  transition: background-color 0.2s;

  span {
    flex: 1;
    outline: 0;
    width: 90%;
    white-space: pre-wrap;
  }

  ${({ checked }) => checked && 'text-decoration: line-through; opacity: 0.7;'}
  ${({ selected }) =>
    selected && 'background-color: var(--color-background-dark);'}

  &:hover {
    background-color: var(--color-background-dark);
  }

  @keyframes fade-in {
    from {
      transform: scaleY(0.8);
    }
    to {
      transform: scaleY(1);
    }
  }

  animation: fade-in 0.4s;
`
