import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';
import { useState, useRef } from 'react';

export default function Canvas({
  furniture = [],
  setFurniture,
  roomDimensions,
  scale,
  selectedItems,
  setSelectedItems,
  isPreview,
  showLabels
}) {
  const GRID_SIZE = 53;
  const WALL_MARGIN = 11;
  const canvasRef = useRef(null);

  const [, drop] = useDrop({
    accept: 'furniture',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset || !canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const relativeX = offset.x - canvasRect.left;
      const relativeY = offset.y - canvasRect.top;

      const finalX = Math.min(Math.max(relativeX, WALL_MARGIN), roomDimensions.width * GRID_SIZE - WALL_MARGIN);
      const finalY = Math.min(Math.max(relativeY, WALL_MARGIN), roomDimensions.height * GRID_SIZE - WALL_MARGIN);

      setFurniture(prev => [
        ...prev,
        { ...item, x: finalX, y: finalY, width: GRID_SIZE * 2, height: GRID_SIZE * 2, rotation: 0 }
      ]);
    }
  });

  return (
    <div
      ref={(node) => {
        drop(node);
        canvasRef.current = node;
      }}
      className="relative border border-gray-300 bg-gray-50"
      style={{
        width: `${roomDimensions.width * GRID_SIZE}px`,
        height: `${roomDimensions.height * GRID_SIZE}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundImage: 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)'
      }}
    >
      {furniture.map((item, idx) => (
        <DraggableItem
          key={idx}
          id={idx}
          item={item}
          setFurniture={setFurniture}
          showLabels={showLabels}
          selected={selectedItems.includes(idx)}
        />
      ))}
    </div>
  );
}

function DraggableItem({ id, item, setFurniture, showLabels, selected }) {
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tempSize, setTempSize] = useState({ width: item.width, height: item.height });

  return (
    <Rnd
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      enableResizing={{
        top: true, right: true, bottom: true, left: true, topLeft: true, topRight: true, bottomLeft: true, bottomRight: true
      }}
      lockAspectRatio={true} // Ensures proportional resizing
      onDragStart={() => setDragging(true)}
      onDrag={(e, d) => {
        setFurniture(prev =>
          prev.map((f, i) =>
            i === id ? { ...f, x: d.x, y: d.y } : f
          )
        );
      }}
      onDragStop={() => setDragging(false)}
      onResizeStart={() => setResizing(true)}
      onResize={(e, direction, ref, delta, position) => {
        const newWidth = parseInt(ref.style.width);
        const newHeight = parseInt(ref.style.height);
        setTempSize({ width: newWidth, height: newHeight });
        setFurniture(prev =>
          prev.map((f, i) =>
            i === id ? { ...f, width: newWidth, height: newHeight, x: position.x, y: position.y } : f
          )
        );
      }}
      onResizeStop={() => setResizing(false)}
      bounds="parent"
      className={`absolute ${selected ? 'border-2 border-blue-500' : ''}`}
    >
      <div className="relative border-2 border-purple-500 rounded-md">
        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />

        {/* 8 Resize Handles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { className: 'top-0 left-0', style: '-translate-x-1/2 -translate-y-1/2' }, // Top-left
            { className: 'top-0 right-0', style: 'translate-x-1/2 -translate-y-1/2' }, // Top-right
            { className: 'bottom-0 left-0', style: '-translate-x-1/2 translate-y-1/2' }, // Bottom-left
            { className: 'bottom-0 right-0', style: 'translate-x-1/2 translate-y-1/2' }, // Bottom-right
            { className: 'top-1/2 left-0', style: '-translate-x-1/2 -translate-y-1/2' }, // Left-middle
            { className: 'top-1/2 right-0', style: 'translate-x-1.5 -translate-y-1/2' }, // Right-middle
            { className: 'top-0 left-1/2', style: '-translate-x-1/2 -translate-y-1/2' }, // Top-middle
            { className: 'bottom-0 left-1/2', style: '-translate-x-1/2 translate-y-1/2' }, // Bottom-middle
          ].map((handle, idx) => (
            <div
              key={idx}
              className={`absolute ${handle.className} w-4 h-4 bg-white border-2 border-purple-600 rounded-full pointer-events-auto cursor-pointer hover:scale-110 transition`}
              style={{ transform: handle.style }}
            ></div>
          ))}
        </div>
      </div>

      {/* Dynamic Dragging Guide */}
      {dragging && (
        <div
          className="absolute inset-0 border-2 border-green-500 bg-green-100 opacity-50 rounded-md pointer-events-none flex items-center justify-center"
          style={{ width: item.width, height: item.height }}
        >
          <span className="absolute top-0 left-0 bg-white px-2 py-1 border text-xs rounded-md shadow-md">
            {item.width}px x {item.height}px
          </span>
        </div>
      )}

      {/* Resizing Guide (Always Visible) */}
      {resizing && (
        <div
          className="absolute inset-0 flex items-center justify-center border-2 border-purple-500 bg-purple-100 opacity-75 rounded-md pointer-events-none"
          style={{ width: tempSize.width, height: tempSize.height }}
        >
          <span className="text-xs text-purple-900 font-bold bg-white px-2 py-1 rounded-md shadow-md">
            {tempSize.width}px x {tempSize.height}px
          </span>
        </div>
      )}
    </Rnd>
  );
}
