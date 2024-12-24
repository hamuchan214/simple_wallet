const BASE_URL = import.meta.env.BASE_URL;

const requests = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  // 他のエンドポイントをここに追加
};

export default requests; 