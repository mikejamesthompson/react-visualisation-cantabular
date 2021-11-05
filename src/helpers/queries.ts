export const ENDPOINT = 'https://api.ireland-census-preview.cantabular.com/graphql';
export const DATASET = 'Ireland-1911-preview';

export const TABLE_QUERY = `
  query($dataset: String!, $variables: [String!]!, $filters: [Filter!]) {
		dataset(name: $dataset) {
			table(variables: $variables, filters: $filters) {
				dimensions {
					count
					categories {
						code
						label
					}
					variable {
						name
						label
					}
				}
				values
			}
		}
	}
`.replace(/\s+/g, " ");

export const VARIABLES_QUERY = `
  query($dataset: String!) {
    dataset(name: $dataset) {
      variables {
        edges {
          node {
            name
            label
            categories {
              totalCount
            }
          }
        }
      }
    }
  }
`.replace(/\s+/g, " ");
