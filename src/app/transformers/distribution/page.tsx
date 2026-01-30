import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { BreadcrumbSchema, ProductSchema, FAQSchema } from "@/components/SchemaOrg";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Distribution Transformers | FluxCo - Pole-Mount & Platform Units",
  description:
    "Buy distribution transformers from 25 kVA to 2.5 MVA. Pole-mount, platform, and conventional designs. IEEE compliant, DOE 2016 efficient. Fast delivery available.",
  keywords: [
    "distribution transformer",
    "pole mount transformer",
    "utility transformer",
    "overhead transformer",
    "CSP transformer",
    "conventional transformer",
    "single phase transformer",
    "three phase transformer",
  ],
  openGraph: {
    title: "Distribution Transformers | FluxCo",
    description:
      "Buy distribution transformers from 25 kVA to 2.5 MVA. Pole-mount, platform, and conventional designs.",
    type: "website",
  },
};

const specifications = [
  { label: "Capacity Range", value: "25 kVA – 2,500 kVA" },
  { label: "Primary Voltage", value: "2.4 kV – 34.5 kV" },
  { label: "Secondary Voltage", value: "120/240V – 480Y/277V" },
  { label: "Phases", value: "Single Phase & Three Phase" },
  { label: "Mounting", value: "Pole, Platform, Substation" },
  { label: "Insulation", value: "55°C or 65°C Rise" },
  { label: "Standards", value: "IEEE C57.12.20, DOE 10 CFR 431" },
  { label: "Protection", value: "Conventional, CSP, or Self-Protected" },
];

const features = [
  "Conventional and CSP (Completely Self-Protected) designs",
  "Pole-mount brackets and platform configurations",
  "Arrester, fuse, and low-voltage breaker integration",
  "Corrosion-resistant tank finishes",
  "Hermetically sealed tank construction",
  "No-load tap changers standard",
  "Nameplate compliant with utility standards",
  "Oil sampling and drain valves",
];

const applications = [
  {
    title: "Utility Distribution",
    description:
      "Overhead distribution networks for residential and light commercial service.",
  },
  {
    title: "Rural Electrification",
    description:
      "Remote area power delivery where overhead lines are standard.",
  },
  {
    title: "Agricultural",
    description:
      "Farm and ranch power service, irrigation systems, and agricultural facilities.",
  },
  {
    title: "Small Commercial",
    description:
      "Retail, restaurants, and small business locations on overhead service.",
  },
];

const faqs = [
  {
    question: "What is the difference between conventional and CSP transformers?",
    answer:
      "Conventional transformers require external fuses and arresters. CSP (Completely Self-Protected) transformers include built-in lightning arresters, internal fuses, and a low-voltage circuit breaker for complete protection in one unit.",
  },
  {
    question: "What mounting options are available for distribution transformers?",
    answer:
      "We offer pole-mount (single pole or H-frame), platform mount (for substations or ground installations), and cluster mount configurations. Hardware and brackets are available separately or as complete assemblies.",
  },
  {
    question: "Are your distribution transformers DOE 2016 compliant?",
    answer:
      "Yes, all distribution transformers we supply meet or exceed the DOE 2016 efficiency standards. Efficiency documentation and certificates are available upon request.",
  },
  {
    question: "Can you supply transformers for emergency replacement?",
    answer:
      "Yes, we maintain stock of common distribution transformer sizes for emergency replacements. Contact us for current availability on specific kVA ratings and voltage configurations.",
  },
];

export default function DistributionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://fluxco.com" },
          { name: "Transformers", url: "https://fluxco.com/transformers" },
          { name: "Distribution", url: "https://fluxco.com/transformers/distribution" },
        ]}
      />
      <ProductSchema
        name="Distribution Transformers"
        description="Pole-mount and platform transformers for utility distribution networks. 25 kVA to 2.5 MVA capacity."
        category="Electrical Transformers"
        url="https://fluxco.com/transformers/distribution"
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
            <span className="text-foreground">Distribution</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full mb-4">
                Utility Standard
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Distribution Transformers
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl mb-8">
                Reliable pole-mount and platform transformers for overhead
                utility distribution networks. Conventional and self-protected
                designs available from 25 kVA to 2.5 MVA.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/inventory?type=distribution"
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
