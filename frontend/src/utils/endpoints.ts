const BASE_URL: string = import.meta.env.VITE_API_URL || ``;
console.log('BASE_URL:', BASE_URL);

const requests = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  transactionData: `${BASE_URL}/transactions`,
};

export default requests; 