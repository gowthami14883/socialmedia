import { API_BASE_URL, API_ENDPOINTS } from "./config";

describe("API config", () => {
  it("uses the local backend base url", () => {
    expect(API_BASE_URL).toBe("http://localhost:3000");
  });

  it("builds all endpoint urls from the same base url", () => {
    expect(API_ENDPOINTS).toEqual({
      LOGIN: "http://localhost:3000/api/users/login",
      REGISTER: "http://localhost:3000/api/users/register",
      PROFILE: "http://localhost:3000/api/users/me",
      POSTS: "http://localhost:3000/api/posts",
      CHATS: "http://localhost:3000/api/chats",
      LIKES: "http://localhost:3000/api/likes",
      COMMENT: "http://localhost:3000/api/comments",
    });
  });
});
