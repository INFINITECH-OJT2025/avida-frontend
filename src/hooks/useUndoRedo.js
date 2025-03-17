// src\hooks\useUndoRedo.js
import { useState } from 'react';

export default function useUndoRedo(setState) {
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(-1);

  const set = (newState) => {
    setHistory(prev => [...prev.slice(0, index + 1), newState]);
    setIndex(prev => prev + 1);
  };

  const undo = () => {
    if (index > 0) {
      setIndex(prev => prev - 1);
      setState(history[index - 1]);
    }
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex(prev => prev + 1);
      setState(history[index + 1]);
    }
  };

  return { undo, redo, canUndo: index > 0, canRedo: index < history.length - 1, set };
}
