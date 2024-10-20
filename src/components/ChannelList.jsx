import React from 'react';

const ChannelList = ({ setChannel }) => {
  const channels = ['general', 'sports', 'technology', 'nasty', 'IIT darbhanga'];

  return (
    <div className="channel-list">
      <h3>Channels</h3>
      {channels.map((channel) => (
        <button key={channel} onClick={() => setChannel(channel)}>
          {channel}
        </button>
      ))}
    </div>
  );
};

export default ChannelList;
