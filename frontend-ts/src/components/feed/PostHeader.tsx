interface User {
  username?: string;
}

interface PostHeaderProps {
  avatar: string;
  user?: User;
}

function PostHeader({ avatar, user }: PostHeaderProps) {
  return (
    <div className="ig-post-header">
      <img src={avatar} className="ig-avatar" alt={user?.username} />
      <span className="ig-username">{user?.username}</span>
    </div>
  );
}

export default PostHeader;