import { useEffect, useState } from "react";
import "./feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const staticPosts = [
      {
        id: 1,
        user: "girl",
        avatar: "https://i.pravatar.cc/150?img=47",
        type: "image",
        media: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900",
        caption: "Chasing good vibes ✨",
        likes: 234,
        liked: false,
        comments: []
      },
      {
        id: 2,
        user: "anime_girl",
        avatar: "https://i.pravatar.cc/150?img=32",
        type: "image",
        media: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900",
        caption: "Cartoon vibes 💕",
        likes: 980,
        liked: false,
        comments: []
      },
      {
        id: 3,
        user: "soft_style",
        avatar: "https://i.pravatar.cc/150?img=15",
        type: "image",
        media: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900",
        caption: "Soft & stylish 🌸",
        likes: 1200,
        liked: false,
        comments: []
      },
      {
        id: 4,
        user: "fashion_daily",
        avatar: "https://i.pravatar.cc/150?img=5",
        type: "image",
        media: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900",
        caption: "Outfit goals 🖤",
        likes: 860,
        liked: false,
        comments: []
      },
      {
        id: 5,
        user: "reel_creator",
        avatar: "https://i.pravatar.cc/150?img=68",
        type: "video",
        media: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Reels all day 🎬🔥",
        likes: 2400,
        liked: false,
        comments: []
      }
    ];

    setTimeout(() => {
      setPosts(staticPosts);
    }, 400);
  }, []);

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleCommentChange = (id, value) => {
    setCommentText((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddComment = (id) => {
    if (!commentText[id]?.trim()) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [
                ...post.comments,
                { user: "you", text: commentText[id] }
              ]
            }
          : post
      )
    );

    setCommentText((prev) => ({
      ...prev,
      [id]: ""
    }));
  };

  return (
    <div className="ig-feed">
      {posts.map((post) => (
        <div className="ig-post" key={post.id}>
          
          {/* Header */}
          <div className="ig-post-header">
            <img src={post.avatar} className="ig-avatar" alt={post.user} />
            <span className="ig-username">{post.user}</span>
          </div>

          {/* Media */}
          {post.type === "image" ? (
            <img src={post.media} className="ig-media" alt="" />
          ) : (
            <video src={post.media} className="ig-media" controls muted loop />
          )}

          {/* Actions */}
          <div className="ig-actions">
            <span
              className={`like-btn ${post.liked ? "liked" : ""}`}
              onClick={() => handleLike(post.id)}
            >
              {post.liked ? "❤️" : "🤍"}
            </span>
            <span>💬</span>
            <span>📤</span>
          </div>

          {/* Likes */}
          <div className="ig-likes">{post.likes} likes</div>

          {/* Caption */}
          <div className="ig-caption">
            <b>{post.user}</b> {post.caption}
          </div>

          {/* Comments */}
          <div className="ig-comments">
            {post.comments.map((c, i) => (
              <div key={i} className="ig-comment">
                <b>{c.user}</b> {c.text}
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="ig-add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText[post.id] || ""}
              onChange={(e) =>
                handleCommentChange(post.id, e.target.value)
              }
            />
            <button onClick={() => handleAddComment(post.id)}>
              Post
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default Feed;
