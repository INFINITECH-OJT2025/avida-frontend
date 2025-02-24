import { useState, useEffect } from "react";

export function Select({ value, onChange, options = [], className = "" }) {
    return (
      <div className={`relative ${className}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#990e15] focus:border-[#990e15]"
        >
          <option value="" disabled>Select an option</option>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </select>
      </div>
    );
  }
  

export function SelectTrigger({ children, className = "" }) {
  return <div className={`cursor-pointer p-2 border rounded ${className}`}>{children}</div>;
}

export function SelectContent({ children, className = "" }) {
  return <div className={`absolute z-10 bg-white shadow-md rounded ${className}`}>{children}</div>;
}


export function SelectItem({ value, children }) {
    return <option value={value}>{children}</option>;
  }

export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}
