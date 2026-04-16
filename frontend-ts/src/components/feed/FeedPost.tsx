import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostActions from "./postActions";
import PostComments from "./CommentSection";

interface FeedPostProps {
  post: any;
  handleLike: (id: number, liked: boolean) => void;
  activeCommentPost: number | null;
  setActiveCommentPost: React.Dispatch<React.SetStateAction<number | null>>;
  fetchCommentsForPost: (id: number) => Promise<void>;
  commentText: Record<number, string>;
  handleCommentChange: (id: number, value: string) => void;
  handleAddComment: (id: number) => void;
}
function FeedPost({
  post,
  handleLike,
  activeCommentPost,
  setActiveCommentPost,
  fetchCommentsForPost,
  commentText,
  handleCommentChange,
  handleAddComment,
}: FeedPostProps) {

  const navigate = useNavigate();

  const [showHeart, setShowHeart] = useState(false);

  const handleLikeWithAnimation = () => {
    if (!post.liked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }

    handleLike(post.id, post.liked);
  };

  return (
    <div className="ig-post">

      <div
        onClick={() => navigate(`/dashboard/profile/${post.user.user_id}`)}
        style={{ cursor: "pointer" }}
      >
        <PostHeader avatar={post?.avatar} user={post?.user} />
      </div>

      <PostMedia post={post} showHeart={showHeart} />

      <PostActions
        post={post}
        handleLike={handleLikeWithAnimation}
        activeCommentPost={activeCommentPost}
        setActiveCommentPost={setActiveCommentPost}
        fetchCommentsForPost={fetchCommentsForPost}
      />

      <div className="ig-likes">{post?.likes} likes</div>

      <div className="ig-caption">
        <b>{post?.user?.username}</b> {post?.caption}
      </div>

      <PostComments
        post={post}
        activeCommentPost={activeCommentPost}
        commentText={commentText}
        handleCommentChange={handleCommentChange}
        handleAddComment={handleAddComment}
      />

    </div>
  );
}

export default FeedPost;