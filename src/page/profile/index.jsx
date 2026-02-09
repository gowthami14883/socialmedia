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
      // ✅ USER BASIC INFO (BIO COMES FROM HERE)
      const meRes = await api.get("/api/users/me");

      // ✅ RELATIONS (POSTS, FOLLOWERS, FOLLOWING)
      const fullProfileRes = await api.get(
        `${API_BASE_URL}/api/users/${meRes.data.data.user_id}/profile`
      );

      // ✅ MERGE BOTH
      setProfile({
        ...fullProfileRes.data.data,
        ...meRes.data.data
      });

    } catch (error) {
      console.error("Profile fetch error:", error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


  const handleRemoveFollower = async (followerUserId, followerId) => {
    try {
      await api.delete(
        `${API_BASE_URL}/api/followers/remove/${followerUserId}`
      );

      setProfile((prev) => ({
        ...prev,
        Followers: prev.Followers.filter(
          (f) => f.follower_id !== followerId
        )
      }));
    } catch (error) {
      console.error("Remove follower error:", error);
      alert("Failed to remove follower");
    }
  };

  const handleUnfollow = async (userId, followerId) => {
    try {
      await api.delete(`${API_BASE_URL}/api/followers/${userId}`);

      setProfile((prev) => ({
        ...prev,
        Following: prev.Following.filter(
          (f) => f.follower_id !== followerId
        )
      }));
    } catch (error) {
      console.error("Unfollow error:", error);
      alert("Failed to unfollow user");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!profile) return <p className="loading">No profile data</p>;

  const capitalizeFirst = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="profile-wrapper">
      {/* PROFILE HEADER */}
      <div className="profile-header">
  <img
    src={`https://i.pravatar.cc/150?img=${profile.user_id % 70}`}
    alt="profile"
    className="profile-pic"
  />

  <div className="profile-details">
    <h2>{capitalizeFirst(profile.username)}</h2>

    {/* ✅ BIO FIX */}
    {(profile.bio || profile.User?.bio) && (
      <p className="profile-bio"><b>Bio: </b>
        {profile.bio || profile.User?.bio}
      </p>
    )}

    <div className="profile-stats">
      <div>
        <strong>{profile.Posts?.length || 0}</strong>
        <span>Posts</span>
      </div>

      <div className="clickable" onClick={() => setShowFollowers(true)}>
        <strong>{profile.Followers?.length || 0}</strong>
        <span>Followers</span>
      </div>

      <div className="clickable" onClick={() => setShowFollowing(true)}>
        <strong>{profile.Following?.length || 0}</strong>
        <span>Following</span>
      </div>
    </div>
  </div>
</div>

      {/* POSTS */}
      <div className="posts-section">
        {profile.Posts?.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          <div className="posts-grid">
            {profile.Posts?.map((post) => (
              <div key={post.post_id} className="post-card">
                <img
                  src={`http://localhost:3000/${post.media_url}`}
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
                  <img
                    src={`https://i.pravatar.cc/150?img=${f.FollowerUser.user_id % 70}`}
                    className="mini-dp"
                    alt="dp"
                  />
                  <span>{f.FollowerUser.username}</span>
                  <div className="actions">
                    <button className="chat-btn">Chat</button>
                    <button
                      className="remove-btn"
                      onClick={() =>
                        handleRemoveFollower(
                          f.FollowerUser.user_id,
                          f.follower_id
                        )
                      }
                    >
                      Remove
                    </button>
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
                  <img
                    src={`https://i.pravatar.cc/150?img=${f.FollowingUser.user_id % 70}`}
                    className="mini-dp"
                    alt="dp"
                  />
                  <span>{f.FollowingUser.username}</span>
                  <div className="actions">
                    <button className="chat-btn">Chat</button>
                    <button
                      className="remove-btn"
                      onClick={() =>
                        handleUnfollow(
                          f.FollowingUser.user_id,
                          f.follower_id
                        )
                      }
                    >
                      Unfollow
                    </button>
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
