import { useState, useEffect, useRef } from "react";

export default function ExportToolbar({ canvasRef, canvasSize, scale, gridSize, position, onLoadLayout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportJSON = () => {
    const data = { canvasSize, scale, gridSize, position };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "room-planner.json";
    link.click();
    setShowDropdown(false);
  };

  const handleExportJPEG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/jpeg");
    link.download = "room-planner.jpeg";
    link.click();
    setShowDropdown(false);
  };

  const handleExportPDF = () => {
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.default();
      doc.text("Room Planner Export", 10, 10);
      doc.addImage(canvasRef.current.toDataURL("image/jpeg"), "JPEG", 10, 20, 180, 100);
      doc.save("room-planner.pdf");
    });
    setShowDropdown(false);
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.canvasSize && importedData.scale !== undefined && importedData.gridSize && importedData.position) {
          onLoadLayout(importedData);
          alert("Layout successfully loaded!");
        } else {
          alert("Invalid file format");
        }
      } catch (error) {
        alert("Error loading file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative text-[10px]">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-2 py-1 border border-gray-400 rounded shadow-sm hover:bg-gray-200"
      >
        Export / Import
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-1 w-36 bg-white border border-gray-300 rounded shadow-md z-10"
        >
          <button className="w-full px-2 py-1 text-left hover:bg-gray-100 border-b" onClick={handleExportJSON}>
            Export as JSON
          </button>
          <button className="w-full px-2 py-1 text-left hover:bg-gray-100 border-b" onClick={handleExportJPEG}>
            Export as JPEG
          </button>
          <button className="w-full px-2 py-1 text-left hover:bg-gray-100 border-b" onClick={handleExportPDF}>
            Export as PDF
          </button>
          <label className="w-full px-2 py-1 text-left hover:bg-gray-100 cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImportJSON}
            />
          </label>
        </div>
      )}
    </div>
  );
}
