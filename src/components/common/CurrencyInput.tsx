import { ChangeEvent } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
}

export default function CurrencyInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "0",
  error 
}: Props) {
  const id = `currency-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(numericValue);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="mb-4">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-2 text-gray-500">$</span>
        <input
          id={id}
          type="text"
          value={value === 0 ? '' : value.toLocaleString()}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            pl-7 w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            hover:border-gray-400 transition-colors
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 