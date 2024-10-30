"use client";

import * as React from 'react';
import { animated, useSpring } from 'react-spring';

import { EventReturnType, EventType } from '../types.ts';
import { SwipeableState, SwipeableWrapperProps } from './wrapper.tsx';

import { DirectionType,Directions } from '../constants.ts';
import { getOpacity } from '../utils.ts';

export interface SwipeableProps extends SwipeableWrapperProps {
    handleForceSwipe: (direction: DirectionType) => void,
    handleOnDragStart: (e: EventType) => EventReturnType
    state: SwipeableState,
}

const Swipeable = ({
    wrapperHeight = '100%',
    wrapperWidth = '100%',
    swipeThreshold = 120,
    fadeThreshold = 40,
    handleOnDragStart,
    handleForceSwipe,
    onOpacityChange,
    renderButtons,
    children,
    state,
}: SwipeableProps) => {
    const springProps = useSpring({
        immediate: state.pristine || (!state.forced && Math.abs(state.offset) >= swipeThreshold),
        config: {
            tension: 390,
            friction: 30,
            restSpeedThreshold: 1,
            restDisplacementThreshold: 0.01,
            overshootClamping: true,
            lastVelocity: 1,
            mass: 0.1,
        },
        from: {
            opacity: 1,
            offset: 0,
        },
        to: {
            opacity: getOpacity(state.offset, swipeThreshold, fadeThreshold),
            offset: state.offset,
        },
    });

    // HACK: react-spring doesn't support Typescript in @8.0.0,
    // so we can't access properties from useSpring.

    const opacity = springProps['opacity'] as unknown as number;

    const offset = springProps['offset'] as unknown as number;

    const animatedStyle = {
        ...springProps,
        transform: `translateX(${offset}px) rotate(${(offset) / 10}deg)`,
        height: wrapperHeight,
        width: wrapperWidth,
        opacity,
    };

    React.useEffect(() => {
        if (onOpacityChange) {
            onOpacityChange(opacity);
        }
    }, [
        onOpacityChange,
        opacity,
    ]);

    return (
        <React.Fragment>
            <animated.div
                onTouchStart={handleOnDragStart}
                onMouseDown={handleOnDragStart}
                style={animatedStyle}
            >
                {children}
            </animated.div>

            {
                renderButtons && (
                    renderButtons({
                        right: () => handleForceSwipe(Directions.RIGHT),
                        left: () => handleForceSwipe(Directions.LEFT),
                    })
                )
            }
        </React.Fragment>
    );
};

export default Swipeable;