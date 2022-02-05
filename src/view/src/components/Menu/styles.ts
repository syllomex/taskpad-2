import styled from 'styled-components'

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding: 8px 8px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  flex: 1;

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

  .moving {
  }

  .up {
  }

  .down {
  }
`

export const CircleContainer = styled.div`
  padding-bottom: 4px;
  cursor: pointer;
  user-select: none;
  padding-top: 4px;
`

export const Circle = styled.div`
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  flex-shrink: 0;

  transition-duration: 0.2s;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    opacity: 0.6;
    &::after {
      opacity: 0.7;
    }
  }

  &:active {
    opacity: 0.4;
    background-color: rgba(255, 255, 255, 0.1);
  }
`
