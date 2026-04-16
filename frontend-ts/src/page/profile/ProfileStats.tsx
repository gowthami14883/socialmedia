import "./profile.css";
import type { ProfileType } from "../../types/profile";

interface ProfileStatsProps {
  profile: ProfileType | null;
  setShowFollowers: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFollowing: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProfileStats({
  profile,
  setShowFollowers,
  setShowFollowing,
}: ProfileStatsProps) {
  return (
    <div className="profile-stats">
      <div>
        <strong>{profile?.Posts?.length || 0}</strong>
        <span>Posts</span>
      </div>

      <div className="clickable" onClick={() => setShowFollowers(true)}>
        <strong>{profile?.Followers?.length || 0}</strong>
        <span>Followers</span>
      </div>

      <div className="clickable" onClick={() => setShowFollowing(true)}>
        <strong>{profile?.Following?.length || 0}</strong>
        <span>Following</span>
      </div>
    </div>
  );
}

export default ProfileStats;