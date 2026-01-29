"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessingAnimationProps {
  onComplete: () => void;
}

// Complex transformer-related math formulas - Fourier series, integrals, and advanced equations
const MATH_FORMULAS = [
  // Fourier series for transformer core magnetization
  "B(t) = Σₙ₌₁^∞ Bₙ sin(nωt + φₙ)",
  // Faraday's law integral form
  "∮ E⃗·dl⃗ = -d/dt ∫∫ B⃗·dA⃗",
  // Core loss Steinmetz equation
  "Pcore = kₕfBₘᵅ + kₑf²Bₘ²",
  // Magnetic field intensity integral
  "∫ H⃗·dl⃗ = NI = ℱ",
  // Transformer equivalent circuit impedance
  "Z_eq = √[(R₁+a²R₂)² + (X₁+a²X₂)²]",
  // Voltage regulation integral
  "ΔV = ∫₀ᴸ (I·R + L·dI/dt) dx",
  // Flux linkage Fourier decomposition
  "λ(t) = Σₖ₌₁^∞ √2·Φₖ·sin(kωt - θₖ)",
  // Eddy current loss density
  "pₑ = (π²d²f²B²ₘₐₓ)/(6ρ)",
  // Mutual inductance integral
  "M₁₂ = (μ₀N₁N₂/l) ∫∫ dA",
  // Temperature rise differential
  "∂T/∂t = (1/ρCₚ)[∇·(k∇T) + q‴]",
  // Leakage reactance calculation
  "Xₗ = 2πf·μ₀·N²·(∫₀ʰ A(y)dy)/w",
  // Power flow complex integral
  "S = ∮ (E⃗×H⃗*)·dA⃗ = P + jQ",
  // BH curve hysteresis integral
  "Wₕ = ∮ H dB = ∫₀ᵀ H(dB/dt)dt",
  // Efficiency optimization
  "η_max ⟹ dη/dI = 0 → Pcu = Pcore",
  // Thermal time constant
  "τₜₕ = ∫₀^∞ (T(t)-T_amb)/ΔT_ss dt",
  // Impulse voltage response
  "v(t) = V₀·e^(-αt)·sin(ωdt + φ)",
  // Short circuit current integral
  "i_sc(t) = ∫₀ᵗ (V_pk/L)·sin(ωτ)dτ",
  // Copper loss with harmonics
  "P_cu = Σₙ₌₁^∞ Iₙ²·R_ac(n)·Fₙ",
  // Ampere's law for core
  "∇×H⃗ = J⃗ + ∂D⃗/∂t",
  // Voltage ratio with losses
  "V₂/V₁ = (N₂/N₁)·[1 - (I₂Z_eq)/V₁]",
];

// Pre-calculate stable positions for formulas
const generateFormulaPositions = (count: number) => {
  const positions: Array<{ x: number; y: number; rotation: number; scale: number; size: number }> = [];
  for (let i = 0; i < count; i++) {
    // Distribute formulas in a more organized pattern
    const row = Math.floor(i / 4);
    const col = i % 4;
    positions.push({
      x: 5 + col * 24 + (Math.random() - 0.5) * 10,
      y: 5 + row * 16 + (Math.random() - 0.5) * 8,
      rotation: (Math.random() - 0.5) * 15,
      scale: 0.85 + Math.random() * 0.3,
      size: 12 + Math.random() * 6,
    });
  }
  return positions;
};

const ProcessingAnimation = ({ onComplete }: ProcessingAnimationProps) => {
  const [phase, setPhase] = useState<"formulas" | "diagram" | "complete">("formulas");
  const [visibleFormulas, setVisibleFormulas] = useState<number[]>([]);
  const [diagramProgress, setDiagramProgress] = useState(0);

  // Memoize positions so they don't change on re-render
  const formulaPositions = useMemo(() => generateFormulaPositions(20), []);

  useEffect(() => {
    // Phase 1: Build up formulas progressively (2.5 seconds)
    const formulaInterval = setInterval(() => {
      setVisibleFormulas((prev) => {
        if (prev.length < 18) {
          return [...prev, prev.length];
        }
        return prev;
      });
    }, 140);

    // Transition to diagram phase
    const diagramTimer = setTimeout(() => {
      clearInterval(formulaInterval);
      setPhase("diagram");
    }, 2700);

    return () => {
      clearInterval(formulaInterval);
      clearTimeout(diagramTimer);
    };
  }, []);

  useEffect(() => {
    if (phase === "diagram") {
      // Phase 2: Draw diagram progressively (2.5 seconds)
      const diagramInterval = setInterval(() => {
        setDiagramProgress((prev) => {
          if (prev >= 100) {
            clearInterval(diagramInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      // Complete animation
      const completeTimer = setTimeout(() => {
        setPhase("complete");
        setTimeout(onComplete, 300);
      }, 2700);

      return () => {
        clearInterval(diagramInterval);
        clearTimeout(completeTimer);
      };
    }
  }, [phase, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-4xl h-[600px] p-8 overflow-hidden">
        {/* Building math formulas - they stay and accumulate */}
        <div className="absolute inset-0">
          {visibleFormulas.map((index) => {
            const formula = MATH_FORMULAS[index % MATH_FORMULAS.length];
            const pos = formulaPositions[index];
            
            return (
              <motion.div
                key={`formula-${index}`}
                initial={{ opacity: 0, scale: 0.3, filter: "blur(10px)" }}
                animate={{ 
                  opacity: phase === "diagram" ? 0.15 : 0.9,
                  scale: pos.scale,
                  filter: "blur(0px)",
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut",
                  opacity: { duration: phase === "diagram" ? 0.5 : 0.6 }
                }}
                className="absolute font-mono text-primary whitespace-nowrap"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `rotate(${pos.rotation}deg)`,
                  fontSize: `${pos.size}px`,
                  textShadow: "0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.3)",
                }}
              >
                {formula}
              </motion.div>
            );
          })}
        </div>

        {/* Electrical Diagram Drawing */}
        <AnimatePresence>
          {(phase === "diagram" || phase === "complete") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                viewBox="0 0 600 400"
                className="w-full h-full max-w-2xl"
                style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.3))" }}
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="hsl(var(--primary) / 0.1)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                  <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--copper))" />
                  </linearGradient>
                </defs>
                <rect width="600" height="400" fill="url(#grid)" />

                {/* Primary winding input lines */}
                <motion.path
                  d="M 50 120 L 150 120"
                  stroke="url(#wireGradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: diagramProgress / 100 }}
                  transition={{ duration: 0.1 }}
                />
                <motion.path
                  d="M 50 280 L 150 280"
                  stroke="url(#wireGradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: diagramProgress / 100 }}
                  transition={{ duration: 0.1 }}
                />

                {/* Primary winding (left coil) */}
                <motion.path
                  d="M 150 120 
                     C 150 140, 180 140, 180 160
                     C 180 180, 150 180, 150 200
                     C 150 220, 180 220, 180 240
                     C 180 260, 150 260, 150 280"
                  stroke="hsl(var(--copper))"
                  strokeWidth="4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(diagramProgress * 1.5, 100) / 100 }}
                  transition={{ duration: 0.1 }}
                />

                {/* Transformer core */}
                <motion.rect
                  x="200"
                  y="100"
                  width="20"
                  height="200"
                  fill="hsl(var(--steel))"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: diagramProgress > 30 ? 1 : 0 }}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.rect
                  x="380"
                  y="100"
                  width="20"
                  height="200"
                  fill="hsl(var(--steel))"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: diagramProgress > 35 ? 1 : 0 }}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.rect
                  x="200"
                  y="80"
                  width="200"
                  height="20"
                  fill="hsl(var(--steel))"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: diagramProgress > 40 ? 1 : 0 }}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.3 }}
                />
                <motion.rect
                  x="200"
                  y="300"
                  width="200"
                  height="20"
                  fill="hsl(var(--steel))"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: diagramProgress > 45 ? 1 : 0 }}
                  style={{ transformOrigin: "center" }}
                  transition={{ duration: 0.3 }}
                />

                {/* Secondary winding (right coil) */}
                <motion.path
                  d="M 450 120 
                     C 450 140, 420 140, 420 160
                     C 420 180, 450 180, 450 200
                     C 450 220, 420 220, 420 240
                     C 420 260, 450 260, 450 280"
                  stroke="hsl(var(--copper))"
                  strokeWidth="4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: diagramProgress > 50 ? (diagramProgress - 50) * 2 / 100 : 0 }}
                  transition={{ duration: 0.1 }}
                />

                {/* Secondary winding output lines */}
                <motion.path
                  d="M 450 120 L 550 120"
                  stroke="url(#wireGradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: diagramProgress > 80 ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.path
                  d="M 450 280 L 550 280"
                  stroke="url(#wireGradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: diagramProgress > 80 ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Voltage labels */}
                <motion.text
                  x="30"
                  y="205"
                  fill="hsl(var(--primary))"
                  fontSize="16"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: diagramProgress > 60 ? 1 : 0 }}
                >
                  V₁
                </motion.text>
                <motion.text
                  x="560"
                  y="205"
                  fill="hsl(var(--primary))"
                  fontSize="16"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: diagramProgress > 90 ? 1 : 0 }}
                >
                  V₂
                </motion.text>

                {/* Magnetic flux symbol */}
                <motion.text
                  x="290"
                  y="205"
                  fill="hsl(var(--glow))"
                  fontSize="24"
                  fontWeight="bold"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: diagramProgress > 70 ? 1 : 0,
                    scale: diagramProgress > 70 ? 1 : 0
                  }}
                  style={{ transformOrigin: "center" }}
                >
                  Φ
                </motion.text>

                {/* Flux arrows */}
                {diagramProgress > 75 && (
                  <>
                    <motion.path
                      d="M 280 150 L 320 150"
                      stroke="hsl(var(--glow))"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                    <motion.path
                      d="M 320 250 L 280 250"
                      stroke="hsl(var(--glow))"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  </>
                )}

                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="hsl(var(--glow))"
                    />
                  </marker>
                </defs>

                {/* Terminal dots */}
                {[
                  { x: 50, y: 120 },
                  { x: 50, y: 280 },
                  { x: 550, y: 120 },
                  { x: 550, y: 280 },
                ].map((pos, i) => (
                  <motion.circle
                    key={i}
                    cx={pos.x}
                    cy={pos.y}
                    r="6"
                    fill="hsl(var(--primary))"
                    initial={{ scale: 0 }}
                    animate={{ scale: diagramProgress > 85 + i * 3 ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                ))}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status text */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.p
            className="text-xl font-bold text-primary mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {phase === "formulas" && "Calculating transformer parameters..."}
            {phase === "diagram" && "Generating electrical schematic..."}
            {phase === "complete" && "Complete!"}
          </motion.p>
          <div className="w-64 mx-auto h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-copper"
              initial={{ width: "0%" }}
              animate={{
                width: phase === "formulas" 
                  ? `${(visibleFormulas.length / 12) * 50}%`
                  : `${50 + (diagramProgress / 2)}%`
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>

        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default ProcessingAnimation;
