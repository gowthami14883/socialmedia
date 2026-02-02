import { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS, API_BASE_URL } from "../../api/config";
import "./profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1️⃣ Get logged-in user (from JWT)
        const meRes = await api.get(API_ENDPOINTS.PROFILE);
        const userId = meRes.data.data.user_id;

        // 2️⃣ Get full profile using userId
        const fullProfileRes = await api.get(
          `${API_BASE_URL}/api/users/${userId}/profile`
        );

        setProfile(fullProfileRes.data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;
  if (!profile) return <p className="loading">No profile data</p>;

  return (
    <div className="profile-wrapper">
      {/* PROFILE HEADER */}
      <div className="profile-header">
        <img
          src="/default-avatar.png"
          alt="profile"
          className="profile-pic"
        />

        <div className="profile-details">
          <h2>{profile.username}</h2>

          <div className="profile-stats">
            <div>
              <strong>{profile.Posts?.length || 0}</strong>
              <span>Posts</span>
            </div>

            <div
              className="clickable"
              onClick={() => setShowFollowers(true)}
            >
              <strong>{profile.Followers?.length || 0}</strong>
              <span>Followers</span>
            </div>

            <div
              className="clickable"
              onClick={() => setShowFollowing(true)}
            >
              <strong>{profile.Following?.length || 0}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="posts-section">
        {profile.Posts?.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          <div className="posts-grid">
            {profile.Posts?.map((post) => (
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
      </div>

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <div className="modal">
          <div className="modal-box">
            {/* Header with small close button */}
            <div className="modal-header">
              <h3>Followers</h3>
              <button
                className="modal-close"
                onClick={() => setShowFollowers(false)}
              >
                ×
              </button>
            </div>

            {profile.Followers?.length === 0 ? (
              <p>No followers</p>
            ) : (
              profile.Followers.map((f) => (
                <div key={f.follower_id} className="user-row">
                  <span>{f.FollowerUser.username}</span>
                  <div className="actions">
                    <button className="chat-btn">Chat</button>
                    <button className="remove-btn">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* FOLLOWING MODAL */}
      {showFollowing && (
        <div className="modal">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Following</h3>
              <button
                className="modal-close"
                onClick={() => setShowFollowing(false)}
              >
                ×
              </button>
            </div>

            {profile.Following?.length === 0 ? (
              <p>Not following anyone</p>
            ) : (
              profile.Following.map((f) => (
                <div key={f.follower_id} className="user-row">
                  <span>{f.FollowingUser.username}</span>
                  <div className="actions">
                    <button className="chat-btn">Chat</button>
                    <button className="remove-btn">Unfollow</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
