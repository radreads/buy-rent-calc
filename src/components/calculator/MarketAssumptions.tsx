import { MarketAssumptions } from '@/types/calculator';
import PercentageInput from '../common/PercentageInput';

interface Props {
  values: MarketAssumptions;
  onChange: (values: MarketAssumptions) => void;
}

export default function MarketAssumptionsInputs({ values, onChange }: Props) {
  const handleChange = (field: keyof MarketAssumptions) => (value: number) => {
    onChange({
      ...values,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <PercentageInput
        label="Annual Rent Increase"
        value={values.annualRentIncrease}
        onChange={handleChange('annualRentIncrease')}
        placeholder="3"
      />
      <PercentageInput
        label="Annual Home Appreciation"
        value={values.annualHomeAppreciation}
        onChange={handleChange('annualHomeAppreciation')}
        placeholder="4"
      />
      <PercentageInput
        label="Annual Investment Return"
        value={values.annualInvestmentReturn}
        onChange={handleChange('annualInvestmentReturn')}
        placeholder="5"
      />
      <PercentageInput
        label="Annual Maintenance Increase"
        value={values.annualMaintenanceIncrease}
        onChange={handleChange('annualMaintenanceIncrease')}
        placeholder="2"
      />
      <PercentageInput
        label="Annual Insurance Increase"
        value={values.annualInsuranceIncrease}
        onChange={handleChange('annualInsuranceIncrease')}
        placeholder="3"
      />
      <PercentageInput
        label="Annual Property Tax Increase"
        value={values.annualPropertyTaxIncrease}
        onChange={handleChange('annualPropertyTaxIncrease')}
        placeholder="2"
      />
    </div>
  );
} 