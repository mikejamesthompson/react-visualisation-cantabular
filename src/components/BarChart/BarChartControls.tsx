import React, { ReactElement, ChangeEvent } from 'react';
import { ApiVariable } from '../../helpers/cantabular';

type Props = {
  variables: ApiVariable[];
  currentVariableName: string;
  updateCurrentVariable: Function;
}

const BarChartControls = (props: Props): ReactElement => {

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    props.updateCurrentVariable(e.currentTarget.value)
  }

  return (
    <div className="chart__controls">
      <select onChange={handleChange} value={props.currentVariableName}>
        {props.variables.map((v) =>
          <option key={v.name} value={v.name}>
            {v.label}
          </option>
        )};
      </select>
    </div>
  );
}

export default BarChartControls;
