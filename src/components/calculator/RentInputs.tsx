import { RentScenario } from '@/types/calculator';
import CurrencyInput from '../common/CurrencyInput';

interface Props {
  values: RentScenario;
  onChange: (values: RentScenario) => void;
  errors?: Partial<Record<keyof RentScenario, string>>;
}

export default function RentInputs({ values, onChange, errors = {} }: Props) {
  const handleChange = (field: keyof RentScenario) => (value: number) => {
    onChange({
      ...values,
      [field]: value
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Rent Details</h2>
      
      <CurrencyInput
        label="Monthly Rent"
        value={values.monthlyRent}
        onChange={handleChange('monthlyRent')}
        error={errors.monthlyRent}
        placeholder="2000"
      />

      <CurrencyInput
        label="Monthly Utilities"
        value={values.utilities}
        onChange={handleChange('utilities')}
        error={errors.utilities}
        placeholder="200"
      />

      <CurrencyInput
        label="Renter's Insurance"
        value={values.rentersInsurance}
        onChange={handleChange('rentersInsurance')}
        error={errors.rentersInsurance}
        placeholder="30"
      />
    </div>
  );
} 