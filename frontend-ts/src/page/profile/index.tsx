import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { API_BASE_URL } from "../../api/config";
import "./profile.css";
import ProfileStats from "./ProfileStats";
import { IoClose } from "react-icons/io5";
import type { User, Post, Follower, Following, ProfileType } from "../../types/profile";

function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [followers, setFollowers] = useState< Follower[] >([]);
  const [following, setFollowing] = useState< Following[] >([]);

  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);

  const [followersTotalPages, setFollowersTotalPages] = useState(1);
  const [followingTotalPages, setFollowingTotalPages] = useState(1);

  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  const followersRef = useRef<HTMLDivElement>(null);
  const followingRef = useRef<HTMLDivElement>(null);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  const limit = 5; // 🔹 Change this number as needed
  const { userId } = useParams<{userId?: string}>();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const loggedInUser: User | null =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const profileUserId = userId || loggedInUser?.user_id;
  const isOwnProfile =
    Number(profileUserId) === Number(loggedInUser?.user_id);

  // --------------------------
  // FETCH PROFILE
  // --------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(
          `${API_BASE_URL}/api/users/${profileUserId}/profile`
        );
        setProfile(res.data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    if (profileUserId) fetchProfile();
  }, [profileUserId]);

  // --------------------------
  // FETCH FOLLOWERS
  // --------------------------
  const fetchFollowers = async (page = 1) => {
    if (followersLoading || page > followersTotalPages) return;
    setFollowersLoading(true);
    try {
      const res = await api.get(`/api/followers/${profileUserId}/followers`, {
        params: { page, limit },
      });
      setFollowers((prev) => [...prev, ...res.data.data.followers]);
      setFollowersPage(page);
      setFollowersTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error("Followers fetch error:", err);
    } finally {
      setFollowersLoading(false);
    }
  };

  // --------------------------
  // FETCH FOLLOWING
  // --------------------------
  const fetchFollowing = async (page = 1) => {
    if (followingLoading || page > followingTotalPages) return;
    setFollowingLoading(true);
    try {
      const res = await api.get(`/api/followers/${profileUserId}/following`, {
        params: { page, limit },
      });
      setFollowing((prev) => [...prev, ...res.data.data.following]);
      setFollowingPage(page);
      setFollowingTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error("Following fetch error:", err);
    } finally {
      setFollowingLoading(false);
    }
  };

  // --------------------------
  // MODAL OPEN EFFECTS
  // --------------------------
  useEffect(() => {
    if (showFollowers) {
      setFollowers([]);
      setFollowersPage(1);
      fetchFollowers(1);
    }
  }, [showFollowers]);

  useEffect(() => {
    if (showFollowing) {
      setFollowing([]);
      setFollowingPage(1);
      fetchFollowing(1);
    }
  }, [showFollowing]);

  const isFollowing = profile?.Followers?.some(
    (f) => f.follower_user_id === loggedInUser?.user_id
  );

  // --------------------------
  // ACTIONS
  // --------------------------
  const handleRemoveFollower = async (followerUserId: number) => {
    try {
      await api.delete(`/api/followers/remove/${followerUserId}`);
      setProfile((prev) => ({
    ...prev!,
    Followers: prev?.Followers
      ? prev.Followers.filter((f) => f.follower_user_id !== followerUserId)
      : [],
  }));
      setFollowers((prev) => prev.filter((f) => f.follower_user_id !== followerUserId));
    } catch (err) {
      console.error("Remove follower error:", err);
    }
  };

  const handleUnfollow = async (userId : number, followerId: number) => {
    try {
      await api.delete(`${API_BASE_URL}/api/followers/${userId}`);
      setProfile((prev) => ({
        ...prev!,
        Following: prev?.Following
        ? prev.Following.filter((f) => f.follower_id !== followerId)
        :[],
      }));
      setFollowing((prev) => prev.filter((f) => f.follower_id !== followerId));
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  const handleFollowToggle = async () => {
    if (isOwnProfile) return;
    try {
      if (isFollowing) {
        await api.delete(`/api/followers/${profileUserId}`);
        setProfile((prev) => ({
          ...prev!,
          Followers: prev?.Followers
            ? prev.Followers.filter(
              (f) => f.follower_user_id !== loggedInUser!.user_id
            )
            : [],
        }));
      } else {
        await api.post(`/api/followers/${profileUserId}`);
        setProfile((prev) => ({
          ...prev!,
          Followers: [
            ...(prev?.Followers || []),
            {
              follower_user_id: loggedInUser!.user_id,
              FollowerUser: {
                user_id: loggedInUser!.user_id,
                username: loggedInUser!.username,
              },
            },
          ],
        }));
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    }
  };
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    try {
      await api.delete(`/api/posts/${selectedPost.post_id}`);

      // Remove deleted post from UI
      setProfile((prev) => ({
        ...prev!,
        Posts: prev!.Posts?.filter(
          (p) => p.post_id !== selectedPost.post_id
        ),
      }));

      setShowPostModal(false);
      setShowDeleteMenu(false);
      setSelectedPost(null);

    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post");
    }
  };



  if (loading) return <p className="loading">Loading...</p>;
  if (!profile) return <p className="loading">No profile data</p>;

  const capitalizeFirst = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (

    <div className="profile-wrapper">

      {showPostModal && selectedPost && (
        <div className="post-modal-overlay">
          <div className="post-modal">

            {/* ✅ ONLY THIS SECTION UPDATED */}
            <div className="post-modal-header">

              {isOwnProfile && (
                <>
                  <div className="dots-wrapper">
                    <div
                      className="three-dots"
                      onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                    >
                      ⋮
                    </div>

                    {showDeleteMenu && (
                      <div className="delete-dropdown">
                        <button onClick={handleDeletePost}>Delete</button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <IoClose
                size={24}
                className="close-icon"
                onClick={() => {
                  setShowPostModal(false);
                  setShowDeleteMenu(false);
                }}
              />
            </div>
            {/* ✅ END OF UPDATED SECTION */}
   <div className="big-post-container">

      {selectedPost?.media_url && (
        <img
          src={`${API_BASE_URL}/${selectedPost.media_url}`}
          alt="big post"
          className="big-post-image"
          onError={(e) => {
             (e.target as HTMLImageElement).src = `https://picsum.photos/600/600?random=${selectedPost.post_id}`;
          }}
        />
      )}

      {selectedPost?.caption && (
        <div className="big-post-caption">
          {selectedPost.caption}
        </div>
      )}

    </div>
          </div>
        </div>
      )}

      <div className="profile-header">
        <img
          src={`https://i.pravatar.cc/150?img=${profile?.user_id % 70}`}
          alt="profile"
          className="profile-pic"
        />
        <div className="profile-details">
          <h2>{capitalizeFirst(profile?.username)}</h2>
          <ProfileStats
            profile={profile}
            setShowFollowers={setShowFollowers}
            setShowFollowing={setShowFollowing}
          />

          {/* FOLLOWERS MODAL */}
          {showFollowers && (
            <div className="modal">
              <div
                className="modal-box"
                ref={followersRef}
                 onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  if (
                    target.scrollHeight - target.scrollTop <= target.clientHeight + 5 &&
                    followersPage < followersTotalPages &&
                    !followersLoading
                  ) {
                    fetchFollowers(followersPage + 1);
                  }
                }}
              >
                <div className="modal-header">
                  <h3>Followers</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowFollowers(false)}
                  >
                    <IoClose size={22} />
                  </button>
                </div>

                {followers.map((f) => (
                  <div key={f.follower_user_id} className="user-row">
                    <img
                      src={`https://i.pravatar.cc/150?img=${f.FollowerUser?.user_id % 70}`}
                      className="mini-dp"
                      alt="dp"
                    />
                    <span>{f.FollowerUser?.username}</span>
                    <div className="actions">
                      <button className="chat-btn">Chat</button>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFollower(f.follower_user_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {followersLoading && (
                  <p style={{ textAlign: "center" }}>Loading more...</p>
                )}
              </div>
            </div>
          )}

          {/* FOLLOWING MODAL */}
          {showFollowing && (
            <div className="modal">
              <div
                className="modal-box"
                ref={followingRef}
               onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  if (
                    target.scrollHeight - target.scrollTop <= target.clientHeight + 5 &&
                    followingPage < followingTotalPages &&
                    !followingLoading
                  ) {
                    fetchFollowing(followingPage + 1);
                  }
                }}
              >
                <div className="modal-header">
                  <h3>Following</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowFollowing(false)}
                  >
                    <IoClose size={22} />
                  </button>
                </div>

                {following.map((f) => (
                  <div key={f.follower_id} className="user-row">
                    <img
                      src={`https://i.pravatar.cc/150?img=${f.FollowingUser?.user_id % 70}`}
                      className="mini-dp"
                      alt="dp"
                    />
                    <span>{f.FollowingUser?.username}</span>
                    <div className="actions">
                      <button className="chat-btn">Chat</button>
                      <button
                        className="remove-btn"
                        onClick={() =>
                          handleUnfollow(f.FollowingUser?.user_id, f.follower_id)
                        }
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>
                ))}

                {followingLoading && (
                  <p style={{ textAlign: "center" }}>Loading more...</p>
                )}
              </div>
            </div>
          )}

          {(profile?.bio || profile?.User?.bio) && (
            <p className="profile-bio">
              <b>Bio: </b>
              {profile?.bio || profile?.User?.bio}
            </p>
          )}

          {!isOwnProfile && (
            <div className="profile-actions">
              <button
                className={`follow-btn ${isFollowing ? "following" : ""}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button className="message-btn" onClick={() => navigate(`/dashboard/chat/${userId}`)}>
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POSTS */}
      <div className="posts-section">
        {profile?.Posts?.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          <div className="posts-grid">
            {profile?.Posts?.map((post) => (
              <div
                key={post?.post_id}
                className="post-card"
                onClick={() => {
                  setSelectedPost(post);
                  setShowPostModal(true);
                }}
              >
                {post?.media_url ? (
                  <img
                    src={`${API_BASE_URL}/${post.media_url}`}
                    alt="post"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/300/300?random=${post.post_id}`;
                    }}
                  />
                ) : (
                  <div className="text-post">
                    <p>{post?.caption || "Text Post"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>




    </div>
  );
}

export default Profile;