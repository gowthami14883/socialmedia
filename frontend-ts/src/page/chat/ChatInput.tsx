interface ChatInputProps {
  newMessage: string
  setNewMessage: React.Dispatch<React.SetStateAction<string>>
  handleSend: () => void
}

function ChatInput({ newMessage, setNewMessage, handleSend }: ChatInputProps) {
  return (
    <div className="ig-input">
      <input
        placeholder="Message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default ChatInput