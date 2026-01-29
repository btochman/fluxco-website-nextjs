'use client';

import { Network, RefreshCw, Package, Users } from 'lucide-react';

const features = [
  {
    icon: Network,
    title: 'Global Network',
    description: 'Access to worldwide supplier networks',
  },
  {
    icon: RefreshCw,
    title: 'Real-Time Updates',
    description: 'Live inventory and pricing information',
  },
  {
    icon: Package,
    title: 'Inventory Intelligence',
    description: 'Smart sourcing recommendations',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Your single partner for every transformer need',
  },
];

export default function OneStopShop() {
  return (
    <section id="services" className="py-20 bg-[#0f1d32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              YOUR ONE-STOP SHOP
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              FluxCo connects you to a global network of transformer manufacturers,
              providing instant access to inventory, pricing, and logistics support.
              We handle the complexity so you can focus on your projects.
            </p>
            <p className="text-gray-400 mb-8">
              From initial specifications to final delivery, our team manages every
              step of the procurement process with transparency and efficiency.
            </p>
            <a
              href="#products"
              className="text-[#0ea5e9] hover:text-[#38bdf8] font-semibold inline-flex items-center gap-2"
            >
              The Ultimate Transformer Resource →
            </a>
          </div>

          {/* Right Content - Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#0a1628] border border-[#1e3a5f] rounded-lg p-6 hover:border-[#0ea5e9] transition-colors"
              >
                <feature.icon className="w-8 h-8 text-[#0ea5e9] mb-4" />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
