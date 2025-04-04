import React, { useEffect } from 'react';
import IframeViewer from '../src/components/IframeViewer';

const RoomPlannerPage = () => {
  useEffect(() => {
    const blockInstallPrompt = (e) => {
      e.preventDefault();
    };

    window.addEventListener('beforeinstallprompt', blockInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', blockInstallPrompt);
    };
  }, []);

  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden">
      <IframeViewer />
    </div>
  );
};

export default RoomPlannerPage;
