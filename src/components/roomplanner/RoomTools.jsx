// src\components\roomplanner\RoomTools.jsx
export default function RoomTools({
  setScale,
  setIsPreview,
  isPreview,
  setShowLabels,
  exportAsImage,
  undo,
  redo,
  canUndo,
  canRedo,
  roomDimensions,
  setRoomDimensions
}) {
  return (
    <div className="flex gap-2 bg-blue-500 p-2 items-center">
      <button onClick={() => setScale(prev => prev + 0.1)} className="px-4 py-2 bg-white rounded">Zoom In</button>
      <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))} className="px-4 py-2 bg-white rounded">Zoom Out</button>
      <button onClick={exportAsImage} className="px-4 py-2 bg-white rounded">Export</button>
      <button onClick={() => setShowLabels(prev => !prev)} className="px-4 py-2 bg-white rounded">Toggle Labels</button>
      <button onClick={() => setIsPreview(prev => !prev)} className="px-4 py-2 bg-white rounded">{isPreview ? 'Edit Mode' : 'Preview'}</button>
    </div>
  );
}
