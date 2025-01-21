import axios from "axios";
import { logout } from "../lib/localStorage";

const BASE_URL: string = import.meta.env.VITE_API_URL || ``;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // トークンが無効な場合はログアウト
    if (error.response?.status === 401) {
      logout();
      // ログイン画面へリダイレクト
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// トークンを設定するための関数
export const setAuthToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// 起動時に保存されているトークンを設定
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default axiosInstance;
