import { useState, useRef } from 'react';
import FurniturePalette from '@/components/RoomPlanner/FurniturePalette';
import Canvas from '@/components/RoomPlanner/Canvas';
import useExportImage from '@/hooks/useExportImage';
import SEO from '../utils/seo';

export default function RoomPlannerPage() {
  const [furniture, setFurniture] = useState([]);
  const canvasRef = useRef(null);
  const { exportAsImage } = useExportImage();

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
  

  const handleExport = () => {
    if (canvasRef.current) {
      exportAsImage(canvasRef.current, 'my-room-layout.png');
    }
  };

  return (
    <>
      <SEO title="Room Planner" description="Interactive room planner" />
  
      <div className="flex flex-col">
        {/* Top toolbar buttons clearly displayed */}
        <div className="flex gap-2 bg-blue-500 p-2">
          <button className="px-4 py-2 bg-white rounded">New</button>
          <button className="px-4 py-2 bg-white rounded">Add Room</button>
          <button className="px-4 py-2 bg-white rounded">Zoom In</button>
          <button className="px-4 py-2 bg-white rounded">Zoom Out</button>
          <button onClick={handleExport} className="px-4 py-2 bg-white rounded">
            Export & Download
          </button>
        </div>
  
        {/* Main workspace */}
        <div className="flex gap-4 p-4">
          <aside className="w-[300px] h-[600px] overflow-y-auto border">
            <FurniturePalette categorizedItems={categorizedItems} />
          </aside>
  
          <div ref={canvasRef} className="flex-1 border border-gray-400">
            <Canvas furniture={furniture} setFurniture={setFurniture} />
          </div>
        </div>
      </div>
    </>
  );
  
  
}
