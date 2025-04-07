// src\context\ToastContext.js
import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a context
const ToastContext = createContext();

// Define ToastProvider component
export const ToastProvider = ({ children }) => {
    // Function to show a toast notification
    const showToast = (message, type = "info") => {
        toast[type](message); // Uses toast.success, toast.error, etc.
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  pauseOnHover
  draggable
  theme="colored" // 💡 Enables color-based toasts
  toastClassName="custom-toast"
/>

        </ToastContext.Provider>
    );
};

// Custom hook to use toast
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
