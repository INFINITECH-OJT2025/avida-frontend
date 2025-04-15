import { useState } from "react";
import { formatPrice, sanitizeCurrencyInput } from "./formatPrice";

export default function CurrencyInput({ onChange, value: initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const cleaned = sanitizeCurrencyInput(e.target.value);
    setValue(cleaned);
    if (onChange) {
      onChange(cleaned);
    }
  };

  const handleBlur = () => {
    const formatted = formatPrice(value).replace("₱", "");
    setValue(formatted);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">Amount</label>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter amount"
        className="border px-3 py-2 rounded w-full"
      />
    </div>
  );
}
