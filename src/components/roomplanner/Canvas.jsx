import { useDrop } from 'react-dnd';
import { useCallback } from 'react';
import { Rnd } from 'react-rnd';

const GRID_SIZE = 20;

const snapToGrid = (x, y) => {
  return [Math.round(x / GRID_SIZE) * GRID_SIZE, Math.round(y / GRID_SIZE) * GRID_SIZE];
};

export default function Canvas({ furniture = [], setFurniture, roomDimensions = { width: 5, height: 5 } }) {
  const moveFurniture = useCallback((id, data) => {
    setFurniture((prev) =>
      prev.map((item, idx) => (idx === id ? { ...item, ...data } : item))
    );
  }, [setFurniture]);

  const removeFurniture = (id) => {
    setFurniture((prev) => prev.filter((_, idx) => idx !== id));
  };

  const [, drop] = useDrop({
    accept: 'furniture',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const [x, y] = snapToGrid(offset.x, offset.y);
      setFurniture((prev) => [
        ...prev,
        { ...item, x, y, width: 80, height: 80 },
      ]);
    },
  });

  return (
    <div
      ref={drop}
      className="canvas-grid relative border border-gray-300 overflow-hidden"
      style={{
        width: `${roomDimensions.width * 50}px`,
        height: `${roomDimensions.height * 50}px`,
      }}
    >
      <span className="absolute top-0 left-0 bg-white px-2 py-1 border text-sm">
        {roomDimensions.width}m x {roomDimensions.height}m
      </span>

      {furniture.map((item, idx) => (
        <DraggableItem
          key={idx}
          id={idx}
          item={item}
          moveFurniture={moveFurniture}
          removeFurniture={removeFurniture}
        />
      ))}
    </div>
  );
}

function DraggableItem({ id, item, moveFurniture, removeFurniture }) {
  return (
    <Rnd
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      onDragStop={(e, d) => {
        const [x, y] = snapToGrid(d.x, d.y);
        moveFurniture(id, { x, y });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        moveFurniture(id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
      }}
      bounds="parent"
      className="absolute cursor-move border bg-white shadow-md"
      onDoubleClick={() => removeFurniture(id)}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-contain"
      />
    </Rnd>
  );
}
