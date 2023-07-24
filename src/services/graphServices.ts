import axios, { AxiosResponse } from 'axios';

export const fetchEvolutionGraph = async (
  productName?: string,
  limit?: number
) => {
  const session = localStorage.getItem('session');
  const token = session ? JSON.parse(session).token : '';
  const response = await axios
    .post(
      `http://localhost:8080/dashboard/graphs/2/${limit}`,
      {
        cnpj: '00111222000133',
        product_name: productName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
    .then((response: AxiosResponse) => response.data);

  return response;
};

fetchEvolutionGraph();
