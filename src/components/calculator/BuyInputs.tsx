import { BuyScenario } from '@/types/calculator';
import CurrencyInput from '../common/CurrencyInput';
import PercentageInput from '../common/PercentageInput';

interface Props {
  values: BuyScenario;
  onChange: (values: BuyScenario) => void;
  errors?: Partial<Record<keyof BuyScenario, string>>;
}

export default function BuyInputs({ values, onChange, errors = {} }: Props) {
  const handleChange = (field: keyof BuyScenario) => (value: number) => {
    onChange({
      ...values,
      [field]: value
    });
  };

  // Update down payment amount when percentage changes
  const handleDownPaymentPercentChange = (percentage: number) => {
    onChange({
      ...values,
      downPayment: (values.purchasePrice * percentage) / 100
    });
  };

  // Calculate down payment percentage
  const downPaymentPercent = values.purchasePrice 
    ? (values.downPayment / values.purchasePrice) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Purchase Details</h2>
        
        <CurrencyInput
          label="Home Price"
          value={values.purchasePrice}
          onChange={handleChange('purchasePrice')}
          error={errors.purchasePrice}
          placeholder="400000"
        />

        <div className="grid grid-cols-2 gap-4">
          <CurrencyInput
            label="Down Payment"
            value={values.downPayment}
            onChange={handleChange('downPayment')}
            error={errors.downPayment}
            placeholder="80000"
          />
          <PercentageInput
            label="Down Payment %"
            value={downPaymentPercent}
            onChange={handleDownPaymentPercentChange}
          />
        </div>

        <PercentageInput
          label="Interest Rate"
          value={values.interestRate}
          onChange={handleChange('interestRate')}
          error={errors.interestRate}
          placeholder="3.5"
        />

        <PercentageInput
          label="Loan Term (Years)"
          value={values.loanTerm}
          onChange={handleChange('loanTerm')}
          error={errors.loanTerm}
          placeholder="30"
        />
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Costs</h2>
        
        <CurrencyInput
          label="Annual Property Tax"
          value={values.propertyTax}
          onChange={handleChange('propertyTax')}
          error={errors.propertyTax}
          placeholder="4000"
        />

        <CurrencyInput
          label="Monthly Maintenance"
          value={values.maintenance}
          onChange={handleChange('maintenance')}
          error={errors.maintenance}
          placeholder="300"
        />

        <CurrencyInput
          label="Monthly Home Insurance"
          value={values.homeInsurance}
          onChange={handleChange('homeInsurance')}
          error={errors.homeInsurance}
          placeholder="150"
        />
      </div>
    </div>
  );
} 