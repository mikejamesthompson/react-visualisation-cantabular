import React, { ReactElement } from 'react';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { ApiDimension, DataTable } from '../../helpers/cantabular';

import './BarChart.css';

type props = {
  data: DataTable,
  dimension?: ApiDimension,
}

const BarChart = (props: props): ReactElement => {
  if (props.data.length === 0) {
    return <p className="loading-indicator">Loading ...</p>
  }

  const height = 600;
  const width = 960;
  const padding = { top: 20, right: 20, bottom: 50, left: 60 };
  const innerWidth = width - (padding.left + padding.right);
  const barWidth = innerWidth/props.data.length;

  const values = props.data.map((d) => d.value);

  const xScale = scaleLinear()
      .domain([0, props.data.length])
      .range([padding.left, width - padding.right]);

  const yScale = scaleLinear()
      .domain([0, Math.max(...values)])
      .range([height - padding.bottom, padding.top]);

  let categories;
  if (props.dimension) {
    categories = props.dimension.categories.map((c) => c.label);
  } else {
    categories = xScale.ticks();
  }

  return (<svg viewBox='0 0 960 600' className='chart__svg'>
		<g className='axis y-axis'>
    {yScale.ticks().map((tick) =>
      <g className='tick' transform={`translate(0, ${yScale(tick)})`} key={tick}>
        <line x2="100%"></line>
        <text y="-4">{format('~s')(tick)}</text>
      </g>
    )}
    </g>

    <g className='axis x-axis'>
    {categories.map((tick, i) =>
      <g className='tick' transform={`translate(${xScale(i) + barWidth/2}, ${height-padding.bottom+padding.top})`} key={i}>
        <text y="-4">{tick}</text>
      </g>
    )}
    </g>

    <g className='bars'>
      {props.data.map((d, i) =>
        <rect
          x={xScale(i) + 2}
          y={yScale(d.value)}
          width={barWidth - 4}
          height={yScale(0) - yScale(d.value)}
          key={i}
        ></rect>
      )}
    </g>
  </svg>);
}

export default BarChart;