import { render, screen, fireEvent } from '@testing-library/react';
import PercentageInput from '../PercentageInput';

describe('PercentageInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with label', () => {
    render(
      <PercentageInput
        label="Test Label"
        value={0}
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('displays value', () => {
    render(
      <PercentageInput
        label="Rate"
        value={3.5}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('3.5');
  });

  it('shows empty input when value is 0', () => {
    render(
      <PercentageInput
        label="Rate"
        value={0}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('displays error message when provided', () => {
    render(
      <PercentageInput
        label="Rate"
        value={0}
        onChange={mockOnChange}
        error="Invalid percentage"
      />
    );
    expect(screen.getByText('Invalid percentage')).toBeInTheDocument();
  });

  it('calls onChange with numeric value', () => {
    render(
      <PercentageInput
        label="Rate"
        value={0}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '3.5' } });
    expect(mockOnChange).toHaveBeenCalledWith(3.5);
  });

  it('handles invalid input gracefully', () => {
    render(
      <PercentageInput
        label="Rate"
        value={0}
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });
}); 