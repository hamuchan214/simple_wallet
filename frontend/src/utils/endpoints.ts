const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const requests = {
  login: `${BASE_URL}/auth/login`,
  forgotPassword: `${BASE_URL}/auth/forgot-password`,
  // 他のエンドポイントをここに追加
};

export default requests; 