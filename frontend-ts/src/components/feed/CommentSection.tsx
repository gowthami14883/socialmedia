import { FiArrowUpCircle } from "react-icons/fi";

interface Props {
  post: any;
  activeCommentPost: string | number | null;
  commentText: Record<string | number, string>;
  handleCommentChange: (id: string | number, value: string) => void;
  handleAddComment: (id: string | number) => void;
}

function PostComments({
  post,
  activeCommentPost,
  commentText,
  handleCommentChange,
  handleAddComment,
}: Props) {
  if (activeCommentPost !== post?.id) return null;

  return (
    <>
      <div className="ig-comments">
        {post?.commentCount > 0 && (
          <div className="comment-count">
            View all {post.commentCount} comments
          </div>
        )}

        {Array.isArray(post?.comments) &&
          post.comments.map((c: any) => (
            <div key={c?.comment_id} className="ig-comment">
              <b>{c.User?.username}</b> {c.text}
            </div>
          ))}
      </div>

      <div className="ig-add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText[post?.id] || ""}
          onChange={(e) => handleCommentChange(post?.id, e.target.value)}
        />

        <button onClick={() => handleAddComment(post?.id)}>
          <FiArrowUpCircle size={22} />
        </button>
      </div>
    </>
  );
}

export default PostComments;