import { useState } from 'react';
import { RentScenario, BuyScenario, Scenario } from '@/types/calculator';
import RentInputs from './RentInputs';
import BuyInputs from './BuyInputs';
import ResultsDashboard from './ResultsDashboard';
import CollapsibleSection from '../common/CollapsibleSection';

const DEFAULT_SCENARIO: Scenario = {
  name: 'Default',
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

export default function Calculator() {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
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

  const handleCalculate = () => {
    // Validate inputs here if needed
    // For now, just force a re-render
    setScenario(prev => ({ ...prev }));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
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
        <ResultsDashboard scenario={scenario} />
      </div>
    </div>
  );
} 