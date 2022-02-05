import styled from 'styled-components'

export const FloatingNameSpan = styled.span`
  position: absolute;
  top: 0;
  left: 0;

  z-index: 50;

  color: var(--color-regular);
  background-color: var(--color-background-dark);
  border-radius: 8px;
  padding: 8px;
  opacity: 0.6;
`
