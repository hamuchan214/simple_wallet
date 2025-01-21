import requests from "../utils/endpoints";
import { getAuthToken } from "../lib/localStorage";
import { APITag, Tag } from "../model/apimodel";
import axiosInstance from "../utils/axios";
import { AxiosError } from "axios";

export const getTags = async (): Promise<{
  success: boolean;
  tags?: APITag[];
  error?: string;
}> => {
  try {
    const token = getAuthToken();

    const response = await axiosInstance.get(requests.tags, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return {
        success: true,
        tags: response.data,
      };
    }
    return {
      success: false,
      error: "Failed to fetch tags",
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status) {
      switch (error.response.status) {
        case 401:
          return {
            success: false,
            error: "Unauthorized",
          };
        case 500:
          return {
            success: false,
            error: "サーバーエラーが発生しました",
          };
      }
    }
    return {
      success: false,
      error: "サーバーに接続できません",
    };
  }
};

export const createTag = async (
  tag: Tag
): Promise<{
  success: boolean;
  tag?: APITag;
  error?: string;
}> => {
  try {
    const token = getAuthToken();

    const response = await axiosInstance.post(requests.tags, tag, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        tag: response.data,
      };
    }
    return {
      success: false,
      error: "Failed to create tag",
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status) {
      switch (error.response.status) {
        case 400:
          return {
            success: false,
            error: "Invalid input",
          };
        case 401:
          return {
            success: false,
            error: "Unauthorized",
          };
        case 409:
          return {
            success: false,
            error: "Tag already exists",
          };
      }
    }
  }
  return {
    success: false,
    error: "Failed to create tag",
  };
};

export const deleteTag = async (
  id: number
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const token = getAuthToken();

    const response = await axiosInstance.delete(`${requests.tags}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return {
        success: true,
      };
    }
    return {
      success: false,
      error: "Failed to delete tag",
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status) {
      switch (error.response.status) {
        case 401:
          return {
            success: false,
            error: "Unauthorized",
          };
        case 404:
          return {
            success: false,
            error: "Tag not found",
          };
      }
    }
  }
  return {
    success: false,
    error: "Failed to delete tag",
  };
};
