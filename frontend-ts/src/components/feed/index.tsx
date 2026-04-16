import { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../../api/config";
import FeedPost from "./FeedPost";
import "./feed.css";

interface FeedProps {
  page: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Comment {
  comment_id: number;
  text: string;
  User?: {
    username: string;
  };
}

interface Post {
  id: number;
  isStatic: boolean;
  user: any;
  avatar: string;
  media: string[];
  caption: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  commentCount: number;
}

function Feed({ page, setTotalPages, loading, setLoading }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentText, setCommentText] = useState<Record<string | number, string>>({});
  const [activeCommentPost, setActiveCommentPost] = useState<string | number | null>(null);

  const limit = 5;
  const token = localStorage.getItem("token");
  // const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ==============================
  // Fetch Posts (Pagination)
  // ==============================
  const fetchPosts = async () => {
    try {
      if (loading) return;
      setLoading(true);

      const res = await api.get(
        `${API_ENDPOINTS.POSTS}?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const responseData = res?.data?.data;
      setTotalPages(responseData?.totalPages || 1);

      const dynamicPosts: Post[] = await Promise.all(
        (responseData?.posts || []).map(async (post: any) => {
          // Fetch Likes
          const likeRes = await api.get(
            `${API_ENDPOINTS.LIKES}/post/${post?.post_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const likesData = likeRes?.data?.data || {};
          const likeCount = likesData?.likeCount || 0;
          const isLiked = likesData?.isLiked || false;

          // Fetch Comments
          const commentRes = await api.get(
            `${API_ENDPOINTS.COMMENT}/post/${post?.post_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const commentData = commentRes?.data?.data || {};
          const commentsArray = commentData?.comments || [];
          const commentCount = commentData?.commentCount || 0;

          return {
            id: post?.post_id,
            isStatic: false,
            user: post?.User || "Unknown",
            avatar: "https://i.pravatar.cc/150?img=10",
            media: post?.media_url
              ? post.media_url.map((url: string) => `${API_BASE_URL}${url}`)
              : [],
            caption: post?.caption,
            likes: likeCount,
            liked: isLiked,
            comments: commentsArray,
            commentCount: commentCount,
          };
        })
      );

      setPosts((prev) => {
        const newPosts = dynamicPosts.filter(
          (p) => !prev.some((existing) => existing.id === p.id)
        );
        return [...prev, ...newPosts];
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  // ==============================
  // Fetch Comments for Single Post
  // ==============================
  const fetchCommentsForPost = async (postId: string | number) => {
    try {
      const res = await api.get(`${API_ENDPOINTS.COMMENT}/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const commentData = res?.data?.data || {};
      const commentsArray = commentData?.comments || [];
      const commentCount = commentData?.commentCount || 0;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: commentsArray, commentCount } : p
        )
      );
    } catch (err) {
      console.error("Fetch single post comments error:", err);
    }
  };

  // ==============================
  // Like / Unlike
  // ==============================
  const handleLike = async (postId: string | number, liked: boolean) => {
    try {
      if (liked) {
        await api.delete(`${API_ENDPOINTS.LIKES}/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(
          `${API_ENDPOINTS.LIKES}/${postId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, liked: !liked, likes: liked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ==============================
  // Add Comment
  // ==============================
  const handleAddComment = async (postId: string | number) => {
    if (!commentText[postId]?.trim()) return;

    try {
      const res = await api.post(
        `${API_ENDPOINTS.COMMENT}/${postId}`,
        { text: commentText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCommentData = res?.data?.data;
      if (!newCommentData) return;

      const newComment: Comment = {
        comment_id: Date.now(),
        text: newCommentData.comment,
        User: newCommentData.commented_by
          ? { username: newCommentData.commented_by.username }
          : { username: "Unknown" },
      };

      setCommentText((prev) => ({ ...prev, [postId]: "" }));

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
                commentCount: (post.commentCount || 0) + 1,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleCommentChange = (id: string | number, value: string) => {
    setCommentText((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="ig-feed">
      {posts.map((post, index) => (
        <FeedPost
          key={`${post.id}-${index}`}
          post={post}
          handleLike={handleLike}
          activeCommentPost={activeCommentPost}
          setActiveCommentPost={setActiveCommentPost}
          fetchCommentsForPost={fetchCommentsForPost}
          commentText={commentText}
          handleCommentChange={handleCommentChange}
          handleAddComment={handleAddComment}
        />
      ))}

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
    </div>
  );
}

export default Feed;