import React, { ReactElement, useState, useEffect } from 'react';
import ChartController from './BarChart/BarChartController';

import { queryCantabularGraphQL, ApiVariable, VariablesResponse } from '../helpers/cantabular';
import { VARIABLES_QUERY, ENDPOINT, DATASET } from '../helpers/queries';

import './App.css';

const App = (): ReactElement => {
  const [variables, setVariables] = useState<ApiVariable[]>([]);

  useEffect(() => {
    async function getData() {
      const response = await queryCantabularGraphQL<VariablesResponse>(
        ENDPOINT,
        VARIABLES_QUERY,
        { 'dataset': DATASET },
      );
      // Only use variables with a reasonably
      // small number of categories
      if (response) {
        const vars = response.data.dataset.variables.edges.map((v): ApiVariable => {
          return v.node;
        }).filter(v => v.categories.totalCount < 100);
        setVariables(vars);
      }
    }
    getData();
  }, [ENDPOINT, DATASET]);

  if (variables.length === 0) {
    return <p className="loading">Loading ...</p>
  } else {
    return <ChartController variables={variables} />;
  }
}

export default App;
