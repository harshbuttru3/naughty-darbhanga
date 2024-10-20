import React, { useEffect, useState } from 'react';
import { db } from '../firebaseconfig';
import { collection, onSnapshot } from 'firebase/firestore';

const OnlineMembers = ({ onMemberClick }) => {
  const [onlineMembers, setOnlineMembers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "onlineMembers"), (snapshot) => {
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOnlineMembers(members);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="online-members">
      <h3>Online Members</h3>
      {onlineMembers.map(member => (
        <div key={member.id} className="member" onClick={() => onMemberClick(member.id)}>
          <img src={member.avatar} alt={member.displayName} />
          <span>{member.displayName}</span>
        </div>
      ))}
    </div>
  );
};

export default OnlineMembers;
