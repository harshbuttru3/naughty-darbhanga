import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          <img src={msg.avatar} alt="avatar" />
          <div>
            <strong style={{ color: msg.gender === 'female' ? 'pink' : msg.gender === 'male' ? 'blue' : 'black' }}>
              {msg.displayName}
            </strong>
            <p>{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
