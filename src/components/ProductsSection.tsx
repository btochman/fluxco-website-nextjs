import { ArrowRight } from "lucide-react";

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-4">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Comprehensive Catalog
          </span>
        </div>
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
            ANY TRANSFORMER, ANY SIZE
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From small distribution units to massive power transformers—our global network has you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Distribution Transformers */}
          <div className="group relative bg-primary/10 border border-primary/20 rounded-2xl p-6 hover:border-primary/50 transition-all duration-500">
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full mb-3">
              Distribution
            </span>
            <h3 className="font-display text-2xl text-foreground mb-3">
              Distribution Transformers
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Reliable units for utility and commercial distribution networks.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                25 kVA – 10 MVA
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Pad-mount, Pole-mount, Submersible
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Oil-filled & Dry-type
              </li>
            </ul>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
              Get Quote <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Power Transformers */}
          <div className="group relative bg-muted/50 border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-500">
            <span className="inline-block bg-foreground text-background text-xs font-semibold uppercase px-3 py-1 rounded-full mb-3">
              Power
            </span>
            <h3 className="font-display text-2xl text-foreground mb-3">
              Power Transformers
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Heavy-duty units for substations and industrial facilities.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                10 MVA – 500 MVA+
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Auto, Step-up, Step-down
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Custom voltage classes
              </li>
            </ul>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
              Get Quote <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Specialty Transformers */}
          <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-500">
            <span className="inline-block bg-accent text-accent-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full mb-3">
              Specialty
            </span>
            <h3 className="font-display text-2xl text-foreground mb-3">
              Specialty Transformers
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Custom solutions for unique applications and environments.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Mobile & Trailer-mounted
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Rectifier & Furnace
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Renewable energy integration
              </li>
            </ul>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
              Get Quote <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {/* Solid State Transformers */}
          <div className="group relative bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-2xl p-6 hover:border-primary/60 transition-all duration-500">
            <span className="inline-block bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full mb-3">
              Next-Gen
            </span>
            <h3 className="font-display text-2xl text-foreground mb-3">
              Solid State Transformers
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Revolutionary power electronics replacing traditional transformers, inverters & switchgear.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Replaces transformer + inverter
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Eliminates switchgear & breakers
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                DC-ready for solar & storage
              </li>
              <li className="flex items-center gap-2 text-steel text-xs">
                <span className="w-1 h-1 bg-primary rounded-full" />
                Compact, lightweight design
              </li>
            </ul>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-300">
              Get Quote <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
