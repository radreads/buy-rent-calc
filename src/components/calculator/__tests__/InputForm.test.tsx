import { render, screen } from '@testing-library/react';
import InputForm from '../InputForm';

describe('InputForm', () => {
  it('renders the calculator inputs heading', () => {
    render(<InputForm />);
    expect(screen.getByText('Calculator Inputs')).toBeInTheDocument();
  });

  // More tests will be added as we implement form fields
}); 