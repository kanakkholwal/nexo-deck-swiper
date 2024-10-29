import { DirectionEnum } from './constants.ts';
import { EventType } from './types.ts';

// Determines direction based on the offset
export const getDirection = (offset: number): DirectionEnum => (
  offset > 0 ? DirectionEnum.RIGHT : DirectionEnum.LEFT
);

// Calculates offset with a scaling factor
export const getOffset = (start: number, end: number): number => -((start - end) * 0.75);


// Retrieves the event, supporting both touch and mouse events
export const getEvent = (e: EventType): MouseEvent | Touch => {
  const nativeEvent = e.nativeEvent;
  return nativeEvent instanceof TouchEvent ? nativeEvent.touches[0] : nativeEvent as MouseEvent;
};


// Returns a handler that passes only the pageX property to the given function
export const withX = (fn: (x: number) => void) => (e: EventType) => fn(getEvent(e).pageX);

// Gets the limited offset based on direction
export const getLimitOffset = (limit: number, direction: DirectionEnum): number => (
  direction === DirectionEnum.RIGHT ? limit : -limit
);

// Calculates opacity based on offset, limit, and minimum offset
export const getOpacity = (offset: number, limit: number, min: number): number => (
  1 - (Math.abs(offset) < min ? 0 : (Math.abs(offset) - min) / Math.abs(limit - min))
);