import { useState } from 'react';
import { RentScenario, BuyScenario, Scenario, MarketAssumptions } from '@/types/calculator';
import RentInputs from './RentInputs';
import BuyInputs from './BuyInputs';
import ResultsDashboard from './ResultsDashboard';
import CollapsibleSection from '../common/CollapsibleSection';
import MarketAssumptionsInputs from './MarketAssumptions';
import CurrencyInput from '../common/CurrencyInput';

const DEFAULT_SCENARIO: Scenario = {
  name: 'Default',
  timeHorizon: 30,
  rent: {
    monthlyRent: 9750,
    utilities: 300,
    rentersInsurance: 150,
  },
  buy: {
    purchasePrice: 3200000,
    downPayment: 640000,
    interestRate: 6,
    loanTerm: 30,
    propertyTax: 3200000 * 0.015, // 1.5% of purchase price
    maintenance: 2000,
    homeInsurance: 1500,
  },
  assumptions: {
    annualRentIncrease: 3,
    annualHomeAppreciation: 4,
    annualInvestmentReturn: 5,
    annualMaintenanceIncrease: 2,
    annualInsuranceIncrease: 3,
    annualPropertyTaxIncrease: 2,
  }
};

export default function Calculator() {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [breakEvenYear, setBreakEvenYear] = useState<number | null>(null);
  const [errors, setErrors] = useState<{
    rent?: Partial<Record<keyof RentScenario, string>>;
    buy?: Partial<Record<keyof BuyScenario, string>>;
  }>({});

  const handleRentChange = (rentValues: RentScenario) => {
    setScenario(prev => ({
      ...prev,
      rent: rentValues
    }));
  };

  const handleBuyChange = (buyValues: BuyScenario) => {
    setScenario(prev => ({
      ...prev,
      buy: buyValues
    }));
  };

  const handleAssumptionsChange = (assumptionValues: MarketAssumptions) => {
    setScenario(prev => ({
      ...prev,
      assumptions: assumptionValues
    }));
  };

  const handleCalculate = () => {
    // Validate inputs here if needed
    // For now, just force a re-render
    setScenario(prev => ({ ...prev }));
  };

  const handleTimeHorizonChange = (value: number) => {
    setScenario(prev => ({
      ...prev,
      timeHorizon: value
    }));
  };

  const handleAnalysisComplete = (year: number | null) => {
    setBreakEvenYear(year);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Key Inputs */}
        <div className="p-4 bg-white rounded-lg shadow space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Details</h2>
          
          <div className="space-y-2">
            <CurrencyInput
              label="Purchase Price"
              value={scenario.buy.purchasePrice}
              onChange={(value) => handleBuyChange({ ...scenario.buy, purchasePrice: value })}
              error={errors.buy?.purchasePrice}
              placeholder="400000"
            />
            <div className="flex items-center space-x-4 px-1">
              <input
                type="range"
                min="100000"
                max="10000000"
                step="10000"
                value={scenario.buy.purchasePrice}
                onChange={(e) => handleBuyChange({ ...scenario.buy, purchasePrice: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 w-24 text-right">
                ${(scenario.buy.purchasePrice / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <CurrencyInput
              label="Monthly Rent"
              value={scenario.rent.monthlyRent}
              onChange={(value) => handleRentChange({ ...scenario.rent, monthlyRent: value })}
              error={errors.rent?.monthlyRent}
              placeholder="2000"
            />
            <div className="flex items-center space-x-4 px-1">
              <input
                type="range"
                min="500"
                max="20000"
                step="100"
                value={scenario.rent.monthlyRent}
                onChange={(e) => handleRentChange({ ...scenario.rent, monthlyRent: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 w-16 text-right">
                ${Math.round(scenario.rent.monthlyRent / 100) * 100}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">
              Time Horizon (years)
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={scenario.timeHorizon}
              onChange={(e) => handleTimeHorizonChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 w-12 text-right">
              {scenario.timeHorizon}
            </span>
          </div>
        </div>

        {/* Recommendation Box */}
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 text-lg">
            {scenario.timeHorizon < (breakEvenYear || Infinity) ? (
              "It only makes sense for you to rent"
            ) : breakEvenYear === null ? (
              "It only makes sense for you to own"
            ) : (
              `You will break even in ${breakEvenYear} years`
            )}
          </p>
        </div>

        {/* Advanced Settings Toggle */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow cursor-pointer"
             onClick={() => setShowAdvanced(!showAdvanced)}>
          <span className="text-lg font-semibold text-gray-900">Advanced Settings</span>
          <svg
            className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Advanced Settings Content */}
        {showAdvanced && (
          <div className="space-y-6">
            <CollapsibleSection title="Rent Details">
              <RentInputs
                values={scenario.rent}
                onChange={handleRentChange}
                errors={errors.rent}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Purchase Details">
              <BuyInputs
                values={scenario.buy}
                onChange={handleBuyChange}
                errors={errors.buy}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Market Assumptions">
              <MarketAssumptionsInputs
                values={scenario.assumptions}
                onChange={handleAssumptionsChange}
              />
            </CollapsibleSection>
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:ring-offset-2 transition-colors"
        >
          Calculate
        </button>
      </div>

      <div className="lg:sticky lg:top-6 h-fit">
        <ResultsDashboard 
          scenario={scenario} 
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  );
} 