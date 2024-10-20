import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseconfig';
import { collection, onSnapshot } from 'firebase/firestore';
import MessageList from './MessageList'; // Make sure you have a MessageList component

const DirectMessages = ({ recipientUid, onClose, onSend }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const conversationId = [auth.currentUser.uid, recipientUid].sort().join('_');
    
    // Set up a listener for direct messages
    const unsubscribe = onSnapshot(collection(db, 'directMessages', conversationId, 'messages'), (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort messages by timestamp in ascending order
      const sortedMessages = fetchedMessages.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
      
      setMessages(sortedMessages);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [recipientUid]); // Fetch messages whenever recipientUid changes

  const sendMessage = () => {
    if (message.trim()) {
      onSend(message, recipientUid); // Send message with recipient ID
      setMessage(""); // Clear input
    }
  };

  return (
    <div className="direct-messages">
      <div className="header">
        <h2>Direct Messages</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <MessageList messages={messages} />
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default DirectMessages;
