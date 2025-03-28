import { useEffect, useState } from "react";

export default function RoomGridControls({
  onZoomIn,
  onZoomOut,
  scale,
  onReset,
  onSave,
  onLoad,
}) {
  const [zoomPercent, setZoomPercent] = useState(100);

  useEffect(() => {
    setZoomPercent(Math.round(scale * 100));
  }, [scale]);

  return (
    <div className="flex items-center gap-2 border border-gray-300 bg-white p-1 rounded shadow-sm text-xs">
      {/* Zoom In */}
      <button onClick={onZoomIn} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
       + Zoom In
      </button>

      {/* Zoom Percentage */}
      <span className="font-semibold">{zoomPercent}%</span>

      {/* Zoom Out */}
      <button onClick={onZoomOut} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
        – Zoom Out
      </button>

      {/* Divider */}
      <span className="w-px h-4 bg-gray-400"></span>

      {/* Reset Button */}
      <button onClick={onReset} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
        Reset Layout
      </button>

      {/* Save Button */}
      <button onClick={onSave} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
        Save Layout
      </button>

      {/* Load Button */}
      <button onClick={onLoad} className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200">
        Load Layout
      </button>
    </div>
  );
}
