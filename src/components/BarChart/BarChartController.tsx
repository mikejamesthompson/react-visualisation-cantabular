import React, { ReactElement, useState, useEffect } from 'react';
import { ApiVariable, ApiDimension, DataTable, queryCantabularGraphQL, processCounts, TableResponse } from '../../helpers/cantabular';
import { ENDPOINT, DATASET, TABLE_QUERY } from '../../helpers/queries';
import BarChartControls from './BarChartControls';
import BarChart from './BarChart';

type ChartProps = {
  variables: ApiVariable[],
}

const ChartController = (props: ChartProps): ReactElement => {
  const [currentVariableIndex, setCurrentVariableIndex] = useState(0);
  const [data, setData] = useState<DataTable>([]);
  const [dimension, setDimension] = useState<ApiDimension>();

  useEffect(() => {
    async function updateData() {
      const response = await queryCantabularGraphQL<TableResponse>(
        ENDPOINT,
        TABLE_QUERY,
        { 'dataset': DATASET, 'variables': [props.variables[currentVariableIndex].name] },
      );
      if (response) {
        const table = processCounts(response.data.dataset.table);
        setData(table);
        setDimension(response.data.dataset.table.dimensions[0]);
      }
    }
    updateData();
  }, [currentVariableIndex]);

  function barChart(): ReactElement {
    if (data.length === 0 || typeof dimension === 'undefined') {
      return <p className="loading">Loading ...</p>
    } else {
      return <BarChart data={data} dimension={dimension} />
    }
  }

  return (
    <div className="chart">
      <BarChartControls variables={props.variables} updateCurrentVariable={setCurrentVariableIndex} currentVariableIndex={currentVariableIndex} />
      {barChart()}
    </div>
  );

}

export default ChartController;
