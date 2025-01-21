import requests from "../utils/endpoints";
import axiosInstance, { setAuthToken } from "../utils/axios";
import { setSession } from "../lib/localStorage";
import { AxiosError } from "axios";

export const RequestLogin = async (
  username: string,
  password: string
): Promise<{
  success: boolean;
  username?: string;
  error?: string;
}> => {
  try {
    const request = {
      username: username,
      password: password,
    };

    const response = await axiosInstance.post(requests.login, request);

    if (response.status === 200) {
      const { token, id } = response.data;
      setAuthToken(token);
      setSession(token, id, username);

      return {
        success: true,
        username: username,
      };
    }
    return {
      success: false,
      error: "Login failed",
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status) {
      switch (error.response.status) {
        case 400:
          return {
            success: false,
            error: "ユーザー名またはパスワードが無効です",
          };
        case 409:
          return {
            success: false,
            error: "このユーザー名は既に使用されています",
          };
        default:
          return {
            success: false,
            error: "登録に失敗しました",
          };
      }
    }
    return {
      success: false,
      error: "サーバーに接続できません",
    };
  }
};

export const RequestRegister = async (
  username: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const request = {
      username: username,
      password: password,
    };

    const response = await axiosInstance.post(requests.register, request);

    if (response.status === 201) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: "Register failed",
    };
  } catch (_error) {
    return {
      success: false,
      error: "Register failed",
    };
  }
};
