import { useState, useEffect, useRef } from "react";
import { Lock, Unlock } from "lucide-react";
import useDraggableWithSnap from "./hooks/useDraggableWithSnap";

export default function TextItem({
  id,
  text,
  x,
  y,
  locked,
  gridSize,
  canvasSize, // ✅ Accept canvasSize prop
  onUpdate,
  onDelete,
  onToggleLock,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(text);
  const [size, setSize] = useState({ width: 150, height: 40 });
  const textRef = useRef(null);
  const resizeRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  // ✅ Use draggable hook with boundary and snap
  const { position, onMouseDown, onMouseMove, onMouseUp } = useDraggableWithSnap(
    { x, y },
    gridSize,
    locked,
    canvasSize,
    size,
    (updatedPos) => onUpdate && onUpdate(id, updatedPos) // ✅ Ensure onUpdate is not undefined
  );
  

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  // 📐 Resize logic
  const handleResizeStart = (e) => {
    if (locked) return;
    setIsResizing(true);
    resizeRef.current = {
      width: size.width,
      height: size.height,
      x: e.clientX,
      y: e.clientY,
    };
    e.stopPropagation();
  };

  const handleResizing = (e) => {
    if (!isResizing) return;

    const newWidth = Math.max(100, resizeRef.current.width + (e.clientX - resizeRef.current.x));
    const newHeight = Math.max(40, resizeRef.current.height + (e.clientY - resizeRef.current.y));

    // (Optional: clamp within canvas bounds in future)
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizeEnd = () => setIsResizing(false);

  // ✏️ Text update on blur
  const handleBlur = () => {
    setIsEditing(false);
    if (!content.trim()) {
      onDelete(id);
    } else {
      onUpdate(id, { text: content });
    }
  };

  return (
    <div
      className="absolute flex flex-col items-center justify-center px-2 bg-white border border-gray-400 rounded shadow-md"
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        cursor: locked ? "not-allowed" : "move",
        userSelect: isEditing ? "text" : "none",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* 🔒 Lock toggle */}
      <div className="flex justify-center w-full mt-1">
        <button onClick={() => onToggleLock(id)} className="text-gray-600 hover:text-black">
          {locked ? <Unlock size={14} /> : <Lock size={14} />}
        </button>
      </div>

      {/* ✏️ Editable text */}
      {isEditing ? (
        <input
          ref={textRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent text-sm font-medium outline-none break-words text-center"
          style={{ minWidth: 100 }}
        />
      ) : (
        <p
          onDoubleClick={() => setIsEditing(true)}
          className="text-sm font-medium cursor-text text-center w-full"
        >
          {content}
        </p>
      )}

      {/* 🔄 Resize handle */}
      {!locked && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 cursor-se-resize"
          onMouseDown={handleResizeStart}
          onMouseMove={handleResizing}
          onMouseUp={handleResizeEnd}
        />
      )}
    </div>
  );
}
