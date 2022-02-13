export const insertBefore = <T = unknown>({
  array,
  beforeIndex,
  element
}: {
  array: T[]
  beforeIndex: number
  element: T
}): typeof array => {
  return [
    ...[...array].splice(0, beforeIndex),
    element,
    ...[...array].splice(beforeIndex)
  ]
}

export const insertAfter = <T = any>({
  array,
  afterIndex,
  element
}: {
  array: T[]
  afterIndex: number
  element: T
}): T[] => {
  return [
    ...[...array].splice(0, afterIndex + 1),
    element,
    ...[...array].splice(afterIndex + 1)
  ]
}

export const replaceIndex = <T = any>({
  array,
  item,
  index
}: {
  array: T[]
  item: T
  index: number
}) => {
  return [...[...array].splice(0, index), item, ...[...array].splice(index + 1)]
}
