
export const Directions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  // TODO: Implement UP and DOWN
  // UP: 'UP',
  // DOWN: 'DOWN',
} as const;

export type DirectionType = (typeof Directions)[keyof typeof Directions];
