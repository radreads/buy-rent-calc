import { render, screen, fireEvent } from '@testing-library/react';
import RentInputs from '../RentInputs';
import { RentScenario } from '@/types/calculator';

describe('RentInputs', () => {
  const mockValues: RentScenario = {
    monthlyRent: 2000,
    utilities: 200,
    rentersInsurance: 30,
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all input fields', () => {
    render(<RentInputs values={mockValues} onChange={mockOnChange} />);
    
    expect(screen.getByText('Monthly Rent')).toBeInTheDocument();
    expect(screen.getByText('Monthly Utilities')).toBeInTheDocument();
    expect(screen.getByText("Renter's Insurance")).toBeInTheDocument();
  });

  it('displays current values', () => {
    render(<RentInputs values={mockValues} onChange={mockOnChange} />);
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveValue('2,000');
    expect(inputs[1]).toHaveValue('200');
    expect(inputs[2]).toHaveValue('30');
  });

  it('calls onChange with updated values', () => {
    render(<RentInputs values={mockValues} onChange={mockOnChange} />);
    
    const rentInput = screen.getByLabelText('Monthly Rent');
    fireEvent.change(rentInput, { target: { value: '2500' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValues,
      monthlyRent: 2500,
    });
  });

  it('displays error messages', () => {
    const errors = {
      monthlyRent: 'Required field',
      utilities: 'Must be a positive number',
    };

    render(
      <RentInputs 
        values={mockValues} 
        onChange={mockOnChange} 
        errors={errors}
      />
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.getByText('Must be a positive number')).toBeInTheDocument();
  });
}); 