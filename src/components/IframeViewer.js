import React from 'react';

const IframeViewer = () => {
  return (
    <iframe
      src="https://dmci-agent.vercel.app/room-planner"
      title="Room Planner"
      className="w-full h-full border-0"
      allowFullScreen
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-forms" 
    />
  );
};

export default IframeViewer;
