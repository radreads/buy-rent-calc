'use client';
import { Scenario } from '@/types/calculator';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  scenario: Scenario;
}

export default function ResultsDashboard({ scenario }: Props) {
  // Calculate monthly mortgage payment
  const principal = scenario.buy.purchasePrice - scenario.buy.downPayment;
  const monthlyInterest = scenario.buy.interestRate / 100 / 12;
  const totalPayments = scenario.buy.loanTerm * 12;
  
  const monthlyMortgage = principal * 
    (monthlyInterest * Math.pow(1 + monthlyInterest, totalPayments)) /
    (Math.pow(1 + monthlyInterest, totalPayments) - 1);

  // Calculate monthly costs
  const rentMonthlyCosts = {
    'Monthly Rent': scenario.rent.monthlyRent,
    'Utilities': scenario.rent.utilities,
    'Renter\'s Insurance': scenario.rent.rentersInsurance
  };

  const buyMonthlyCosts = {
    'Mortgage Payment': monthlyMortgage,
    'Property Tax': scenario.buy.propertyTax / 12,
    'Home Insurance': scenario.buy.homeInsurance,
    'Maintenance': scenario.buy.maintenance,
    'Utilities': scenario.rent.utilities // Assuming same utilities cost
  };

  const totalRentCost = Object.values(rentMonthlyCosts).reduce((a, b) => a + b, 0);
  const totalBuyCost = Object.values(buyMonthlyCosts).reduce((a, b) => a + b, 0);

  // Break-even analysis
  const calculateBreakEven = () => {
    const YEARS_TO_ANALYZE = 30;
    const ANNUAL_RENT_INCREASE = 0.03; // 3% annual rent increase
    const ANNUAL_HOME_APPRECIATION = 0.04; // 4% annual home appreciation
    const INVESTMENT_RETURN_RATE = 0.07; // 7% annual return on investments
    const ANNUAL_MAINTENANCE_INCREASE = 0.02; // 2% annual maintenance cost increase
    const ANNUAL_INSURANCE_INCREASE = 0.03; // 3% annual insurance increase
    const ANNUAL_PROPERTY_TAX_INCREASE = 0.02; // 2% annual property tax increase

    let breakEvenYear = null;
    const yearlyData = [];

    // Initial costs
    let rentCumulative = 0;
    let buyCumulative = scenario.buy.downPayment; // Initial down payment
    let currentRent = totalRentCost;
    let currentMaintenance = scenario.buy.maintenance;
    let currentInsurance = scenario.buy.homeInsurance;
    let currentPropertyTax = scenario.buy.propertyTax / 12;
    let remainingPrincipal = principal;
    let homeValue = scenario.buy.purchasePrice;
    let downPaymentOpportunityCost = scenario.buy.downPayment;

    for (let year = 1; year <= YEARS_TO_ANALYZE; year++) {
      // Calculate yearly costs for renting
      rentCumulative += currentRent * 12;
      currentRent *= (1 + ANNUAL_RENT_INCREASE);

      // Calculate yearly costs for buying
      const yearlyMortgage = monthlyMortgage * 12;
      const yearlyMaintenance = currentMaintenance * 12;
      const yearlyInsurance = currentInsurance * 12;
      const yearlyPropertyTax = currentPropertyTax * 12;

      // Calculate interest paid and principal reduction
      const yearlyInterestPaid = remainingPrincipal * scenario.buy.interestRate / 100;
      const yearlyPrincipalPaid = yearlyMortgage - yearlyInterestPaid;
      remainingPrincipal -= yearlyPrincipalPaid;

      // Update home value and costs for next year
      homeValue *= (1 + ANNUAL_HOME_APPRECIATION);
      currentMaintenance *= (1 + ANNUAL_MAINTENANCE_INCREASE);
      currentInsurance *= (1 + ANNUAL_INSURANCE_INCREASE);
      currentPropertyTax *= (1 + ANNUAL_PROPERTY_TAX_INCREASE);

      // Calculate opportunity cost of down payment
      downPaymentOpportunityCost *= (1 + INVESTMENT_RETURN_RATE);

      // Total buying costs including opportunity cost
      const yearlyBuyingCost = yearlyMortgage + yearlyMaintenance + 
        yearlyInsurance + yearlyPropertyTax;
      buyCumulative += yearlyBuyingCost;

      // Calculate net worth difference
      const buyerNetWorth = homeValue - remainingPrincipal - buyCumulative;
      const renterNetWorth = downPaymentOpportunityCost - rentCumulative;

      yearlyData.push({
        year,
        rentCumulative,
        buyCumulative,
        buyerNetWorth,
        renterNetWorth,
      });

      // Check for break-even point
      if (buyerNetWorth > renterNetWorth && breakEvenYear === null) {
        breakEvenYear = year;
      }
    }

    return {
      breakEvenYear,
      yearlyData
    };
  };

  const breakEvenAnalysis = calculateBreakEven();

  const chartData = {
    labels: ['Monthly Costs'],
    datasets: [
      {
        label: 'Renting',
        data: [totalRentCost],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Buying',
        data: [totalBuyCost],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Cost Comparison',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string, index: number, ticks: any[]) {
            if (typeof tickValue !== 'number') return '';
            return `$${tickValue.toLocaleString()}`;
          }
        }
      }
    }
  } as const;

  // Create net worth comparison chart data
  const netWorthChartData = {
    labels: breakEvenAnalysis.yearlyData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Renter Net Worth',
        data: breakEvenAnalysis.yearlyData.map(d => d.renterNetWorth),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Buyer Net Worth',
        data: breakEvenAnalysis.yearlyData.map(d => d.buyerNetWorth),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const netWorthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Net Worth Comparison Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string, index: number, ticks: any[]) {
            if (typeof tickValue !== 'number') return '';
            return `$${tickValue.toLocaleString()}`;
          }
        }
      }
    }
  } as const;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Cost Comparison</h2>
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Renting Costs</h3>
          <dl className="space-y-2">
            {Object.entries(rentMonthlyCosts).map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-gray-600">{label}</dt>
                <dd className="text-gray-900 font-medium">
                  ${value.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <dt className="text-gray-900">Total Monthly Cost</dt>
                <dd className="text-gray-900">
                  ${totalRentCost.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Buying Costs</h3>
          <dl className="space-y-2">
            {Object.entries(buyMonthlyCosts).map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-gray-600">{label}</dt>
                <dd className="text-gray-900 font-medium">
                  ${value.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between font-semibold">
                <dt className="text-gray-900">Total Monthly Cost</dt>
                <dd className="text-gray-900">
                  ${totalBuyCost.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Break-Even Analysis</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600">
            Based on the current scenario, buying will break even with renting in approximately{' '}
            <span className="font-semibold text-gray-900">
              {breakEvenAnalysis.breakEvenYear} years
            </span>
            , assuming:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• 3% annual rent increase</li>
            <li>• 4% annual home appreciation</li>
            <li>• 7% annual return on investments</li>
            <li>• 2% annual maintenance cost increase</li>
            <li>• 3% annual insurance increase</li>
            <li>• 2% annual property tax increase</li>
          </ul>
        </div>
        
        <div className="h-[400px]">
          <Line 
            data={netWorthChartData} 
            options={netWorthChartOptions}
          />
        </div>
      </div>
    </div>
  );
} 