// import { useState, useEffect, useRef } from "react";
// import { Lock, Unlock } from "lucide-react";
// import ZoomControls from "./ZoomControls";
// import SnapToGrid from "./SnapToGrid";
// import TextItem from "./TextItem";
// import ExportToolbar from "./ExportToolbar";
// import RoomGridControls from "./RoomGridControls";

// export default function RoomGrid() {
//   const [gridSize, setGridSize] = useState(50);
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);
//   const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 500 });
//   const [scale, setScale] = useState(1);
//   const positionRef = useRef({ x: 0, y: 0 });
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const startDragRef = useRef({ x: 0, y: 0 });
//   const animationFrameRef = useRef(null);
//   const [textItems, setTextItems] = useState([]);
//   const isDraggingTextRef = useRef(false);
//   const [lockCanvas, setLockCanvas] = useState(false);

//   const drawGrid = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.strokeStyle = "#ddd";
//     ctx.lineWidth = 1;
//     for (let x = 0; x <= canvasSize.width; x += gridSize * scale) {
//       ctx.beginPath();
//       ctx.moveTo(x, 0);
//       ctx.lineTo(x, canvasSize.height);
//       ctx.stroke();
//     }
//     for (let y = 0; y <= canvasSize.height; y += gridSize * scale) {
//       ctx.beginPath();
//       ctx.moveTo(0, y);
//       ctx.lineTo(canvasSize.width, y);
//       ctx.stroke();
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     canvas.width = canvasSize.width;
//     canvas.height = canvasSize.height;
//     const savedSettings = JSON.parse(localStorage.getItem("roomGridSettings"));
//     if (savedSettings && !canvas.dataset.loaded) {
//       setCanvasSize(savedSettings.canvasSize);
//       setScale(savedSettings.scale);
//       setPosition(savedSettings.position);
//       setGridSize(savedSettings.gridSize);
//       canvas.dataset.loaded = "true";
//       return;
//     }
//     drawGrid();
//     const handleKeyMove = (e) => {
//       const step = 10;
//       let newX = positionRef.current.x;
//       let newY = positionRef.current.y;
//       if (e.key === "ArrowUp") newY -= step;
//       if (e.key === "ArrowDown") newY += step;
//       if (e.key === "ArrowLeft") newX -= step;
//       if (e.key === "ArrowRight") newX += step;
//       positionRef.current = { x: newX, y: newY };
//       setPosition({ x: newX, y: newY });
//     };
//     window.addEventListener("keydown", handleKeyMove);
//     localStorage.setItem("roomGridSettings", JSON.stringify({ canvasSize, scale, position, gridSize }));
//     return () => window.removeEventListener("keydown", handleKeyMove);
//   }, [canvasSize, gridSize, scale, position]);

//   const handleMouseDown = (e) => {
//     const target = e.target.closest(".text-item");
//     if (target) {
//       isDraggingTextRef.current = true;
//       return;
//     }
//     if (lockCanvas) return;
//     setIsDragging(true);
//     const rect = containerRef.current.getBoundingClientRect();
//     startDragRef.current = {
//       x: e.clientX - rect.left - positionRef.current.x,
//       y: e.clientY - rect.top - positionRef.current.y,
//     };
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging || isDraggingTextRef.current || lockCanvas) return;
//     const container = containerRef.current;
//     if (!container) return;
//     const rect = container.getBoundingClientRect();
//     const newX = e.clientX - rect.left - startDragRef.current.x;
//     const newY = e.clientY - rect.top - startDragRef.current.y;
//     const canvasWidth = canvasSize.width * scale;
//     const canvasHeight = canvasSize.height * scale;
//     const visibleWidth = container.clientWidth / 2;
//     const visibleHeight = container.clientHeight / 2;
//     const minX = container.clientWidth - canvasWidth;
//     const maxX = 0;
//     const minY = container.clientHeight - canvasHeight;
//     const maxY = 0;
//     const clampedX = Math.min(maxX + visibleWidth, Math.max(minX - visibleWidth, newX));
//     const clampedY = Math.min(maxY + visibleHeight, Math.max(minY - visibleHeight, newY));
//     positionRef.current = { x: clampedX, y: clampedY };
//     if (!animationFrameRef.current) {
//       animationFrameRef.current = requestAnimationFrame(() => {
//         setPosition({ ...positionRef.current });
//         animationFrameRef.current = null;
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     isDraggingTextRef.current = false;
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//       animationFrameRef.current = null;
//     }
//   };

//   const handleZoom = (e) => {
//     if (e.shiftKey) return;
//     if (e.cancelable) e.preventDefault();
//     const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
//     setScale((prevScale) => Math.max(0.5, Math.min(prevScale * zoomFactor, 2)));
//     requestAnimationFrame(() => drawGrid());
//   };

//   const addTextBox = () => {
//     setTextItems((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         text: "Double Click to Edit",
//         x: canvasSize.width / 2 - 75,
//         y: canvasSize.height / 2 - 20,
//         locked: false
//       },
//     ]);
//   };

//   const updateText = (id, updatedData) => {
//     setTextItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item)));
//   };

//   const deleteText = (id) => {
//     setTextItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const toggleLockText = (id) => {
//     setTextItems((prev) => prev.map((item) => item.id === id ? { ...item, locked: !item.locked } : item));
//   };

//   return (
//     <div
//       className="flex flex-col items-start w-full h-screen bg-gray-100 p-4 relative"
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//     >
//       <h1 className="text-3xl font-bold mb-4">Room Planner</h1>
//  {/* Toolbar */}
//  <div className="w-full bg-white shadow p-2 flex items-center border-b border-gray-200 fixed top-0 left-0 z-10 gap-2 rounded-md">
//  <button 
//   onClick={addTextBox}
//   className="px-3 py-1 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 transition text-sm"
// >
//   Add Text Box
// </button>

        
//         <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
//           <label className="text-xs text-gray-600">Canvas:</label><label className="text-xs text-gray-600">Canvas:</label>
//           <input 
//             type="number" 
//             value={canvasSize.width} 
//             onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value, 10) }))} 
//             className="border border-gray-300 p-1 w-16 text-center rounded bg-white text-xs"
//           />
//           x
//           <label className="text-xs text-gray-600">Height</label>
//           <input 
//             type="number" 
//             value={canvasSize.height} 
//             onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value, 10) }))} 
//             className="border border-gray-300 p-1 w-16 text-center rounded bg-white text-xs"
//           />
//         </div>
        
//         <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
//           <label className="text-xs text-gray-600">Grid:</label>
//           <input 
//             type="number" 
//             value={gridSize} 
//             onChange={(e) => setGridSize(Math.max(10, Math.min(200, parseInt(e.target.value) || 50)))} 
//             className="border border-gray-300 p-1 w-16 text-center rounded bg-white text-xs"
//           />
//         </div>
        
//         <ExportToolbar canvasSize={canvasSize} scale={scale} gridSize={gridSize} />
        
//         <div className="ml-auto flex items-center gap-2">
//           <RoomGridControls
//             onZoomIn={() => setScale(prev => Math.min(prev * 1.1, 2))}
//             onZoomOut={() => setScale(prev => Math.max(prev * 0.9, 0.5))}
//             scale={scale}
//             onReset={() => {
//               setCanvasSize({ width: 1000, height: 500 });
//               setScale(1);
//               setGridSize(50);
//               setLockCanvas(false);
//             }}
//           />
        
//           {/* Canvas Lock Button with Label */}
//           <button
//             onClick={() => setLockCanvas(prev => !prev)}
//             className="px-3 py-1 border border-gray-300 rounded-md shadow-sm bg-gray-100 hover:bg-gray-200 transition text-sm"
//           >
//             {lockCanvas ? <Unlock size={14} className="text-red-500" /> : <Lock size={14} className="text-green-600" />} 
//             {lockCanvas ? "Unlock Canvas" : "Lock Canvas"}
//           </button>
//         </div>
//       </div>
//       <div
//         ref={containerRef}
//         className="border border-gray-800 flex items-center justify-center bg-white shadow-lg overflow-hidden"
//         style={{ position: "absolute", top: "60px", left: "25%", width: "75%", height: "calc(90% - 60px)" }}
//         onMouseDown={handleMouseDown}
//         onWheel={handleZoom}
//       >
//         <div
//           className="flex items-center justify-center"
//           style={{
//             transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
//             transformOrigin: "top left",
//             width: `${canvasSize.width}px`,
//             height: `${canvasSize.height}px`,
//             position: "relative",
//           }}
//         >
//           <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="border border-gray-400"></canvas>
//           {textItems.map((item) => (
//   <TextItem
//     key={item.id}
//     id={item.id}
//     text={item.text}
//     x={item.x}
//     y={item.y}
//     locked={item.locked}
//     gridSize={gridSize}
//     canvasSize={canvasSize}
//     onUpdate={updateText}
//     onDelete={deleteText}
//     onToggleLock={toggleLockText}
//   />
// ))}


//         </div>

//       </div>
//     </div>
//   );
// }
