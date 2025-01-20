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
  PointElement,
  Filler
} from 'chart.js';
import React from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface YearlyData {
  year: number;
  rentCumulative: number;
  buyCumulative: number;
  buyerNetWorth: number;
  renterNetWorth: number;
  propertyValue: number;
  remainingMortgage: number;
  investmentPortfolio: number;
  equityBuildup: number;
  yearlyWealthChangeRent: number;
  yearlyWealthChangeBuy: number;
}

interface Props {
  scenario: Scenario;
  onAnalysisComplete?: (breakEvenYear: number | null) => void;
}

export default function ResultsDashboard({ scenario, onAnalysisComplete }: Props) {
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

  // Break-even and wealth change analysis
  const calculateAnalysis = () => {
    const YEARS_TO_ANALYZE = scenario.timeHorizon;
    const ANNUAL_RENT_INCREASE = scenario.assumptions.annualRentIncrease / 100;
    const ANNUAL_HOME_APPRECIATION = scenario.assumptions.annualHomeAppreciation / 100;
    const INVESTMENT_RETURN_RATE = scenario.assumptions.annualInvestmentReturn / 100;
    const ANNUAL_MAINTENANCE_INCREASE = scenario.assumptions.annualMaintenanceIncrease / 100;
    const ANNUAL_INSURANCE_INCREASE = scenario.assumptions.annualInsuranceIncrease / 100;
    const ANNUAL_PROPERTY_TAX_INCREASE = scenario.assumptions.annualPropertyTaxIncrease / 100;

    let breakEvenYear = null;
    const yearlyData: YearlyData[] = [];

    // Initial values
    let rentCumulative = 0;
    let buyCumulative = 0;
    let currentRent = scenario.rent.monthlyRent;
    let currentMaintenance = scenario.buy.maintenance;
    let currentInsurance = scenario.buy.homeInsurance;
    let currentPropertyTax = scenario.buy.propertyTax / 12;
    let remainingPrincipal = principal;
    let homeValue = scenario.buy.purchasePrice;
    let investmentPortfolio = scenario.buy.downPayment; // Initial investment for renter
    let lastRenterNetWorth = 0;
    let lastBuyerNetWorth = 0;

    for (let year = 1; year <= YEARS_TO_ANALYZE; year++) {
      // Calculate yearly costs for renting
      const yearlyRent = currentRent * 12;
      rentCumulative += yearlyRent;
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

      // Update property value and costs for next year
      homeValue *= (1 + ANNUAL_HOME_APPRECIATION);
      currentMaintenance *= (1 + ANNUAL_MAINTENANCE_INCREASE);
      currentInsurance *= (1 + ANNUAL_INSURANCE_INCREASE);
      currentPropertyTax *= (1 + ANNUAL_PROPERTY_TAX_INCREASE);

      // Monthly savings for renter (difference between buy and rent costs)
      const monthlySavings = totalBuyCost - totalRentCost;

      // Investment portfolio growth (down payment + monthly savings)
      investmentPortfolio *= (1 + INVESTMENT_RETURN_RATE);
      investmentPortfolio += monthlySavings * 12;

      // Calculate yearly costs for buying (excluding mortgage payment)
      const yearlyBuyingCost = yearlyMaintenance + yearlyInsurance + yearlyPropertyTax;
      buyCumulative += yearlyBuyingCost;

      // Calculate net worth positions
      const buyerNetWorth = homeValue - remainingPrincipal;
      const renterNetWorth = investmentPortfolio;

      // Calculate yearly wealth changes
      const yearlyWealthChangeRent = year === 1 ? 0 : ((renterNetWorth - lastRenterNetWorth) / Math.abs(lastRenterNetWorth)) * 100;
      const yearlyWealthChangeBuy = year === 1 ? 0 : ((buyerNetWorth - lastBuyerNetWorth) / Math.abs(lastBuyerNetWorth)) * 100;

      yearlyData.push({
        year,
        rentCumulative,
        buyCumulative,
        buyerNetWorth,
        renterNetWorth,
        propertyValue: homeValue,
        remainingMortgage: remainingPrincipal,
        investmentPortfolio,
        equityBuildup: homeValue - remainingPrincipal,
        yearlyWealthChangeRent,
        yearlyWealthChangeBuy,
      });

      // Update last net worth values
      lastRenterNetWorth = renterNetWorth;
      lastBuyerNetWorth = buyerNetWorth;

      // Check for break-even point
      if (buyerNetWorth > renterNetWorth && breakEvenYear === null) {
        breakEvenYear = year;
      }
    }

    // If we never break even within the analysis period, set breakEvenYear to null
    if (yearlyData[yearlyData.length - 1].renterNetWorth > yearlyData[yearlyData.length - 1].buyerNetWorth) {
      breakEvenYear = null;
    }

    return {
      breakEvenYear,
      yearlyData
    };
  };

  const analysis = calculateAnalysis();

  // Call the callback with break-even year
  React.useEffect(() => {
    onAnalysisComplete?.(analysis.breakEvenYear);
  }, [analysis.breakEvenYear, onAnalysisComplete]);

  // Monthly cost comparison chart
  const monthlyComparisonData = {
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

  // Wealth components chart
  const wealthComponentsData = {
    labels: analysis.yearlyData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Property Value',
        data: analysis.yearlyData.map(d => d.propertyValue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Remaining Mortgage',
        data: analysis.yearlyData.map(d => d.remainingMortgage),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Investment Portfolio',
        data: analysis.yearlyData.map(d => d.investmentPortfolio),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Net worth comparison chart
  const netWorthData = {
    labels: analysis.yearlyData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Renter Net Worth',
        data: analysis.yearlyData.map(d => d.renterNetWorth),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Buyer Net Worth',
        data: analysis.yearlyData.map(d => d.buyerNetWorth),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
    <>
      <div className="bg-white rounded-lg shadow p-6 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Break-even Analysis</h2>
          <div className="h-[400px]">
            <Line 
              data={{
                labels: analysis.yearlyData.map(d => `Year ${d.year}`),
                datasets: [
                  {
                    label: 'Cost Difference (Buy - Rent)',
                    data: analysis.yearlyData.map(d => d.buyCumulative - d.rentCumulative),
                    borderColor: 'rgb(234, 88, 12)',
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    tension: 0.1,
                    fill: true
                  }
                ]
              }}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Cumulative Cost Difference Over Time'
                  }
                },
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    title: {
                      display: true,
                      text: 'Buy Cost - Rent Cost ($)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Net Worth Comparison</h2>
          <div className="h-[400px]">
            <Line 
              data={netWorthData}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  title: {
                    display: true,
                    text: 'Net Worth Over Time'
                  }
                }
              }}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Cost Comparison</h2>
          <div className="h-[300px]">
            <Bar data={monthlyComparisonData} options={chartOptions} />
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wealth Analysis</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-600">
              Based on the current scenario, buying will break even with renting in approximately{' '}
              <span className="font-semibold text-gray-900">
                {analysis.breakEvenYear} years
              </span>
              , assuming:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• {scenario.assumptions.annualRentIncrease}% annual rent increase</li>
              <li>• {scenario.assumptions.annualHomeAppreciation}% annual home appreciation</li>
              <li>• {scenario.assumptions.annualInvestmentReturn}% annual return on investments</li>
              <li>• {scenario.assumptions.annualMaintenanceIncrease}% annual maintenance cost increase</li>
              <li>• {scenario.assumptions.annualInsuranceIncrease}% annual insurance increase</li>
              <li>• {scenario.assumptions.annualPropertyTaxIncrease}% annual property tax increase</li>
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Wealth Components Over Time</h3>
              <div className="h-[400px]">
                <Line 
                  data={wealthComponentsData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      title: {
                        display: true,
                        text: 'Property Value vs Investment Portfolio'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed analysis section with full width */}
      <div className="relative w-[100vw] left-[50%] right-[50%] -mx-[50vw] bg-white shadow mt-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 p-6">Detailed Analysis</h2>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={5}>
                      Renting Scenario
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={7}>
                      Buying Scenario
                    </th>
                  </tr>
                  <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 bg-gray-50"></th>
                    {/* Renting columns */}
                    <th className="px-4 py-3 bg-gray-50 text-right">Annual Rent</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Cumulative Rent</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Investment Value</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Monthly Savings</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Net Worth</th>
                    {/* Buying columns */}
                    <th className="px-4 py-3 bg-gray-50 text-right">Property Value</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Mortgage Balance</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Annual Costs</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Cumulative Costs</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Home Equity</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Principal Paid</th>
                    <th className="px-4 py-3 bg-gray-50 text-right">Net Worth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analysis.yearlyData.map((data, index) => {
                    const yearlyRent = data.rentCumulative - (index === 0 ? 0 : analysis.yearlyData[index - 1].rentCumulative);
                    const yearlyBuyCosts = data.buyCumulative - (index === 0 ? 0 : analysis.yearlyData[index - 1].buyCumulative);
                    const yearlyInterestPaid = index === 0 ? principal * scenario.buy.interestRate / 100 : 
                      analysis.yearlyData[index - 1].remainingMortgage * scenario.buy.interestRate / 100;
                    const principalPaid = monthlyMortgage * 12 - yearlyInterestPaid;

                    return (
                      <tr key={data.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {data.year}
                        </td>
                        {/* Renting data */}
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${yearlyRent.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.rentCumulative.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.investmentPortfolio.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${(totalBuyCost - totalRentCost).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.renterNetWorth.toLocaleString()}
                        </td>
                        {/* Buying data */}
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.propertyValue.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.remainingMortgage.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${yearlyBuyCosts.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.buyCumulative.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.equityBuildup.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${principalPaid.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          ${data.buyerNetWorth.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 