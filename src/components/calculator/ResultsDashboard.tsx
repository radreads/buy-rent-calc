import { Scenario } from '@/types/calculator';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Props {
  scenario: Scenario;
}

export default function ResultsDashboard({ scenario }: Props) {
  // Calculate monthly mortgage payment
  const calculateMortgage = () => {
    const principal = scenario.buy.purchasePrice - scenario.buy.downPayment;
    const monthlyRate = scenario.buy.interestRate / 100 / 12;
    const numberOfPayments = scenario.buy.loanTerm * 12;
    
    const mortgage = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return Math.round(mortgage);
  };

  // Calculate total monthly costs
  const rentTotal = scenario.rent.monthlyRent + 
    scenario.rent.utilities + 
    scenario.rent.rentersInsurance;

  const buyTotal = calculateMortgage() + 
    (scenario.buy.propertyTax / 12) + 
    scenario.buy.maintenance + 
    scenario.buy.homeInsurance;

  const data = {
    labels: ['Monthly Costs'],
    datasets: [
      {
        label: 'Rent',
        data: [rentTotal],
        backgroundColor: '#ec4899', // Pink from our color scheme
      },
      {
        label: 'Buy',
        data: [buyTotal],
        backgroundColor: '#8b5cf6', // Purple from our color scheme
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `$${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Monthly Cost Comparison</h2>
      
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-pink-50 rounded-lg">
          <h3 className="font-medium text-pink-700">Rent Total</h3>
          <p className="text-2xl font-bold text-pink-600">
            ${rentTotal.toLocaleString()}/mo
          </p>
          <div className="mt-2 space-y-1 text-sm text-pink-600">
            <p>Rent: ${scenario.rent.monthlyRent.toLocaleString()}</p>
            <p>Utilities: ${scenario.rent.utilities.toLocaleString()}</p>
            <p>Insurance: ${scenario.rent.rentersInsurance.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium text-purple-700">Buy Total</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${buyTotal.toLocaleString()}/mo
          </p>
          <div className="mt-2 space-y-1 text-sm text-purple-600">
            <p>Mortgage: ${calculateMortgage().toLocaleString()}</p>
            <p>Property Tax: ${Math.round(scenario.buy.propertyTax / 12).toLocaleString()}</p>
            <p>Maintenance: ${scenario.buy.maintenance.toLocaleString()}</p>
            <p>Insurance: ${scenario.buy.homeInsurance.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 