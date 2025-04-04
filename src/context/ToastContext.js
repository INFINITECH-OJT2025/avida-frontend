// src/context/ToastContext.js
import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  // ✅ Centralized toast function with unique toastId per message
  const showToast = (message, type = "info") => {
    const toastId = `toast-${message.replace(/\s+/g, '-').toLowerCase()}`;
    
    if (!toast.isActive(toastId)) {
      toast[type](message, {
        toastId,
      });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastClassName="custom-toast"
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
