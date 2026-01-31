import { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/config";
import "./profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(API_ENDPOINTS.PROFILE);
        setProfile(res.data.data);
      } catch (error) {
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-wrapper">
      {/* PROFILE HEADER */}
      <div className="profile-header">
        <img
          src="src/assests/dashboard/visaka.png"
          alt="profile"
          className="profile-pic"
        />

        <div className="profile-details">
          <h2>{profile.username}</h2>

          <div className="profile-stats">
            <div>
              <strong>{profile.Posts.length}</strong>
              <span>Posts</span>
            </div>

            <div
              className="clickable"
              onClick={() => setShowFollowers(true)}
            >
              <strong>{profile.Followers.length}</strong>
              <span>Followers</span>
            </div>

            <div
              className="clickable"
              onClick={() => setShowFollowing(true)}
            >
              <strong>{profile.Following.length}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* POSTS GRID
      <div className="posts-section">
        {profile.Posts.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          <div className="posts-grid">
            {profile.Posts.map((post) => (
              <div key={post.post_id} className="post-card">
                <img
                  src={`http://localhost:5000/${post.media_url}`}
                  alt="post"
                />
                <p className="caption">{post.caption}</p>
              </div>
            ))}
          </div>
        )}
      </div> */}

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <div className="modal">
          <div className="modal-box">
            <h3>Followers</h3>

            {profile.Followers.map((f) => (
              <div key={f.follower_id} className="user-row">
                <span>{f.FollowerUser.username}</span>
                <div className="actions">
                  <button className="chat-btn">Chat</button>
                  <button className="remove-btn">Remove</button>
                </div>
              </div>
            ))}

            <button
              className="close-btn"
              onClick={() => setShowFollowers(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOLLOWING MODAL */}
      {showFollowing && (
        <div className="modal">
          <div className="modal-box">
            <h3>Following</h3>

            {profile.Following.map((f) => (
              <div key={f.follower_id} className="user-row">
                <span>{f.FollowingUser.username}</span>
                <div className="actions">
                  <button className="chat-btn">Chat</button>
                  <button className="remove-btn">Unfollow</button>
                </div>
              </div>
            ))}

            <button
              className="close-btn"
              onClick={() => setShowFollowing(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
