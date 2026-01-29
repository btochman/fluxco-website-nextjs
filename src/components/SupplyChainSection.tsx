"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Zap } from "lucide-react";

const SupplyChainSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 ranch-pattern opacity-30" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Alert badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 text-destructive mb-8">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
              Industry Alert
            </span>
          </div>
          
          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-wide">
            Beat the 2026 Supply Chain Shortage
          </h2>
          
          {/* Body text */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto" style={{ fontFamily: 'Libre Baskerville, serif' }}>
            While many manufacturers are quoting <span className="text-foreground font-semibold">50+ week lead times</span>, Fluxco has visibility and access to the <span className="text-foreground font-semibold">world's largest inventory</span> of industrial transformers. We specialize in sourcing 3-phase pad mount transformers and can facilitate <span className="text-foreground font-semibold">emergency power transformer replacement</span> globally. Don't let equipment delays stop your project—contact us for immediate specs and shipping.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-accent">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Best Lead Times
              </span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Ready-to-Ship
              </span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider" style={{ fontFamily: 'Oswald, sans-serif' }}>
                Emergency Support
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SupplyChainSection;
