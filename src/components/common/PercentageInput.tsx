import { ChangeEvent } from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
}

export default function PercentageInput({
  label,
  value,
  onChange,
  placeholder = "0",
  error
}: Props) {
  const id = `percentage-input-${label.toLowerCase().replace(/\s+/g, '-')}`;

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
        <input
          id={id}
          type="text"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            pr-7 w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            ${error ? 'border-red-500' : ''}
          `}
        />
        <span className="absolute right-3 top-2 text-gray-500">%</span>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 