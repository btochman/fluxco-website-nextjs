'use client';

import { useState } from 'react';
import { Download, Calculator } from 'lucide-react';

const kvaOptions = [
  { value: 25, label: '25 kVA', basePrice: 8500 },
  { value: 50, label: '50 kVA', basePrice: 12000 },
  { value: 75, label: '75 kVA', basePrice: 15500 },
  { value: 100, label: '100 kVA', basePrice: 19000 },
  { value: 150, label: '150 kVA', basePrice: 24000 },
  { value: 225, label: '225 kVA', basePrice: 32000 },
  { value: 300, label: '300 kVA', basePrice: 42000 },
  { value: 500, label: '500 kVA', basePrice: 58000 },
  { value: 750, label: '750 kVA', basePrice: 78000 },
  { value: 1000, label: '1,000 kVA', basePrice: 95000 },
  { value: 1500, label: '1,500 kVA', basePrice: 125000 },
  { value: 2000, label: '2,000 kVA', basePrice: 145000 },
  { value: 2500, label: '2,500 kVA', basePrice: 165000 },
];

const primaryVoltages = ['4,160V', '12,470V', '13,200V', '13,800V', '23,000V', '34,500V'];
const secondaryVoltages = ['120/240V', '208Y/120V', '480Y/277V', '480V Delta'];
const phases = [
  { value: 'single', label: 'Single Phase', multiplier: 0.85 },
  { value: 'three', label: 'Three Phase', multiplier: 1.0 },
];
const coolingTypes = [
  { value: 'ONAN', label: 'ONAN (Oil Natural Air Natural)', multiplier: 1.0 },
  { value: 'ONAF', label: 'ONAF (Oil Natural Air Forced)', multiplier: 1.08 },
  { value: 'ONAN/ONAF', label: 'ONAN/ONAF', multiplier: 1.15 },
  { value: 'ONAN/ONAF/ONAF', label: 'ONAN/ONAF/ONAF', multiplier: 1.22 },
];
const bilLevels = [
  { value: 30, label: '30 kV BIL', multiplier: 1.0 },
  { value: 45, label: '45 kV BIL', multiplier: 1.02 },
  { value: 60, label: '60 kV BIL', multiplier: 1.04 },
  { value: 75, label: '75 kV BIL', multiplier: 1.06 },
  { value: 95, label: '95 kV BIL', multiplier: 1.08 },
  { value: 110, label: '110 kV BIL', multiplier: 1.10 },
  { value: 125, label: '125 kV BIL', multiplier: 1.12 },
  { value: 150, label: '150 kV BIL', multiplier: 1.15 },
  { value: 200, label: '200 kV BIL', multiplier: 1.20 },
];
const leadTimes = [
  { value: 'rush', label: 'Rush (6-8 weeks)', multiplier: 1.35 },
  { value: 'standard', label: 'Standard (12-16 weeks)', multiplier: 1.0 },
  { value: 'extended', label: 'Extended (20+ weeks)', multiplier: 0.97 },
];

export default function SpecBuilder() {
  const [specs, setSpecs] = useState({
    kva: kvaOptions[4], // 150 kVA default
    primaryVoltage: primaryVoltages[1],
    secondaryVoltage: secondaryVoltages[2],
    phase: phases[1],
    cooling: coolingTypes[0],
    bil: bilLevels[4],
    leadTime: leadTimes[1],
  });

  const calculatePrice = () => {
    const base = specs.kva.basePrice;
    const phaseMultiplier = specs.phase.multiplier;
    const coolingMultiplier = specs.cooling.multiplier;
    const bilMultiplier = specs.bil.multiplier;
    const leadTimeMultiplier = specs.leadTime.multiplier;

    return Math.round(base * phaseMultiplier * coolingMultiplier * bilMultiplier * leadTimeMultiplier);
  };

  const price = calculatePrice();

  return (
    <section id="designer" className="py-20 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            TRANSFORMER DESIGN ENGINE
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Configure your transformer specifications and get instant pricing.
            Download a detailed spec sheet or request a formal quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 bg-[#0f1d32] border border-[#1e3a5f] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#0ea5e9]" />
              Configure Your Transformer
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* KVA Rating */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Power Rating (kVA)</label>
                <select
                  value={specs.kva.value}
                  onChange={(e) => setSpecs({ ...specs, kva: kvaOptions.find(k => k.value === Number(e.target.value))! })}
                  className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded px-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  {kvaOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Phase */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Phase</label>
                <select
                  value={specs.phase.value}
                  onChange={(e) => setSpecs({ ...specs, phase: phases.find(p => p.value === e.target.value)! })}
                  className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded px-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  {phases.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Primary Voltage */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Primary Voltage</label>
                <select
                  value={specs.primaryVoltage}
                  onChange={(e) => setSpecs({ ...specs, primaryVoltage: e.target.value })}
                  className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded px-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  {primaryVoltages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Secondary Voltage */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Secondary Voltage</label>
                <select
                  value={specs.secondaryVoltage}
                  onChange={(e) => setSpecs({ ...specs, secondaryVoltage: e.target.value })}
                  className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded px-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  {secondaryVoltages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Cooling Type */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Cooling Type</label>
                <select
                  value={specs.cooling.value}
                  onChange={(e) => setSpecs({ ...specs, cooling: coolingTypes.find(c => c.value === e.target.value)! })}
                  className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded px-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  {coolingTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* BIL */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">BIL Rating</label>
                <select
                  value={specs.bil.value}
                  onChange={(e) => setSpecs({ ...specs, bil: bilLevels.find(b => b.value === Number(e.target.value))! })}
                  className="w-full bg-[#0a1628] border border-[#1e3a5f] rounded px-4 py-3 text-white focus:outline-none focus:border-[#0ea5e9]"
                >
                  {bilLevels.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Lead Time */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Lead Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {leadTimes.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSpecs({ ...specs, leadTime: opt })}
                      className={`py-3 px-4 rounded border text-sm font-medium transition-colors ${
                        specs.leadTime.value === opt.value
                          ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white'
                          : 'bg-[#0a1628] border-[#1e3a5f] text-gray-300 hover:border-[#0ea5e9]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-[#0f1d32] border border-[#1e3a5f] rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Your Configuration</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rating</span>
                <span className="text-white font-medium">{specs.kva.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phase</span>
                <span className="text-white font-medium">{specs.phase.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Primary</span>
                <span className="text-white font-medium">{specs.primaryVoltage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Secondary</span>
                <span className="text-white font-medium">{specs.secondaryVoltage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Cooling</span>
                <span className="text-white font-medium">{specs.cooling.value}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">BIL</span>
                <span className="text-white font-medium">{specs.bil.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Lead Time</span>
                <span className="text-white font-medium">{specs.leadTime.label.split(' ')[0]}</span>
              </div>
            </div>

            <div className="border-t border-[#1e3a5f] pt-6 mb-6">
              <div className="text-gray-400 text-sm mb-1">Estimated Price</div>
              <div className="text-4xl font-bold text-white">
                ${price.toLocaleString()}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                *Final pricing subject to site assessment
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white py-3 rounded font-semibold transition-colors">
                Request Formal Quote
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-[#1e3a5f] hover:border-[#0ea5e9] text-white py-3 rounded font-semibold transition-colors">
                <Download className="w-4 h-4" />
                Download Spec Sheet
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
