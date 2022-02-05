import styled from 'styled-components'

export const Container = styled.div`
  padding: 16px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon {
    cursor: pointer;

    color: var(--color-muted);
    transition-duration: 0.2s;

    font-size: 24px;
    margin-bottom: 16px;

    &:hover {
      color: var(--color-primary);
    }
    &:active {
      opacity: 0.7;
    }
  }
`
