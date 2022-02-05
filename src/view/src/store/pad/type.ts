export interface Line {
  type: 'line'
  id: string
  text: string
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
