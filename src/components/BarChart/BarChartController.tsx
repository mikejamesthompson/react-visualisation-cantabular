import React, { ReactElement, useState, useEffect } from 'react';
import { ApiVariable, ApiDimension, DataTable, queryCantabularGraphQL, processCounts, TableResponse } from '../../helpers/cantabular';
import { ENDPOINT, DATASET, TABLE_QUERY } from '../../helpers/queries';
import BarChartControls from './BarChartControls';
import BarChart from './BarChart';

type ChartProps = {
  variables: ApiVariable[],
}

const ChartController = (props: ChartProps): ReactElement => {
  const [currentVariableName, setCurrentVariableName] = useState(props.variables[0].name);
  const [data, setData] = useState<DataTable>([]);
  const [dimension, setDimension] = useState<ApiDimension>();

  useEffect(() => {
    async function updateData() {
      const response = await queryCantabularGraphQL<TableResponse>(
        ENDPOINT,
        TABLE_QUERY,
        { 'dataset': DATASET, 'variables': [currentVariableName] },
      );
      if (response) {
        const table = processCounts(response.data.dataset.table);
        setData(table);
        setDimension(response.data.dataset.table.dimensions[0]);
      }
    }
    updateData();
  }, [currentVariableName]);

  return (
    <div className="chart">
      <BarChartControls variables={props.variables} updateCurrentVariable={setCurrentVariableName} currentVariableName={currentVariableName} />
      <BarChart data={data} dimension={dimension} />
    </div>
  );

}

export default ChartController;
