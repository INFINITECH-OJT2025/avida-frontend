import { useRef, useState } from "react";
import SnapToGrid from "../SnapToGrid";

export default function useDraggableWithSnap(initialPos, gridSize, locked, canvasSize, size, onUpdate) {
  const [position, setPosition] = useState(initialPos);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Ensure onUpdate is a function to prevent the error
  const safeOnUpdate = typeof onUpdate === "function" ? onUpdate : () => {};

  // Helper function to restrict movement inside canvas
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const onMouseDown = (e) => {
    if (locked) return;
    setIsDragging(true);

    dragRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
    };

    // ✅ Prevent default browser behavior to avoid jittering
    e.preventDefault();
};

  const onMouseMove = (e) => {
    if (!isDragging) return;

    // Get mouse position relative to drag start
    let rawX = e.clientX - dragRef.current.x;
    let rawY = e.clientY - dragRef.current.y;

    // ✅ Fix clamping to allow smoother movement
    rawX = clamp(rawX, 0, canvasSize.width - Math.max(size.width, gridSize)); 
    rawY = clamp(rawY, 0, canvasSize.height - Math.max(size.height, gridSize));

    // ✅ Snap to grid AFTER clamping
    const snapped = SnapToGrid({ position: { x: rawX, y: rawY }, gridSize });

    setPosition(snapped);
    safeOnUpdate(snapped);
};

  const onMouseUp = () => setIsDragging(false);

  return { position, onMouseDown, onMouseMove, onMouseUp };
}
