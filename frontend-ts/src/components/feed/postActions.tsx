import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";


interface Post{
    id:string|number;
    liked:boolean;
    commentCount:number;
    isStatic?:boolean;
}

interface Props {
  post: Post;
  handleLike: (postId:string|number,liked:boolean,isStatic?:boolean) => void;
  activeCommentPost: string|number | null;
  setActiveCommentPost: React.Dispatch<React.SetStateAction<string | number | null>>;
  fetchCommentsForPost: (postId: string | number) => Promise<void>;
}

function PostActions({
  post,
  handleLike,
  activeCommentPost,
  setActiveCommentPost,
  fetchCommentsForPost,
}: Props) {
  return (
    <div className="ig-actions">
      <span
        className={`like-btn ${post?.liked ? "liked" : ""}`}
        onClick={()=> handleLike(post.id,post.liked,post.isStatic)}
      >
        {post?.liked ? <FaHeart size={22} color="red" /> : <FaRegHeart size={22} />}
      </span>

      <span
        className="icon-btn comment-wrapper"
        onClick={async () => {
          const isOpening = activeCommentPost !== post?.id;

          setActiveCommentPost(activeCommentPost === post?.id ? null : post?.id);

          if (isOpening&& !post.isStatic) {
            await fetchCommentsForPost(post.id);
          }
        }}
      >
        <FaRegComment size={22} />

        {post?.commentCount > 0 && (
          <span className="comment-count-number">{post.commentCount}</span>
        )}
      </span>

      <span className="icon-btn">
        <FiSend size={22} />
      </span>
    </div>
  );
}

export default PostActions;