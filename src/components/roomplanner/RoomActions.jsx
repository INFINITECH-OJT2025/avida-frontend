// src\components\roomplanner\RoomActions.jsx
import { useState } from 'react';

export default function RoomActions({ selectedItems, setFurniture, undo, redo }) {
  const [textInput, setTextInput] = useState('');

  const deleteSelected = () => {
    setFurniture(prev => prev.filter(item => !selectedItems.includes(item.id)));
  };

  const addText = () => {
    if (!textInput.trim()) return;
    setFurniture(prev => [
      ...prev,
      { id: Date.now(), type: 'text', content: textInput, x: 100, y: 100, width: 150, height: 50 }
    ]);
    setTextInput('');
  };

  return (
    <div className="flex gap-2 bg-gray-200 p-2 rounded-md shadow-md">
      <button onClick={undo} className="px-4 py-2 bg-white rounded">Undo</button>
      <button onClick={redo} className="px-4 py-2 bg-white rounded">Redo</button>
      <button onClick={deleteSelected} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>

      <input 
        type="text" 
        value={textInput} 
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text" 
        className="px-2 py-1 border rounded"
      />
      <button onClick={addText} className="px-4 py-2 bg-green-500 text-white rounded">Add Text</button>
    </div>
  );
}
