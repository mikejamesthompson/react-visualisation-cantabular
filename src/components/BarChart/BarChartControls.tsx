import React, { ReactElement, ChangeEvent } from 'react';
import { ApiVariable } from '../../helpers/cantabular';

type Props = {
  variables: ApiVariable[];
  currentVariableIndex: number;
  updateCurrentVariable: Function;
}

const BarChartControls = (props: Props): ReactElement => {

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    props.updateCurrentVariable(e.currentTarget.value)
  }

  return (
    <div className="chart__controls">
      <select onChange={handleChange} value={props.currentVariableIndex}>
        {props.variables.map((v, i) =>
          <option key={v.name} value={i}>
            {v.label}
          </option>
        )};
      </select>
    </div>
  );
}

export default BarChartControls;
