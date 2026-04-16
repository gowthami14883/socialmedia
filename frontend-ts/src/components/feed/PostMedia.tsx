import { FaHeart } from "react-icons/fa";
import "./PostMedia.css";

interface PostMediaProps {
  post: {
    id: number;
    media?: string[];
  };
  showHeart: boolean;
}

function PostMedia({ post, showHeart }: PostMediaProps) {
  return (
    <div className="post-media">
      {post?.media?.map((_img, index) => (
        <img
          key={index}
          src={`https://picsum.photos/seed/${post?.id}-${index}/500/500`}
          className="ig-media"
          alt="post"
        />
      ))}

      {showHeart && (
        <div className="big-heart">
          <FaHeart />
        </div>
      )}
    </div>
  );
}

export default PostMedia;