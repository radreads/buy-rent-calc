'use client';

import Calculator from '@/components/calculator/Calculator';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Rent vs. Buy Calculator
      </h1>
      <Calculator />
    </main>
  );
} 