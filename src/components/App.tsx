import React, { ReactElement, useState, useEffect } from 'react';
import ChartController from './ChartController';

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
      if (response) {
        const vars = response.data.dataset.variables.edges.map((v): ApiVariable => {
          return {
            name: v.node.name,
            label: v.node.label,
          }
        });
        setVariables(vars);
      }
    }
    getData();
  }, [ENDPOINT, DATASET]);

  if (variables.length === 0) {
    return <p>Loading ...</p>
  } else {
    return <ChartController variables={variables} />;
  }
}

export default App;
