import * as d3 from 'd3';

export type QueryResponse<T> = {
  data: T,
  errors?: any,
}

export type VariablesResponse = {
  dataset: {
    variables: {
      edges: Array<{
        node: ApiVariable
      }>
    }
  }
}

export type TableResponse = {
  dataset: {
    table: ApiTable
  }
}

export type ApiCategory = {
  code: string,
  label: string,
}

export type ApiVariable = {
  name: string,
  label: string,
}

type ApiTable = {
  dimensions: Array<{
    count: number,
    categories: ApiCategory[],
    variable: ApiVariable,
  }>,
  values: number[],
};

type TableRow = {
  [key: string]: string,
} & { value?: number };

export type DataTable = TableRow[];

export async function queryCantabularGraphQL<T>(
  url: string,
  query: string,
  variables: { [key: string]: string | string[] },
): Promise<QueryResponse<T> | undefined> {
  return await d3.json(url, {
    body: JSON.stringify({
      "query": query,
      "variables": variables,
    }),
    headers: {"Content-Type": "application/json"},
    method: "POST",
    mode: "cors"
  });
}

export function processCounts(table: ApiTable) {
  const dimLengths = table.dimensions.map((d) => d.count);
  const dimIndices = table.dimensions.map(() => 0);
  let result = [];
  for (let i = 0; i < table.values.length; i++) {
    result.push(populateRow(table, dimIndices, i));
    let j = dimIndices.length - 1;
    while (j >= 0) {
      dimIndices[j] += 1;
      if (dimIndices[j] < dimLengths[j]) break;
      dimIndices[j] = 0;
      j -= 1;
    }
  }
  return result;
}

export function populateRow(table: ApiTable, indices: number[], n: number) {
  const obj: TableRow = {};
  indices.forEach((index, i) => {
    const dim = table.dimensions[i];
    obj[dim.variable.label] = dim.categories[index].label;
  });
  obj['value'] = table.values[n];
  return obj;
}