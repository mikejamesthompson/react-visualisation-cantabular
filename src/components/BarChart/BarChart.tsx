import React, { ReactElement, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { ApiDimension, DataTable, TableRow } from '../../helpers/cantabular';
import { Tooltip, TooltipSettings } from '../Tooltip/Tooltip';

import './BarChart.css';

type Props = {
  data: DataTable,
  dimension: ApiDimension,
};

const BarChart = ({ data, dimension }: Props): ReactElement => {
  const [tooltip, setTooltip] = useState<TooltipSettings>({
    label: '',
    value: 0,
    visible: false,
  });

  const height = 600;
  const width = 960;
  const padding = {
    top: 20, right: 20, bottom: 50, left: 60,
  };
  const innerWidth = width - (padding.left + padding.right);
  const barWidth = innerWidth / data.length;

  const values = data.map((d) => d.value);

  const xScale = scaleLinear()
    .domain([0, data.length])
    .range([padding.left, width - padding.right]);

  const yScale = scaleLinear()
    .domain([0, Math.max(...values)])
    .range([height - padding.bottom, padding.top]);

  function handleMouseEnter(d: TableRow, i: number) {
    setTooltip({
      label: dimension.categories[i].label,
      value: d.value,
      visible: true,
    });
  }

  function handleMouseLeave() {
    setTooltip({
      ...tooltip,
      visible: false,
    });
  }

  function makeTickClasses(nth: number, total: number): string {
    const classes = ['tick'];
    if (nth % 2 === 0) classes.push('text-2n');
    if (nth % 3 === 0) classes.push('text-3n');
    if (total > 60) {
      classes.push('hide-twothirds');
    } else if (total > 30) {
      classes.push('hide-half');
    }
    return classes.join(' ');
  }

  return (
    <div className="chart__container">
      <svg viewBox={`0 0 ${width} ${height}`} className="chart__svg">
        <g className="axis y-axis">
          {yScale.ticks().map((tick, i) => (
            <g className="tick" transform={`translate(0, ${yScale(tick)})`} key={tick}>
              <line x2="100%" className={i === 0 ? 'axis__line' : ''} />
              <text y="-4">{format('~s')(tick)}</text>
            </g>
          ))}
        </g>

        <g className="axis x-axis">
          {dimension.categories.map((tick, i) => (
            <g
              className={makeTickClasses(i, dimension.categories.length)}
              transform={`translate(${xScale(i) + barWidth / 2}, ${height - padding.bottom + padding.top})`}
              key={dimension.categories[i].code}
            >
              <line y1={`${-padding.top}`} y2={`${12 - padding.top}`} className="axis__line" />
              <text y="6" x="-4">{tick.label}</text>
            </g>
          ))}
        </g>

        <g className="bars">
          {data.map((d, i) => (
            <rect
              x={xScale(i) + 2}
              y={yScale(d.value)}
              width={barWidth - 4}
              height={yScale(0) - yScale(d.value)}
              key={i}
              onMouseEnter={() => handleMouseEnter(d, i)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </g>
      </svg>
      <Tooltip content={tooltip} />
    </div>
  );
};

export default BarChart;
