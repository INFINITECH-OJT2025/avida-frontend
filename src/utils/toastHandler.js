// src/utils/toastHandler.js
import { toast } from "react-toastify";

export const showGlobalToast = (message, type = "info") => {
  if (!message) return;
  toast[type](message); // e.g. toast.success("msg"), toast.error("msg")
};
