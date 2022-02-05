import styled from 'styled-components'

export const FloatingSpan = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;

  z-index: 50;

  color: var(--color-regular);
  background-color: var(--color-background-dark);
  border-radius: 8px;
  padding: 8px;

  display: none;
  user-select: none;
`
