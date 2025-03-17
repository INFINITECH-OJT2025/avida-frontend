// pages\room-planner.jsx
import { useState, useRef, useEffect } from 'react';
import FurniturePalette from '../components/roomplanner/FurniturePalette';
import Canvas from '../components/roomplanner/Canvas';
import RoomTools from '../components/roomplanner/RoomTools';
import RoomActions from '../components/roomplanner/RoomActions';
import useExportImage from '../hooks/useExportImage';
import useUndoRedo from '../hooks/useUndoRedo';
import SEO from '../utils/seo';

export default function RoomPlannerPage() {
  const [furniture, setFurniture] = useState([]);
  const [roomDimensions, setRoomDimensions] = useState({ width: 10, height: 10 });
  const [scale, setScale] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const canvasRef = useRef(null);
  const { exportAsImage } = useExportImage();
  const { undo, redo, addState, canUndo, canRedo, set } = useUndoRedo(furniture, setFurniture);

  useEffect(() => {
    set(furniture);
  }, [furniture]);

  const categorizedItems = [
    {
      category: 'Bedroom',
      items: [
        { id: 1, name: 'Bunk Beds', image: '/images/bunk-beds.png' },
        { id: 6, name: 'Nightstands', image: '/images/nightstands.png' },
        { id: 7, name: 'Panel Beds', image: '/images/panel-beds.png' },
      ],
    },
    {
      category: 'Dining Room',
      items: [
        { id: 2, name: 'Dining Arm Chairs', image: '/images/dining-arm-chairs.png' },
        { id: 3, name: 'Dining Side Chairs', image: '/images/dining-side-chairs.png' },
        { id: 4, name: 'Dining Table', image: '/images/dining-table.png' },
        { id: 8, name: 'Pub Tables', image: '/images/pub-tables.png' },
        { id: 11, name: 'Servers', image: '/images/servers.png' },
      ],
    },
    {
      category: 'Living Room',
      items: [
        { id: 5, name: 'Loveseats', image: '/images/loveseats.png' },
        { id: 9, name: 'Reclining Sofas', image: '/images/reclining-sofas.png' },
        { id: 10, name: 'Rocker Recliner', image: '/images/rocker-recliner.png' },
        { id: 12, name: 'Sofas', image: '/images/sofas.png' },
        { id: 13, name: 'Wing Chairs', image: '/images/wing-chairs.png' },
      ],
    },
  ];

  return (
    <>
      <SEO title="Room Planner" description="Interactive room planner" />
      <RoomTools
        setScale={setScale}
        setIsPreview={setIsPreview}
        isPreview={isPreview}
        setShowLabels={setShowLabels}
        exportAsImage={exportAsImage}
        undo={undo} redo={redo}
        canUndo={canUndo} canRedo={canRedo}
        roomDimensions={roomDimensions}
        setRoomDimensions={setRoomDimensions}
      />

      <div className="flex gap-4 p-4">
        <aside className="w-[300px] h-[600px] overflow-y-auto border">
          <FurniturePalette categorizedItems={categorizedItems} />
        </aside>

        <div ref={canvasRef} className="flex-1 border border-gray-400 overflow-auto relative">
          <Canvas
            furniture={furniture}
            setFurniture={setFurniture}
            roomDimensions={roomDimensions}
            scale={scale}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            isPreview={isPreview}
            showLabels={showLabels}
          />
        </div>
      </div>

      <RoomActions setFurniture={setFurniture} />
    </>
  );
}
