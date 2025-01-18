import { useState } from 'react';
import { RentScenario, BuyScenario } from '@/types/calculator';

export default function InputForm() {
  const [rentInputs, setRentInputs] = useState<RentScenario>({
    monthlyRent: 0,
    utilities: 0,
    rentersInsurance: 0,
  });

  const [buyInputs, setBuyInputs] = useState<BuyScenario>({
    purchasePrice: 0,
    downPayment: 0,
    interestRate: 0,
    loanTerm: 30,
    propertyTax: 0,
    maintenance: 0,
    homeInsurance: 0,
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Calculator Inputs</h2>
      {/* We'll add form fields here in the next step */}
    </div>
  );
} 