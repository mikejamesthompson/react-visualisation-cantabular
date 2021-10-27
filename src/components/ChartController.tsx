import React, { ChangeEvent, ReactElement, useState, useMemo } from 'react';
import { ApiVariable } from '../helpers/cantabular';
import Chart from './Chart';

type ChartProps = {
  variables: ApiVariable[],
}

const ChartController = (props: ChartProps): ReactElement => {
  const [currentVariable, setCurrentVariable] = useState<ApiVariable>(props.variables[0]);

  const variablesLookup = useMemo(() => {
    return props.variables.reduce((map: {[key: string]: string}, variable) => {
      map[variable.name] = variable.label;
      return map;
    }, {});
  }, [props.variables]);

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    setCurrentVariable({
      name: e.currentTarget.value,
      label: variablesLookup[e.currentTarget.value],
    });
  }

  return (<>
    <select onChange={handleChange} value={currentVariable.name}>
      {props.variables.map((v) =>
        <option key={v.name} value={v.name}>
          {v.label}
        </option>
      )};
    </select>
    <Chart variable={currentVariable} />
  </>);
}

export default ChartController;
