export interface User {
  user_id: number;
  username: string;
  bio?: string;
}

export interface Post {
  post_id: number;
  media_url?: string;
  caption?: string;
}

export interface Follower {
  follower_user_id: number;
  FollowerUser: User;
}

export interface Following {
  follower_id: number;
  FollowingUser: User;
}

export interface ProfileType {
  user_id: number;
  username: string;
  bio?: string;

  // Nested user info (optional)
  User?: {
    bio?: string;
  };

  Posts: Post[];
  Followers: Follower[];
  Following: Following[];
}