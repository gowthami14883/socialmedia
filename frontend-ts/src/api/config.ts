// export const API_BASE_URL: string = "http://192.168.12.26:3000";
export const API_BASE_URL: string = "http://localhost:3000";

interface ApiEndpoints {
  LOGIN: string;
  REGISTER: string;
  PROFILE: string;
  POSTS: string;
  CHATS: string;
  LIKES: string;
  COMMENT: string;
}

export const API_ENDPOINTS: ApiEndpoints = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  PROFILE: `${API_BASE_URL}/api/users/me`,
  POSTS: `${API_BASE_URL}/api/posts`,
  CHATS: `${API_BASE_URL}/api/chats`,
  LIKES: `${API_BASE_URL}/api/likes`,
  COMMENT: `${API_BASE_URL}/api/comments`,
};