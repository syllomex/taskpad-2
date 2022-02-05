import styled from 'styled-components'

export const Container = styled.div`
  color: var(--color-regular);
  width: 90%;
  margin: 0 auto;
  user-select: none;
  padding: 32px 0;

  * {
    transition-duration: 0.2s;
  }
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
`
