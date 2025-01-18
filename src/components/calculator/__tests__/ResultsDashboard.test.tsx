import { render, screen } from '@testing-library/react';
import ResultsDashboard from '../ResultsDashboard';
import { Scenario } from '@/types/calculator';

// Mock Chart.js to avoid canvas rendering issues in tests
jest.mock('react-chartjs-2', () => ({
  Bar: () => null
}));

describe('ResultsDashboard', () => {
  const mockScenario: Scenario = {
    name: 'Test Scenario',
    rent: {
      monthlyRent: 2000,
      utilities: 200,
      rentersInsurance: 30,
    },
    buy: {
      purchasePrice: 400000,
      downPayment: 80000,
      interestRate: 3.5,
      loanTerm: 30,
      propertyTax: 4000,
      maintenance: 300,
      homeInsurance: 150,
    }
  };

  it('renders the monthly cost comparison title', () => {
    render(<ResultsDashboard scenario={mockScenario} />);
    expect(screen.getByText('Monthly Cost Comparison')).toBeInTheDocument();
  });

  it('displays rent total and breakdown', () => {
    render(<ResultsDashboard scenario={mockScenario} />);
    expect(screen.getByText('Rent Total')).toBeInTheDocument();
    expect(screen.getByText('Rent: $2,000')).toBeInTheDocument();
    expect(screen.getByText('Utilities: $200')).toBeInTheDocument();
    expect(screen.getByText('Insurance: $30')).toBeInTheDocument();
  });

  it('displays buy total and breakdown', () => {
    render(<ResultsDashboard scenario={mockScenario} />);
    expect(screen.getByText('Buy Total')).toBeInTheDocument();
    expect(screen.getByText(/Mortgage: \$[0-9,]+/)).toBeInTheDocument();
    expect(screen.getByText('Property Tax: $333')).toBeInTheDocument();
    expect(screen.getByText('Maintenance: $300')).toBeInTheDocument();
    expect(screen.getByText('Insurance: $150')).toBeInTheDocument();
  });
}); 