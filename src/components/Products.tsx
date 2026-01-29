'use client';

import { Zap, Settings, Gauge, Cpu } from 'lucide-react';

const products = [
  {
    icon: Zap,
    title: 'Distribution Transformers',
    description: 'Padmount and pole-mount solutions for utility distribution',
    range: '25 - 2,500 kVA',
  },
  {
    icon: Settings,
    title: 'Power Transformers',
    description: 'Substation-class transformers for industrial applications',
    range: '2.5 - 100 MVA',
  },
  {
    icon: Gauge,
    title: 'Specialty Transformers',
    description: 'Custom solutions for unique voltage and application requirements',
    range: 'Custom Specs',
  },
  {
    icon: Cpu,
    title: 'Solid State Transformers',
    description: 'Next-generation power electronics for modern grid applications',
    range: 'Advanced Tech',
  },
];

export default function Products() {
  return (
    <section id="products" className="py-20 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ANY TRANSFORMER, ANY SIZE
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From small distribution units to large power transformers, we source
            and deliver equipment that meets your exact specifications.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.title}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-12 h-12 bg-[#0ea5e9]/10 rounded-lg flex items-center justify-center mb-4">
                <product.icon className="w-6 h-6 text-[#0ea5e9]" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <span className="text-[#0ea5e9] text-sm font-medium">{product.range}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
