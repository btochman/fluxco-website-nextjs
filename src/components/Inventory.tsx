'use client';

const inventory = [
  { type: 'Padmount', kva: '75 kVA', voltage: '12.47kV / 480V', qty: 12, leadTime: '2-3 weeks' },
  { type: 'Padmount', kva: '150 kVA', voltage: '12.47kV / 480V', qty: 8, leadTime: '2-3 weeks' },
  { type: 'Padmount', kva: '300 kVA', voltage: '12.47kV / 480V', qty: 5, leadTime: '3-4 weeks' },
  { type: 'Padmount', kva: '500 kVA', voltage: '12.47kV / 480V', qty: 3, leadTime: '4-5 weeks' },
  { type: 'Substation', kva: '1,000 kVA', voltage: '13.8kV / 480V', qty: 4, leadTime: '6-8 weeks' },
  { type: 'Substation', kva: '2,500 kVA', voltage: '13.8kV / 480V', qty: 2, leadTime: '8-10 weeks' },
];

export default function Inventory() {
  return (
    <section id="inventory" className="py-20 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            IN-STOCK TRANSFORMERS
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready-to-ship inventory with competitive lead times. Contact us for
            current availability and pricing.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e3a5f]">
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Type</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Rating</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Voltage</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Qty Available</th>
                <th className="text-left py-4 px-4 text-gray-400 font-medium">Lead Time</th>
                <th className="text-right py-4 px-4 text-gray-400 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-[#1e3a5f] hover:bg-[#0f1d32] transition-colors"
                >
                  <td className="py-4 px-4 text-white">{item.type}</td>
                  <td className="py-4 px-4 text-white font-medium">{item.kva}</td>
                  <td className="py-4 px-4 text-gray-300">{item.voltage}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-white">{item.qty} units</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{item.leadTime}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-[#0ea5e9] hover:text-[#38bdf8] font-medium text-sm">
                      Request Quote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-3 rounded font-semibold transition-colors"
          >
            View Full Inventory
          </a>
        </div>
      </div>
    </section>
  );
}
