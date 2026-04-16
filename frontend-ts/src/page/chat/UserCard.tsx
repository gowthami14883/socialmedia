interface User {
  user_id: number
  username?: string
}

interface UserCardProps {
  user: User
  active: boolean
  onClick: () => void
  capitalizeFirst: (text?: string) => string
}

function UserCard({
  user,
  active,
  onClick,
  capitalizeFirst
}: UserCardProps) {

  return (
    <div
      className={`ig-user-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <img
        src={`https://i.pravatar.cc/150?img=${user.user_id % 70}`}
        alt="dp"
      />

      <div>
        <strong>{capitalizeFirst(user.username)}</strong>
        <p>Tap to chat</p>
      </div>
    </div>
  )
}

export default UserCard