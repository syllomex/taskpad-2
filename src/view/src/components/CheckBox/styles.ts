import styled from 'styled-components'

export const Container = styled.div`
  width: 16px;
  height: 16px;
  background: var(--color-regular);
  margin-right: 8px;
  border-radius: 2px;

  transition-duration: 0.2s;

  &:hover {
    opacity: 0.7;
  }
  &:active {
    opacity: 0.5;
  }

  .icon {
    color: var(--color-background);
  }
`
