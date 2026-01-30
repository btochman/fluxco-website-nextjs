import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { BreadcrumbSchema } from "@/components/SchemaOrg";
import { ArrowRight, Check, Car, Building, Truck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "EV Charging Transformers | FluxCo - Electric Vehicle Infrastructure",
  description:
    "Transformers for EV charging stations: fleet depots, highway fast charging, commercial charging, and residential EVSE. K-rated for harmonic loads, fast delivery.",
  keywords: [
    "EV charging transformer",
    "electric vehicle transformer",
    "EV charger transformer",
    "fleet charging transformer",
    "DC fast charging transformer",
    "EVSE transformer",
    "EV infrastructure",
  ],
  openGraph: {
    title: "EV Charging Transformers | FluxCo",
    description:
      "Transformers for EV charging infrastructure. K-rated for harmonics, fast delivery.",
    type: "website",
  },
};

const benefits = [
  {
    icon: Car,
    title: "Fast Charging",
    description:
      "High-capacity transformers for DC fast charging stations up to 350 kW per port.",
  },
  {
    icon: Truck,
    title: "Fleet Depots",
    description:
      "Scalable power infrastructure for bus, truck, and delivery fleet electrification.",
  },
  {
    icon: Building,
    title: "Commercial Sites",
    description:
      "Retail, workplace, and multifamily charging with load management ready.",
  },
  {
    icon: MapPin,
    title: "Network Rollout",
    description:
      "Standardized designs for rapid deployment across multiple locations.",
  },
];

const solutions = [
  {
    title: "Highway Fast Charging",
    description:
      "High-power DC fast charging plazas along travel corridors. Multiple 150-350 kW chargers per site.",
    products: ["Pad-mount transformers", "Dry-type transformers"],
    capacity: "500 kVA – 5 MVA per site",
  },
  {
    title: "Fleet Electrification",
    description:
      "Depot charging for buses, delivery vans, and trucks. Often requires utility service upgrades.",
    products: ["Pad-mount transformers", "Substation transformers"],
    capacity: "1 MVA – 20+ MVA per depot",
  },
  {
    title: "Commercial Charging",
    description:
      "Retail, hospitality, and workplace charging. Level 2 and DC fast charging combinations.",
    products: ["Pad-mount transformers", "Dry-type transformers"],
    capacity: "150 kVA – 2 MVA",
  },
  {
    title: "Multifamily & Residential",
    description:
      "Apartment complexes, condominiums, and HOA common areas with multiple Level 2 chargers.",
    products: ["Pad-mount transformers", "Small dry-type"],
    capacity: "75 kVA – 500 kVA",
  },
];

const considerations = [
  {
    title: "Harmonic Content",
    description:
      "EV chargers produce harmonics that can overheat standard transformers. K-rated units handle this safely.",
  },
  {
    title: "Load Growth",
    description:
      "Size for future expansion—today's 4-port station may need 20 ports next year.",
  },
  {
    title: "Utility Coordination",
    description:
      "Large installations may require utility service upgrades. We can help coordinate.",
  },
  {
    title: "Site Constraints",
    description:
      "Limited space? Compact footprint and aesthetic options available.",
  },
];

export default function EVInfrastructurePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://fluxco.com" },
          { name: "Solutions", url: "https://fluxco.com/solutions" },
          { name: "EV Infrastructure", url: "https://fluxco.com/solutions/ev-infrastructure" },
        ]}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">EV Infrastructure</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
                Electrification
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                EV Charging Infrastructure
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8">
                Power the electric vehicle revolution with transformers designed
                for charging applications. From single-site installations to
                nationwide network rollouts, FluxCo delivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Request Quote
                </Link>
                <Link
                  href="/inventory"
                  className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:border-primary/50 transition-colors"
                >
                  View Inventory
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <benefit.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-foreground mb-4">
            Solutions by Application
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Every EV charging scenario has different power requirements. We
            provide solutions sized for your specific application.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-display text-xl text-foreground mb-2">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {solution.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {solution.products.map((product) => (
                    <span
                      key={product}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded"
                    >
                      {product}
                    </span>
                  ))}
                </div>
                <p className="text-primary text-sm font-medium">
                  Typical capacity: {solution.capacity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Considerations */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-foreground mb-8">
            Key Considerations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {considerations.map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-medium text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FluxCo */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl text-foreground mb-6">
                Why FluxCo for EV Infrastructure
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      K-Rated Inventory
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Stock of K-4, K-13, and K-20 rated transformers for
                      harmonic-rich EV charger loads.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      Standardized Designs
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Pre-engineered packages for faster deployment across
                      multiple sites.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      Volume Programs
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Multi-site rollout pricing and coordinated delivery
                      schedules.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      Future-Proof Sizing
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Help you size for today&apos;s needs while planning for
                      expansion.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl p-8">
              <h3 className="font-display text-xl text-foreground mb-4">
                Quick Sizing Guide
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">4× Level 2 (7 kW)</span>
                  <span className="font-medium text-foreground">~50 kVA</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">4× DC Fast (50 kW)</span>
                  <span className="font-medium text-foreground">~300 kVA</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">8× DC Fast (150 kW)</span>
                  <span className="font-medium text-foreground">~1.5 MVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fleet depot (50 buses)</span>
                  <span className="font-medium text-foreground">~5-10 MVA</span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mt-4">
                * Approximate. Actual sizing depends on demand factors and
                utility requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-foreground mb-8">
            Recommended Products
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/transformers/padmount"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                Padmount Transformers
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Most common choice for outdoor charging installations.
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm">
                Learn more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link
              href="/transformers/dry-type"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                Dry-Type Transformers
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Indoor installations and parking structures.
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm">
                Learn more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link
              href="/transformers/substation"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                Substation Transformers
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Large fleet depots requiring utility service upgrades.
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm">
                Learn more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </main>
  );
}
