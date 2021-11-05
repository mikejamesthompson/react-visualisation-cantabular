import React, { ReactElement, useEffect, useState } from "react";
import { format } from 'd3-format';

import './Tooltip.css';

type Props = {
  content: TooltipSettings
}

export type TooltipSettings = {
  label: string,
  value: number,
  visible: boolean,
}

type MousePosition = {
  x: number,
  y: number,
}

export const Tooltip = (props: Props): ReactElement | null => {
  const [pos, setPos] = useState<MousePosition>({x: 0, y: 0});

  function handleMouseMove(event: MouseEvent) {
    setPos({
      x: event.clientX,
      y: event.clientY,
    });
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove)
  });

  const thousands = (n: number) => format(',')(n);

  if (props.content.visible) {
    return (
      <div className='tooltip' style={{transform: `translate(${pos.x + 10}px, ${pos.y + 10}px)`}}>
        <h3>{props.content.label}</h3>
        <p>{thousands(props.content.value)}</p>
      </div>
    );
  } else {
    return null;
  }
}