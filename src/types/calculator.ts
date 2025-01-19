export interface RentScenario {
  monthlyRent: number;
  utilities: number;
  rentersInsurance: number;
}

export interface BuyScenario {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  maintenance: number;
  homeInsurance: number;
}

export interface MarketAssumptions {
  annualRentIncrease: number;
  annualHomeAppreciation: number;
  annualInvestmentReturn: number;
  annualMaintenanceIncrease: number;
  annualInsuranceIncrease: number;
  annualPropertyTaxIncrease: number;
}

export interface Scenario {
  name: string;
  rent: RentScenario;
  buy: BuyScenario;
  assumptions: MarketAssumptions;
} 