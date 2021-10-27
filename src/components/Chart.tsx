import React, { ReactElement, useState, useEffect } from 'react';
import { ApiVariable, TableResponse, DataTable, processCounts, queryCantabularGraphQL } from '../helpers/cantabular';
import { TABLE_QUERY, ENDPOINT, DATASET } from '../helpers/queries';

type props = {
  variable: ApiVariable
}

const ChartVisuals = (props: props): ReactElement => {
  const [data, setData] = useState<DataTable>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const response = await queryCantabularGraphQL<TableResponse>(
        ENDPOINT,
        TABLE_QUERY,
        { 'dataset': DATASET, 'variables': [props.variable.name] },
      );
      if (response) {
        const table = processCounts(response.data.dataset.table);
        setLoading(false);
        setData(table);
      }
    }
    getData();
  }, [props.variable]);

  if (loading) {
    return <p>Loading ...</p>;
  } else {
    return (
      <table>
        <tbody>
          <tr><th>{props.variable.label}</th><th>Count</th></tr>
        {data.map((row, i) =>
          <tr key={i}><td>{row[props.variable.label]}</td><td>{row.value}</td></tr>
        )}
        </tbody>
      </table>
    );
  }
}

export default ChartVisuals;