export default function ZoomControls({ onZoomIn, onZoomOut, scale }) {
    const zoomPercentage = Math.round(scale * 100);
  
    return (
      <div className="flex items-center gap-2 border border-gray-300 rounded bg-gray-100 px-2 py-1 shadow-sm text-xs">
        
        {/* Zoom In */}
        <button 
          onClick={onZoomIn} 
          className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
        >
          Zoom In
        </button>
  
        {/* Zoom Percentage */}
        <span className="font-semibold text-gray-800">{zoomPercentage}%</span>
  
        {/* Zoom Out */}
        <button 
          onClick={onZoomOut} 
          className="px-2 py-1 border rounded bg-white hover:bg-gray-200"
        >
          Zoom Out
        </button>
      </div>
    );
  }
  