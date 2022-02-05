import { useCallback } from 'react'
import { usePads } from '../pads'

export const usePad = () => {
  const { pads, setPads, selectedPadId: id } = usePads()

  const padIndex = pads.findIndex((pad) => pad.id === id)
  const pad = id ? pads[padIndex] : null

  const updateTitle = useCallback(
    (newTitle: string) => {
      setPads((cur) =>
        !pad
          ? cur
          : [
              ...[...cur].splice(0, padIndex),
              {
                ...pad,
                title: newTitle
              },
              ...[...cur].splice(padIndex + 1)
            ]
      )
    },
    [pad, padIndex, setPads]
  )

  return {
    pad,
    updateTitle
  }
}
