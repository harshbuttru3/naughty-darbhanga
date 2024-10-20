import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((msg) => {
        // Debugging log
        console.log('Message Gender:', msg.gender);

        // Determine color based on gender
        const textColor = msg.gender === 'female' ? 'pink' : 
                          msg.gender === 'male' ? 'blue' : 
                          'green'; // Fallback color for unknown genders

        return (
          <div key={msg.id} className="message">
            <img src={msg.avatar} alt="avatar" />
            <div>
              <strong style={{ color: textColor }}>
                {msg.displayName}
              </strong>
              <p>{msg.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
