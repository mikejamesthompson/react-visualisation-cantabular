import React, { ReactElement, useState, useEffect } from 'react';
import ChartController from './BarChart/BarChartController';

import { queryCantabularGraphQL, ApiVariable, VariablesResponse } from '../helpers/cantabular';
import { VARIABLES_QUERY } from '../helpers/queries';

import './App.css';

type Props = {
  url: string,
  dataset: string,
};

const App = ({ url, dataset }: Props): ReactElement => {
  const [variables, setVariables] = useState<ApiVariable[]>([]);

  useEffect(() => {
    async function getData() {
      const response = await queryCantabularGraphQL<VariablesResponse>(
        url,
        VARIABLES_QUERY,
        { dataset },
      );
      // Only use variables with a reasonably
      // small number of categories
      if (response) {
        const vars = response.data.dataset.variables.edges.map(
          (v): ApiVariable => v.node,
        ).filter((v) => v.categories.totalCount < 100);
        setVariables(vars);
      }
    }
    getData();
  }, [url, dataset]);

  if (variables.length === 0) {
    return <p className="loading">Loading ...</p>;
  }
  return <ChartController variables={variables} />;
};

export default App;
