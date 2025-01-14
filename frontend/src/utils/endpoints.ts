const BASE_URL: string = import.meta.env.VITE_API_URL || ``;
console.log('BASE_URL:', BASE_URL);

const requests = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  transactions: `${BASE_URL}/transactions`,
  statistics: `${BASE_URL}/statistics`,
  tags: `${BASE_URL}/tags`,
};

export default requests; 