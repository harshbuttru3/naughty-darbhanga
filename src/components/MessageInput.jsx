import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSend}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
