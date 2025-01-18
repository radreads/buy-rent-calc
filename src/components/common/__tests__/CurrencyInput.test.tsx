import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyInput from '../CurrencyInput';

describe('CurrencyInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with label', () => {
    render(
      <CurrencyInput
        label="Test Label"
        value={0}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('displays formatted value', () => {
    render(
      <CurrencyInput
        label="Amount"
        value={1234.56}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('1,234.56');
  });

  it('shows empty input when value is 0', () => {
    render(
      <CurrencyInput
        label="Amount"
        value={0}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('displays error message when provided', () => {
    render(
      <CurrencyInput
        label="Amount"
        value={0}
        onChange={mockOnChange}
        error="Invalid amount"
      />
    );
    expect(screen.getByText('Invalid amount')).toBeInTheDocument();
  });

  it('calls onChange with numeric value', () => {
    render(
      <CurrencyInput
        label="Amount"
        value={0}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.45' } });
    expect(mockOnChange).toHaveBeenCalledWith(123.45);
  });

  it('handles invalid input gracefully', () => {
    render(
      <CurrencyInput
        label="Amount"
        value={0}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });
}); 