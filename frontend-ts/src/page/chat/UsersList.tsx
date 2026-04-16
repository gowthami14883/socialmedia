import { FaSearch } from "react-icons/fa"
import UserCard from "./UserCard"

interface User {
  user_id: number
  username?: string
}

interface UsersListProps {
  users: User[]
  selectedUser: User | null
  onSelectUser: (user: User) => void
  showSearch: boolean
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>
  searchText: string
  setSearchText: React.Dispatch<React.SetStateAction<string>>
}

function UsersList({
  users,
  selectedUser,
  onSelectUser,
  showSearch,
  setShowSearch,
  searchText,
  setSearchText
}: UsersListProps) {

  const capitalizeFirst = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : ""

  return (
    <div className="ig-users">

      <div className="ig-users-header">

        <div className="ig-title-row">
          <h3 className="ig-users-title">Messages</h3>

          <FaSearch
            className="ig-search-icon"
            onClick={() => setShowSearch(!showSearch)}
          />
        </div>

        {showSearch && (
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="ig-search-input"
            autoFocus
          />
        )}

      </div>

      {users.map((user) => (
        <UserCard
          key={user.user_id}
          user={user}
          active={selectedUser?.user_id === user.user_id}
          onClick={() => onSelectUser(user)}
          capitalizeFirst={capitalizeFirst}
        />
      ))}

    </div>
  )
}

export default UsersList