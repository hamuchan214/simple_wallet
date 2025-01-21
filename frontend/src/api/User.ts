import axios from "axios";
import requests from "../utils/endpoints";
import { setAuthToken } from "../utils/axios";
import { setSession } from "../lib/localStorage";

export const RequestLogin = async (username: string, password: string): Promise<{
    success: boolean;
    username?: string;
    error?: string;
}> => {
    try{
        const request = {
            username: username,
            password: password
        }

        const response = await axios.post(requests.login, request);
        
        if (response.status === 200) {
            const {token, id} = response.data;
            setAuthToken(token);
            setSession(token, id, username);

            return {
                success: true,
                username: username
            };
        }
        return {
            success: false,
            error: 'Login failed'
        };

    } catch (error: any) {

        if(error.response.status) {
            switch (error.response.status) {
                case 400:
                    return {
                        success: false,
                        error: 'ユーザー名またはパスワードが無効です'
                    };
                  case 409:
                    return{
                        success: false,
                        error: 'このユーザー名は既に使用されています'
                    };
                  default:
                    return{
                        success: false,
                        error: '登録に失敗しました'
                    };
            }
        }
        return {
            success: false,
            error: 'サーバーに接続できません'
        };
    }
}

export const RequestRegister = async (username: string, password: string): Promise<{
    success: boolean;
    error?: string;
}> => {
    try {
        const request = {
            username: username,
            password: password
        }

        const response = await axios.post(requests.register, request);

        if (response.status === 201) {
            return {
                success: true,
            };
        }

        return {
            success: false,
            error: 'Register failed'
        }

    }

    catch (error) {
        return {
            success: false,
            error: 'Register failed'
        }
    }
}
