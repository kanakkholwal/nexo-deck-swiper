import * as React from "react";

export type EventType = React.TouchEvent | React.MouseEvent;
export type EventReturnType = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>