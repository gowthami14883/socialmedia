import MessageItem from "./MessageItem"

interface Message {
  chat_id: number
  sender_id: number
  message: string
}

interface MessagesListProps {
  messages: Message[]
  loggedInUserId: number | null
  refreshChats: () => void
}

function MessagesList({
  messages,
  loggedInUserId,
  refreshChats
}: MessagesListProps) {

  return (
    <>
      {messages?.map((msg) => (
        <MessageItem
          key={msg.chat_id}
          msg={msg}
          loggedInUserId={loggedInUserId}
          refreshChats={refreshChats}
        />
      ))}
    </>
  )
}

export default MessagesList