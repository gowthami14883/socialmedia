export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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