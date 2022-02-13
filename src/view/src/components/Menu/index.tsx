import {
  DragEvent,
  FC,
  MouseEvent,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Pad, useConfirm, usePad, usePads } from '../../store'
import { BottomMenu } from '../BottomMenu'

import { Circle, CircleContainer, Container, MenuWrapper } from './styles'

export const Item: FC<{
  pad: Pad
  onRequestScroll(direction: 'up' | 'down' | null): void
  containerRef: RefObject<HTMLDivElement>
  scrollY: MutableRefObject<number>
}> = ({ pad, onRequestScroll, scrollY, containerRef }) => {
  const ref = useRef<HTMLDivElement>(null)

  const { confirm } = useConfirm()

  const {
    pads,
    movingPadId,
    setMovingPadId,
    movingOverPadId,
    setMovingOverPadId,
    dropDirection,
    setDropDirection,
    setMouseOverPadId,
    deletePad,
    selectPad,
    selectedPadId
  } = usePads()

  const { unselectItem } = usePad()

  const isMovingOther = movingPadId && movingPadId !== pad.id

  useEffect(() => {
    if (!ref.current) return
    if (!movingPadId) {
      ref.current.style.transform = 'translateY(0px)'
    }

    const mouseOverIndex = pads.findIndex(({ id }) => id === movingOverPadId)
    const movingIndex = pads.findIndex(({ id }) => id === movingPadId)
    const currentCircleIndex = pads.findIndex(({ id }) => id === pad.id)

    const shouldDropAbove = dropDirection === 'up'
    const shouldDropBelow = dropDirection === 'down'

    if (mouseOverIndex === -1) {
      return
    } else if (mouseOverIndex === movingIndex - 1 && shouldDropBelow) {
      return
    } else if (mouseOverIndex === movingIndex + 1 && shouldDropAbove) {
      ref.current.style.transform = 'translateY(0px)'
      return
    }

    if (currentCircleIndex === movingIndex) {
      // MOVE THE CIRCLE TO ANOTHER POSITIONS
      if (mouseOverIndex < movingIndex && shouldDropAbove) {
        const diff = movingIndex - mouseOverIndex
        ref.current.style.transform = `translateY(-${diff * 40}px)`
      } else if (mouseOverIndex < movingIndex && shouldDropBelow) {
        const diff = movingIndex - mouseOverIndex
        ref.current.style.transform = `translateY(-${(diff - 1) * 40}px)`
      } else if (mouseOverIndex > movingIndex && shouldDropBelow) {
        const diff = mouseOverIndex - movingIndex
        ref.current.style.transform = `translateY(${diff * 40}px)`
      } else if (mouseOverIndex > movingIndex && shouldDropAbove) {
        const diff = mouseOverIndex - movingIndex
        ref.current.style.transform = `translateY(${(diff - 1) * 40}px)`
      } else {
        ref.current.style.transform = 'translateY(0px)'
      }
    } else {
      // MOVING CIRCLE UP
      if (currentCircleIndex < movingIndex) {
        if (shouldDropAbove) {
          if (currentCircleIndex > mouseOverIndex - 1) {
            ref.current.style.transform = 'translateY(40px)'
          } else {
            ref.current.style.transform = 'translateY(0px)'
          }
        } else if (shouldDropBelow) {
          if (currentCircleIndex > mouseOverIndex) {
            ref.current.style.transform = 'translateY(40px)'
          } else {
            ref.current.style.transform = 'translateY(0px)'
          }
        } else {
          ref.current.style.transform = 'translateY(0px)'
        }
      } else if (currentCircleIndex > movingIndex) {
        // MOVING CIRCLE DOWN
        if (shouldDropBelow) {
          if (currentCircleIndex < mouseOverIndex + 1) {
            ref.current.style.transform = 'translateY(-40px)'
          } else {
            ref.current.style.transform = 'translateY(0px)'
          }
        } else if (shouldDropAbove) {
          if (currentCircleIndex < mouseOverIndex) {
            ref.current.style.transform = 'translateY(-40px)'
          } else {
            ref.current.style.transform = 'translateY(0px)'
          }
        } else {
          ref.current.style.transform = 'translateY(0px)'
        }
      } else {
        ref.current.style.transform = 'translateY(0px)'
      }
    }
  }, [dropDirection, isMovingOther, movingOverPadId, movingPadId, pad.id, pads])

  const className = (() => {
    if (selectedPadId === pad.id) return 'selected'
    return ''
  })()

  const onMouseMove = useMemo(() => {
    if (!movingPadId) return undefined

    return (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!movingPadId) return
      if (movingPadId === pad.id) return

      const { clientY, currentTarget } = e

      const scrollThreshold = 50

      if (clientY < scrollThreshold) {
        onRequestScroll('up')
      } else if (
        containerRef.current &&
        clientY > containerRef.current?.clientHeight - scrollThreshold
      ) {
        onRequestScroll('down')
      } else {
        onRequestScroll(null)
      }

      const circleCenter =
        currentTarget.offsetTop +
        currentTarget.offsetHeight / 2 -
        scrollY.current

      if (clientY < circleCenter) {
        setDropDirection('up')
      } else {
        setDropDirection('down')
      }

      setMovingOverPadId(pad.id)
    }
  }, [
    containerRef,
    movingPadId,
    onRequestScroll,
    pad.id,
    scrollY,
    setDropDirection,
    setMovingOverPadId
  ])

  const handleDeletePad = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      ev.preventDefault()
      confirm({
        title: 'Excluir página',
        description: 'Tem certeza de que deseja excluir essa página?',
        onConfirm: () => deletePad(pad.id)
      })
    },
    [confirm, deletePad, pad.id]
  )

  return (
    <CircleContainer
      ref={ref}
      key={pad.id}
      onMouseMove={onMouseMove}
      className={movingPadId ? 'with-transition' : ''}
      draggable
      onDragStart={(e) => {
        e.preventDefault()
        setMovingPadId(pad.id)
      }}
      onMouseEnter={() => setMouseOverPadId(pad.id)}
      onMouseLeave={() => setMouseOverPadId(null)}
      onContextMenu={handleDeletePad}
      onClick={() => {
        selectPad(pad.id)
        unselectItem()
      }}
    >
      <Circle className={className} />
    </CircleContainer>
  )
}

export const Menu: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { pads, movingPadId, setMovingOverPadId, setDropDirection } = usePads()
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
    null
  )
  const scrollY = useRef(0)

  const handleScroll = useCallback((direction: 'up' | 'down' | null) => {
    if (!containerRef.current) return

    if (!direction) return setScrollDirection(null)

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current

    const minScroll = 0
    const maxScroll = scrollHeight - clientHeight

    const isOnTop = scrollTop === minScroll
    const isOnBottom = scrollTop === maxScroll

    const canScroll = !(
      (isOnTop && direction === 'up') ||
      (isOnBottom && direction === 'down')
    )

    if (!canScroll) return setScrollDirection(null)
    setScrollDirection(direction)
  }, [])

  useEffect(() => {
    if (!scrollDirection) return

    const scrollAmount = 2

    const interval = setInterval(() => {
      if (!containerRef.current) return
      containerRef.current.scrollBy({
        behavior: 'auto',
        top: scrollDirection === 'up' ? -scrollAmount : scrollAmount
      })
    }, 10)

    return () => clearInterval(interval)
  }, [scrollDirection])

  useEffect(() => {
    if (!movingPadId) return setScrollDirection(null)
  }, [movingPadId])

  return (
    <MenuWrapper>
      <Container
        ref={containerRef}
        onScroll={(ev) => {
          scrollY.current = ev.currentTarget.scrollTop
        }}
      >
        {pads.map((pad) => {
          return (
            <Item
              pad={pad}
              key={pad.id.toString()}
              onRequestScroll={handleScroll}
              scrollY={scrollY}
              containerRef={containerRef}
            />
          )
        })}

        <div
          style={{ flexGrow: 1 }}
          onMouseMove={() => {
            if (!movingPadId) return
            setMovingOverPadId(pads[pads.length - 1].id)
            setDropDirection('down')
          }}
        />
      </Container>
      <BottomMenu />
    </MenuWrapper>
  )
}
