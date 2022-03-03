export interface Line {
  type: 'line'
  id: string
  text: string
  checked: boolean
}

export interface Category {
  type: 'category'
  id: string
  lines: Line
}

export type Item = Line | Category

export interface PadContent {
  padId: string
  items: Item[]
}

export interface ItemHeight {
  itemId: string
  height: number
}
