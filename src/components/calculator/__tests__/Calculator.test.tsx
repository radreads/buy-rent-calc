import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../Calculator';

describe('Calculator', () => {
  it('renders both rent and buy sections', () => {
    render(<Calculator />);
    
    // Check for section headings
    expect(screen.getByText('Rent Details')).toBeInTheDocument();
    expect(screen.getByText('Purchase Details')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('updates rent values correctly', () => {
    render(<Calculator />);
    
    const rentInput = screen.getByLabelText('Monthly Rent');
    fireEvent.change(rentInput, { target: { value: '2500' } });

    // The input should show the new value
    expect(rentInput).toHaveValue('2,500');
  });

  it('updates buy values correctly', () => {
    render(<Calculator />);
    
    const priceInput = screen.getByLabelText('Home Price');
    fireEvent.change(priceInput, { target: { value: '450000' } });

    // The input should show the new value
    expect(priceInput).toHaveValue('450,000');
  });

  it('maintains independent state for rent and buy sections', () => {
    render(<Calculator />);
    
    // Change rent value
    const rentInput = screen.getByLabelText('Monthly Rent');
    fireEvent.change(rentInput, { target: { value: '2500' } });

    // Change buy value
    const priceInput = screen.getByLabelText('Home Price');
    fireEvent.change(priceInput, { target: { value: '450000' } });

    // Both inputs should maintain their values
    expect(rentInput).toHaveValue('2,500');
    expect(priceInput).toHaveValue('450,000');
  });
}); 