import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseconfig';
import { collection, onSnapshot, addDoc, orderBy, query, doc } from 'firebase/firestore';
import OnlineMembers from './OnlineMembers';
import ChannelList from './ChannelList';
import DirectMessages from './DirectMessage';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatApp = () => {
  const [channel, setChannel] = useState(null);
  const [directMessagesVisible, setDirectMessagesVisible] = useState(false);
  const [recipientUid, setRecipientUid] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (channel) {
      const messageQuery = query(collection(db, 'channels', channel, 'messages'), orderBy('timestamp'));
      const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [channel]);

  // Handle sending messages
  const handleSendMessage = async (text, recipientId = null) => {
    if (text.trim()) {
      try {
        const { uid, displayName, gender } = auth.currentUser;
        console.log('Sending message by user:', { uid, displayName, gender });
        if (recipientId) {
          // Create a unique conversation ID based on sender and recipient UIDs
          const conversationId = [uid, recipientId].sort().join('_'); // Sort to create a consistent ID
          const messageRef = collection(db, 'directMessages', conversationId, 'messages');
          console.log('Direct message path:', `directMessages/${conversationId}/messages`);
          
          await addDoc(messageRef, {
            text,
            uid,
            displayName: displayName || `guest-${uid}`, // Fallback if displayName is not set
            gender: gender || 'unknown', // Ensure gender is set
            timestamp: new Date(),
          });
        } else if (channel) {
          // Sending a channel message
          const messageRef = collection(db, 'channels', channel, 'messages');
          console.log('Channel message path:', `channels/${channel}/messages`);
          
          await addDoc(messageRef, {
            text,
            uid,
            displayName: displayName || `guest-${uid}`,
            gender: gender || 'unknown',
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleMemberClick = (uid) => {
    setRecipientUid(uid);
    setDirectMessagesVisible(true);
  };

  const handleDirectMessageClose = () => {
    setDirectMessagesVisible(false);
    setRecipientUid(null);
  };

  return (
    <div className="chat-app">
      <ChannelList setChannel={setChannel} />
      <div className="chat-container">
        {channel && (
          <div className="channel-chat">
            <MessageList messages={messages} />
            <MessageInput onSend={(text) => handleSendMessage(text)} />
          </div>
        )}
        <OnlineMembers onMemberClick={handleMemberClick} />
      </div>
      {directMessagesVisible && (
        <DirectMessages recipientUid={recipientUid} onClose={handleDirectMessageClose} onSend={handleSendMessage} />
      )}
    </div>
  );
};

export default ChatApp;