import { useState, useEffect } from "react";

interface CurrencyInputProps {
  value: string | number;
  onChange: (raw: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const formatDisplay = (raw: string | number): string => {
  if (raw === "" || raw === null || raw === undefined) return "";
  const n = Number(raw);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Plain-number input that shows "200,000.00" once you leave the field, but
// stays as raw digits while typing so commas don't fight the text cursor.
// onChange always receives a plain numeric string (no separators) so callers
// can keep storing/POSTing a normal number.
export const CurrencyInput = ({ value, onChange, placeholder, required, disabled, className = "", id }: CurrencyInputProps) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(value === "" || value == null ? "" : String(value));

  useEffect(() => {
    if (!focused) setDraft(value === "" || value == null ? "" : String(value));
  }, [value, focused]);

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      value={focused ? draft : formatDisplay(value)}
      onFocus={() => {
        setFocused(true);
        setDraft(value === "" || value == null ? "" : String(value));
      }}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/[^0-9.]/g, "");
        const parts = cleaned.split(".");
        const safe = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
        setDraft(safe);
        onChange(safe);
      }}
      onBlur={() => setFocused(false)}
      className={className}
    />
  );
};
