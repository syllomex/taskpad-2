import { SetState } from '../../utils'

export interface PadsContextType {
  pads: Pad[]
  setPads: SetState<Pad[]>
  movingPadId: string | null
  setMovingPadId: SetState<string | null>
  movingOverPadId: string | null
  setMovingOverPadId: SetState<string | null>
  dropDirection: 'up' | 'down' | null
  setDropDirection: SetState<'up' | 'down' | null>
  mouseOverPadId: string | null
  setMouseOverPadId: SetState<string | null>
  selectedPadId: string | null
  setSelectedPadId: SetState<string | null>
}

export interface Item {
  id: string
  checked: boolean
  content: string
  createdAt: string
}

export interface Pad {
  id: string
  title: string
  items: Item[]
}
