import { useState } from 'react';
import FurnitureItem from './FurnitureItem';

export default function FurniturePalette({ categorizedItems = [] }) {
    const [openCategory, setOpenCategory] = useState(null);
  
    const toggleCategory = (category) => {
      setOpenCategory(openCategory === category ? null : category);
    };
  
    return (
      <div className="space-y-2 overflow-y-auto max-h-[600px] bg-white shadow-md p-4">
        {categorizedItems.map((category, index) => (
          <div key={index}>
            <button
              className="w-full text-left py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md font-semibold"
              onClick={() => toggleCategory(category.category)}
            >
              {category.category}
            </button>
  
            {openCategory === category.category && (
              <div className="grid grid-cols-2 gap-2 py-2">
                {category.items.map((item) => (
                  <FurnitureItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  