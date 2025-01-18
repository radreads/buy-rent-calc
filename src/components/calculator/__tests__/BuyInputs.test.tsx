import { render, screen, fireEvent } from '@testing-library/react';
import BuyInputs from '../BuyInputs';
import { BuyScenario } from '@/types/calculator';

describe('BuyInputs', () => {
  const mockValues: BuyScenario = {
    purchasePrice: 400000,
    downPayment: 80000,
    interestRate: 3.5,
    loanTerm: 30,
    propertyTax: 4000,
    maintenance: 300,
    homeInsurance: 150,
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all input fields', () => {
    render(<BuyInputs values={mockValues} onChange={mockOnChange} />);
    
    expect(screen.getByText('Home Price')).toBeInTheDocument();
    expect(screen.getByText('Down Payment')).toBeInTheDocument();
    expect(screen.getByText('Down Payment %')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate')).toBeInTheDocument();
    expect(screen.getByText('Loan Term (Years)')).toBeInTheDocument();
    expect(screen.getByText('Annual Property Tax')).toBeInTheDocument();
    expect(screen.getByText('Monthly Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Monthly Home Insurance')).toBeInTheDocument();
  });

  it('displays current values', () => {
    render(<BuyInputs values={mockValues} onChange={mockOnChange} />);
    
    expect(screen.getByLabelText('Home Price')).toHaveValue('400,000');
    expect(screen.getByLabelText('Down Payment')).toHaveValue('80,000');
    expect(screen.getByLabelText('Down Payment %')).toHaveValue('20');
    expect(screen.getByLabelText('Interest Rate')).toHaveValue('3.5');
  });

  it('updates down payment amount when percentage changes', () => {
    render(<BuyInputs values={mockValues} onChange={mockOnChange} />);
    
    const percentInput = screen.getByLabelText('Down Payment %');
    fireEvent.change(percentInput, { target: { value: '25' } });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockValues,
      downPayment: 100000, // 25% of 400000
    });
  });

  it('displays error messages', () => {
    const errors = {
      purchasePrice: 'Required field',
      interestRate: 'Must be between 0 and 100',
    };

    render(
      <BuyInputs 
        values={mockValues} 
        onChange={mockOnChange} 
        errors={errors}
      />
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.getByText('Must be between 0 and 100')).toBeInTheDocument();
  });
}); 