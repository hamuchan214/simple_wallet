const BASE_URL: string = import.meta.env.VITE_API_URL;
console.log('BASE_URL:', BASE_URL);

const requests = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  userData: `${BASE_URL}/user`,
};

export default requests; 