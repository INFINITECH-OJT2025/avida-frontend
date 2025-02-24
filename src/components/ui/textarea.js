import React from "react";

const Textarea = ({ name, value, onChange, placeholder = "Enter text...", required = false }) => {
  return (
    <textarea
      name={name}
      value={value || ""} // ✅ Ensures value is never undefined
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="border p-2 rounded w-full min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default Textarea;
