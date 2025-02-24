// FurnitureItem.jsx
import { useDrag } from 'react-dnd';

export default function FurnitureItem({ item }) {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'furniture',
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
  
    return (
      <div ref={drag} className={`cursor-move ${isDragging ? 'opacity-50' : ''}`}>
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-20 h-20 object-contain mx-auto"
        />
        <p className="text-xs text-center">{item.name}</p>
      </div>
    );
  }
  