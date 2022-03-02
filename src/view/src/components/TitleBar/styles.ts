import styled from 'styled-components'

export const Container = styled.div`
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  height: 32px;
  position: absolute;
  top: 0;
  left: 50px;
  right: 0;

  color: var(--color-regular);

  .movable {
    display: flex;
    flex: 1;
    height: 100%;
    -webkit-user-select: none;
    user-select: none;
    -webkit-app-region: drag;
  }

  .icon-container {
    display: flex;
    align-items: center;
    padding: 16px 4px 8px;
    cursor: pointer;
    z-index: 5;
    user-select: all;
    opacity: 0.5;

    transition-duration: 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .icon {
    font-size: 28px;
  }
`
