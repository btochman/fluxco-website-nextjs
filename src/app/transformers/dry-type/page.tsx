import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { BreadcrumbSchema, ProductSchema, FAQSchema } from "@/components/SchemaOrg";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Dry-Type Transformers | FluxCo - Cast Resin & VPI Units",
  description:
    "Buy dry-type transformers from 15 kVA to 30 MVA. Cast resin and VPI designs for indoor, fire-sensitive, and environmentally conscious applications. No oil required.",
  keywords: [
    "dry type transformer",
    "cast resin transformer",
    "VPI transformer",
    "air cooled transformer",
    "indoor transformer",
    "dry transformer",
    "fire safe transformer",
    "medium voltage dry type",
  ],
  openGraph: {
    title: "Dry-Type Transformers | FluxCo",
    description:
      "Buy dry-type transformers from 15 kVA to 30 MVA. Cast resin and VPI designs for indoor and fire-sensitive applications.",
    type: "website",
  },
};

const specifications = [
  { label: "Capacity Range", value: "15 kVA – 30 MVA" },
  { label: "Primary Voltage", value: "600V – 35 kV" },
  { label: "Secondary Voltage", value: "120V – 15 kV" },
  { label: "Insulation Class", value: "Class F (155°C) / Class H (180°C)" },
  { label: "Enclosure", value: "NEMA 1, 2, 3R, 12 Available" },
  { label: "Construction", value: "Cast Resin & VPI" },
  { label: "Standards", value: "IEEE C57.12.01, UL 1561" },
  { label: "Cooling", value: "AN (Air Natural) / AF (Air Forced)" },
];

const features = [
  "No oil—eliminates fire and environmental hazards",
  "Cast resin encapsulation for moisture and dust protection",
  "Low partial discharge for sensitive environments",
  "Compact footprint for space-constrained installations",
  "Indoor and outdoor rated enclosures",
  "Class F and H insulation systems",
  "Temperature monitoring and fan control options",
  "K-factor rated designs for non-linear loads",
];

const applications = [
  {
    title: "Commercial Buildings",
    description:
      "High-rise offices, shopping centers, and mixed-use developments where fire safety is paramount.",
  },
  {
    title: "Healthcare Facilities",
    description:
      "Hospitals, clinics, and medical centers requiring clean, quiet, and safe power.",
  },
  {
    title: "Data Centers",
    description:
      "Server rooms and IT facilities where oil-free operation and compact size matter.",
  },
  {
    title: "Industrial Indoor",
    description:
      "Manufacturing facilities, clean rooms, and environmentally sensitive operations.",
  },
];

const faqs = [
  {
    question: "What is the difference between cast resin and VPI dry-type transformers?",
    answer:
      "Cast resin transformers have windings encapsulated in epoxy resin, providing excellent moisture and contamination resistance. VPI (Vacuum Pressure Impregnated) transformers use varnish impregnation and are typically more cost-effective for less demanding environments.",
  },
  {
    question: "Can dry-type transformers be installed outdoors?",
    answer:
      "Yes, with proper enclosures (NEMA 3R or higher). Outdoor-rated dry-type transformers include weatherproof housings, heaters, and ventilation systems designed for external installation.",
  },
  {
    question: "What is K-factor rating and do I need it?",
    answer:
      "K-factor indicates a transformer's ability to handle harmonic currents from non-linear loads like computers, VFDs, and LED lighting. If your facility has significant electronic loads, a K-4, K-13, or K-20 rated transformer prevents overheating.",
  },
  {
    question: "Are dry-type transformers more expensive than oil-filled?",
    answer:
      "Initial cost is typically higher, but dry-type transformers eliminate oil containment, fire suppression, and environmental compliance costs. Total cost of ownership is often comparable or lower for indoor installations.",
  },
];

export default function DryTypePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://fluxco.com" },
          { name: "Transformers", url: "https://fluxco.com/transformers" },
          { name: "Dry-Type", url: "https://fluxco.com/transformers/dry-type" },
        ]}
      />
      <ProductSchema
        name="Dry-Type Transformers"
        description="Air-cooled transformers for indoor installations and fire-sensitive environments. 15 kVA to 30 MVA capacity."
        category="Electrical Transformers"
        url="https://fluxco.com/transformers/dry-type"
      />
      <FAQSchema items={faqs} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/transformers"
              className="hover:text-primary transition-colors"
            >
              Transformers
            </Link>
            <span>/</span>
            <span className="text-foreground">Dry-Type</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-green-600 text-white text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
                No Oil Required
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Dry-Type Transformers
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8">
                Air-cooled transformers ideal for indoor installations,
                fire-sensitive environments, and locations where oil containment
                is impractical. Cast resin and VPI designs from 15 kVA to 30 MVA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/inventory?type=dry-type"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  View Inventory
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:border-primary/50 transition-colors"
                >
                  Request Quote
                </Link>
              </div>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 border border-border">
              <h3 className="font-display text-xl text-foreground mb-4">
                Quick Specs
              </h3>
              <dl className="space-y-3">
                {specifications.slice(0, 5).map((spec) => (
                  <div key={spec.label} className="flex justify-between">
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="text-foreground font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Full Specifications */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-foreground mb-8">
            Technical Specifications
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specifications.map((spec) => (
              <div
                key={spec.label}
                className="bg-card border border-border rounded-xl p-6"
              >
                <dt className="text-muted-foreground text-sm mb-1">
                  {spec.label}
                </dt>
                <dd className="text-foreground font-display text-lg">
                  {spec.value}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl text-foreground mb-6">
                Key Advantages
              </h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-3xl text-foreground mb-6">
                Applications
              </h2>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.title}
                    className="bg-card border border-border rounded-xl p-5"
                  >
                    <h3 className="font-medium text-foreground mb-1">
                      {app.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {app.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="font-medium text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl text-foreground mb-8">
            Related Products
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
                Ground-level units for underground distribution systems.
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm">
                Learn more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link
              href="/transformers/distribution"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                Distribution Transformers
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Pole-mount and platform units for utility distribution.
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm">
                Learn more <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
            <Link
              href="/solutions/data-centers"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                Data Center Solutions
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Complete power infrastructure for data centers.
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
