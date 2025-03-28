// import { useState } from "react";

// export default function useRoomItemsManager() {
//   const [furnitureItems, setFurnitureItems] = useState([]);
//   const [textItems, setTextItems] = useState([]);

//   // ✅ Add a new furniture item
//   const addFurniture = (type) => {
//     setFurnitureItems((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         type,
//         x: 100,
//         y: 100,
//         width: 100,
//         height: 100,
//         locked: false,
//       },
//     ]);
//   };

//   // ✅ Update a furniture item's position or size
//   const updateFurniture = (id, updatedData) => {
//     setFurnitureItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
//     );
//   };

//   // ✅ Remove a furniture item
//   const deleteFurniture = (id) => {
//     setFurnitureItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // ✅ Toggle lock state
//   const toggleLockFurniture = (id) => {
//     setFurnitureItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item))
//     );
//   };

//   // ✅ Add a new text item
//   const addTextBox = () => {
//     setTextItems((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         text: "Double Click to Edit",
//         x: 150,
//         y: 150,
//         locked: false,
//       },
//     ]);
//   };

//   // ✅ Update a text item
//   const updateText = (id, updatedData) => {
//     setTextItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
//     );
//   };

//   // ✅ Remove a text item
//   const deleteText = (id) => {
//     setTextItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   // ✅ Toggle lock state for text item
//   const toggleLockText = (id) => {
//     setTextItems((prev) =>
//       prev.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item))
//     );
//   };

//   return {
//     furnitureItems,
//     textItems,
//     addFurniture,
//     updateFurniture,
//     deleteFurniture,
//     toggleLockFurniture,
//     addTextBox,
//     updateText,
//     deleteText,
//     toggleLockText,
//   };
// }
