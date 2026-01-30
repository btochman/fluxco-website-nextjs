import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { BreadcrumbSchema, ProductSchema, FAQSchema } from "@/components/SchemaOrg";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Padmount Transformers | FluxCo - In-Stock & Custom Units",
  description:
    "Buy padmount transformers from 75 kVA to 10 MVA. Single and three-phase, dead-front design. In-stock inventory with competitive lead times. DOE 2016 compliant.",
  keywords: [
    "padmount transformer",
    "pad mounted transformer",
    "padmount transformer for sale",
    "three phase padmount transformer",
    "single phase padmount transformer",
    "underground distribution transformer",
  ],
  openGraph: {
    title: "Padmount Transformers | FluxCo",
    description:
      "Buy padmount transformers from 75 kVA to 10 MVA. In-stock inventory with competitive lead times.",
    type: "website",
  },
};

const specifications = [
  { label: "Capacity Range", value: "75 kVA – 10,000 kVA" },
  { label: "Primary Voltage", value: "4.16 kV – 34.5 kV" },
  { label: "Secondary Voltage", value: "120/240V – 480Y/277V" },
  { label: "Phases", value: "Single Phase & Three Phase" },
  { label: "Cooling", value: "ONAN (Oil Natural Air Natural)" },
  { label: "Insulation", value: "65°C or 55°C Rise" },
  { label: "Standards", value: "IEEE C57.12.00, DOE 10 CFR 431" },
  { label: "BIL Ratings", value: "95 kV – 200 kV" },
];

const features = [
  "Dead-front construction for enhanced safety",
  "Tamper-resistant cabinet design",
  "Loop or radial feed capability",
  "Bay-o-net fusing standard",
  "Stainless steel or painted cabinet options",
  "Removable access panels for easy maintenance",
  "Parking stand provisions",
  "Ground pads with lifting lugs",
];

const applications = [
  {
    title: "Commercial Developments",
    description:
      "Shopping centers, office parks, and retail locations requiring reliable underground power.",
  },
  {
    title: "Residential Subdivisions",
    description:
      "Underground residential distribution systems with aesthetic considerations.",
  },
  {
    title: "Industrial Facilities",
    description:
      "Manufacturing plants, warehouses, and distribution centers.",
  },
  {
    title: "Institutional",
    description:
      "Schools, hospitals, government buildings, and university campuses.",
  },
];

const faqs = [
  {
    question: "What is a padmount transformer?",
    answer:
      "A padmount transformer is a ground-level, enclosed transformer used in underground electric power distribution. It sits on a concrete pad and features a locked steel cabinet for safety and tamper resistance.",
  },
  {
    question: "What sizes of padmount transformers are available?",
    answer:
      "FluxCo offers padmount transformers from 75 kVA to 10,000 kVA (10 MVA) in both single-phase and three-phase configurations to meet various load requirements.",
  },
  {
    question: "Are your padmount transformers DOE compliant?",
    answer:
      "Yes, all our padmount transformers meet or exceed DOE 2016 efficiency standards (10 CFR 431). We can provide efficiency documentation and compliance certificates.",
  },
  {
    question: "What is the lead time for padmount transformers?",
    answer:
      "Lead times vary based on specifications and current inventory. Standard units may be available from stock, while custom configurations typically take 16-24 weeks. Contact us for current availability.",
  },
];

export default function PadmountPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://fluxco.com" },
          { name: "Transformers", url: "https://fluxco.com/transformers" },
          { name: "Padmount", url: "https://fluxco.com/transformers/padmount" },
        ]}
      />
      <ProductSchema
        name="Padmount Transformers"
        description="Ground-level transformers for underground distribution systems. 75 kVA to 10 MVA capacity."
        category="Electrical Transformers"
        url="https://fluxco.com/transformers/padmount"
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
            <span className="text-foreground">Padmount</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
                Most Popular
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Padmount Transformers
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8">
                Ground-level, enclosed transformers designed for underground
                distribution systems. Ideal for commercial, residential, and
                institutional applications where aesthetics and safety matter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/inventory?type=padmount"
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
                Standard Features
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
              href="/transformers/distribution"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                Distribution Transformers
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Pole-mount and platform units for overhead distribution.
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
                Air-cooled units for indoor and fire-sensitive locations.
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
                High-capacity units for substations and industrial use.
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
