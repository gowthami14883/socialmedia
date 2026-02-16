import { useEffect, useState } from "react";
import "./feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  // ✅ Static Demo Posts
  const staticPosts = [
    {
      id: "static-1",
      user: "girl",
      avatar: "https://i.pravatar.cc/150?img=47",
      media: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900"
      ],
      caption: "Chasing good vibes ✨",
      likes: 234,
      liked: false,
      comments: []
    },
    {
      id: "static-2",
      user: "anime_girl",
      avatar: "https://i.pravatar.cc/150?img=32",
      media: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900"
      ],
      caption: "Cartoon vibes 💕",
      likes: 980,
      liked: false,
      comments: []
    }
  ];

  // ✅ Fetch Dynamic Posts
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const text = await res.text();

        try {
          return JSON.parse(text);
        } catch (err) {
          console.error("Response not JSON:", text);
          return [];
        }
      })
      .then((data) => {
        const dynamicPosts = (data.data || data || []).map((post) => ({
          id: post.post_id,

          // ✅ Use real username from backend
          user: post.User?.username || "Unknown",

          // ✅ Use real profile picture if exists
          avatar: post.User?.profilepic
            ? `http://localhost:3000/${post.User.profilepic}`
            : "https://i.pravatar.cc/150?img=10",

          // ✅ Handle multiple images
          media: Array.isArray(post.media_url)
            ? post.media_url.map(
              (img) => `http://localhost:3000/${img}`
            )
            : [`http://localhost:3000/${post.media_url}`],

          caption: post.caption,
          likes: post.likes || 0,
          liked: false,
          comments: post.comments || []
        }));

        // Combine static + dynamic
        setPosts([...staticPosts, ...dynamicPosts]);
      })

      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts(staticPosts); // fallback to static only
      });
  }, []);

  // ❤️ Like button
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
            <img
              src={post.avatar}
              className="ig-avatar"
              alt={post.user}
            />
            <span className="ig-username">{post.user}</span>
          </div>

          {/* ✅ MEDIA (Supports Multiple) */}
          {post.media.map((img, index) => (
            <img
              key={index}
              src={img}
              className="ig-media"
              alt="post"
            />
          ))}

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
