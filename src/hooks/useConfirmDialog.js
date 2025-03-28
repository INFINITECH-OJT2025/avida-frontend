import { useState } from "react";

export default function useConfirmDialog() {
  const [dialog, setDialog] = useState({
    message: "",
    onConfirm: null,
    isOpen: false,
  });

  const showConfirm = (message, onConfirm) => {
    setDialog({ message, onConfirm, isOpen: true });
  };

  const ConfirmDialog = () =>
    dialog.isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-md w-[360px] shadow-xl text-center">
          <p className="text-gray-800 mb-6 text-sm">{dialog.message}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                dialog.onConfirm();
                setDialog({ ...dialog, isOpen: false });
              }}
              className="px-4 py-2 bg-[#990e15] text-white rounded-md hover:bg-red-800"
            >
              Yes
            </button>
            <button
              onClick={() => setDialog({ ...dialog, isOpen: false })}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ) : null;

  return { showConfirm, ConfirmDialog };
}
