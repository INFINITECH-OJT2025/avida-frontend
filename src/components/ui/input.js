export function Input({ className = "", ...props }) {
    return <input className={`border p-1 rounded ${className}`} {...props} />;
  }
  