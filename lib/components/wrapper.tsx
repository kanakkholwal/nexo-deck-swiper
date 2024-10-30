"use client";
import * as React from 'react';

import { DirectionType } from '../constants.ts';
import type { EventReturnType, EventType } from "../types.ts";
import {
    getDirection,
    getEvent,
    getLimitOffset,
    getOffset,
    withX,
} from '../utils.ts';

import Swipeable from './index.tsx';

const INITIAL_STATE = {
    start: 0,
    offset: 0,
    forced: false,
    swiped: false,
    moving: false,
    pristine: true,
};

export interface RenderButtonsPayload {
    right: () => void,
    left: () => void,
}

export interface SwipeableWrapperProps {
    children: React.ReactNode,
    renderButtons?: (payload: RenderButtonsPayload) => React.ReactNode;
    onBeforeSwipe?: (
        forceSwipe: (direction: DirectionType) => void,
        cancelSwipe: () => void,
        direction: DirectionType,
    ) => void,
    onSwipe?: (
        direction: DirectionType,
    ) => void,
    onOpacityChange?: (opacity: number) => void,
    onAfterSwipe?: () => void,
    wrapperHeight?: string,
    wrapperWidth?: string,
    swipeThreshold?: number,
    fadeThreshold?: number,
}

export interface SwipeableState {
    pristine: boolean,
    moving: boolean,
    forced: boolean,
    swiped: boolean,
    offset: number,
    start: number,
}

const SwipeableWrapper = (props: SwipeableWrapperProps) => {
    const [state, setState] = React.useState<SwipeableState>(INITIAL_STATE);

    const stateRef = React.useRef(state);

    stateRef.current = state;

    const {
        swipeThreshold = 120,
        onBeforeSwipe,
        onAfterSwipe,
        onSwipe,
    } = props;

    const handleResetState = React.useCallback(() => {
        setState(INITIAL_STATE);

        setState({
            ...stateRef.current,
            offset: 0,
            start: 0,
        });
    }, []);

    const handleOnAfterSwipe = React.useCallback(() => {
        if (onAfterSwipe) {
            onAfterSwipe();
        }

        handleResetState();
    }, [
        handleResetState,
        onAfterSwipe,
    ]);

    const handleOnSwipe = React.useCallback((direction: DirectionType) => {
        if (onSwipe) {
            onSwipe(direction);
        }

        setState({
            ...stateRef.current,
            offset: getLimitOffset(swipeThreshold, direction),
            moving: false,
            swiped: true,
        });

        handleOnAfterSwipe();
    }, [
        handleOnAfterSwipe,
        swipeThreshold,
        onSwipe,
    ]);

    const handleOnBeforeSwipe = React.useCallback((direction: DirectionType) => {
        if (!onBeforeSwipe) {
            handleOnSwipe(direction);
            return;
        }

        onBeforeSwipe(
            (_direction: DirectionType) => handleOnSwipe(_direction || direction),
            handleResetState,
            direction,
        );
    }, [
        handleResetState,
        onBeforeSwipe,
        handleOnSwipe,
    ]);

    const handleOnDragStart = React.useCallback((e: EventType): EventReturnType => {
        if (stateRef.current.swiped) {
            return {} as EventReturnType; // Return an appropriate value
        }

        const start = getEvent(e).pageX; // Assuming you want to use pageX for the start
        setState(prevState => ({
            ...prevState,
            pristine: false,
            moving: true,
            start,
        }));

        return {} as EventReturnType; // Return an appropriate value here
    }, []);


    const handleOnDragEnd = React.useCallback(() => {
        if (stateRef.current.swiped || !stateRef.current.moving) {
            return;
        }

        if (Math.abs(stateRef.current.offset) >= swipeThreshold) {
            handleOnBeforeSwipe(getDirection(stateRef.current.offset));
            return;
        }

        handleResetState();
    }, [
        handleOnBeforeSwipe,
        handleResetState,
        swipeThreshold,
    ]);

    const handleOnDragMove = React.useCallback(withX(
        (end: number) => {
            if (stateRef.current.swiped || !stateRef.current.moving) {
                return;
            }

            setState({
                ...stateRef.current,
                offset: getOffset(stateRef.current.start, end),
            });
        }), []);


    const handleForceSwipe = React.useCallback((direction: DirectionType) => {
        if (stateRef.current.swiped) {
            return;
        }

        setState({
            ...stateRef.current,
            pristine: false,
            forced: true,
        });

        handleOnBeforeSwipe(direction);
    }, [
        handleOnBeforeSwipe,
    ]);

    React.useEffect(() => {
        const onDragMove = (e: Event) => handleOnDragMove(e as unknown as EventType);
        const onDragEnd = () => handleOnDragEnd();

        window.addEventListener('touchmove', onDragMove);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('touchend', onDragEnd);
        window.addEventListener('mouseup', onDragEnd);

        return () => {
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('touchend', onDragEnd);
            window.removeEventListener('mouseup', onDragEnd);
        };
    }, [handleOnDragMove, handleOnDragEnd]);



    return (
        <Swipeable
            handleOnDragStart={handleOnDragStart}
            handleForceSwipe={handleForceSwipe}
            state={stateRef.current}
            {...props}
        />
    );
};

export default SwipeableWrapper;