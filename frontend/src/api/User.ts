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
    } catch (error) {
        return {
            success: false,
            error: 'Login failed'
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