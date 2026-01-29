interface TransformerDrawingProps {
  config: {
    kva: string;
    primaryVoltage: string;
    secondaryVoltage: string;
    phase: string;
    coolingType: string;
    bilLevel: string;
    tapChanger: string;
  };
}

// Calculate estimated dimensions and weight based on kVA
const calculateDimensions = (kva: string, isThreePhase: boolean) => {
  const kvaNum = parseInt(kva) || 500;
  const phaseFactor = isThreePhase ? 1.2 : 1.0;
  
  // Rough estimates based on typical transformer sizes
  const width = Math.round((30 + kvaNum * 0.05) * phaseFactor);
  const depth = Math.round((25 + kvaNum * 0.04) * phaseFactor);
  const height = Math.round((45 + kvaNum * 0.06) * phaseFactor);
  const weight = Math.round((500 + kvaNum * 2.5) * phaseFactor);
  const oilGallons = Math.round((20 + kvaNum * 0.15) * phaseFactor);
  
  return { width, depth, height, weight, oilGallons };
};

const TransformerDrawing = ({ config }: TransformerDrawingProps) => {
  const isThreePhase = config.phase === "three";
  const hasForcedCooling = config.coolingType?.includes("ONAF") || false;
  const hasLTC = config.tapChanger === "auto-ltc";
  const hasManualTaps = config.tapChanger?.includes("manual") || false;
  const dims = calculateDimensions(config.kva, isThreePhase);

  return (
    <div className="w-full space-y-6">
      {/* Electrical Schematic */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-primary uppercase tracking-wider mb-4">
          Electrical Schematic
        </h4>
        <svg
          viewBox="0 0 500 350"
          className="w-full h-auto bg-background/50 rounded"
          style={{ maxHeight: "350px" }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="schematicGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="hsl(var(--primary) / 0.05)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="500" height="350" fill="url(#schematicGrid)" />

          {/* Title block */}
          <text x="250" y="20" fill="hsl(var(--primary))" fontSize="12" textAnchor="middle" fontWeight="bold">
            SINGLE LINE DIAGRAM - {config.kva || "TBD"} kVA {isThreePhase ? "THREE PHASE" : "SINGLE PHASE"} TRANSFORMER
          </text>

          {isThreePhase ? (
            /* Three Phase Schematic */
            <g>
              {/* Primary side - Delta or Wye */}
              <text x="80" y="55" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
                PRIMARY
              </text>
              <text x="80" y="68" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">
                {config.primaryVoltage ? `${Number(config.primaryVoltage).toLocaleString()}V` : "---V"}
              </text>

              {/* HV Bus */}
              <line x1="30" y1="90" x2="130" y2="90" stroke="hsl(var(--primary))" strokeWidth="3" />
              
              {/* Phase A, B, C connections from bus */}
              {[0, 1, 2].map((i) => (
                <g key={`primary-${i}`}>
                  {/* Vertical drop from bus */}
                  <line x1={50 + i * 30} y1="90" x2={50 + i * 30} y2="110" stroke="hsl(var(--primary))" strokeWidth="2" />
                  {/* Fuse symbol */}
                  <rect x={46 + i * 30} y="110" width="8" height="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  {/* Continue to transformer */}
                  <line x1={50 + i * 30} y1="130" x2={50 + i * 30} y2="150" stroke="hsl(var(--primary))" strokeWidth="2" />
                  {/* Phase label */}
                  <text x={50 + i * 30} y="85" fill="hsl(var(--primary))" fontSize="8" textAnchor="middle" fontWeight="bold">
                    {["A", "B", "C"][i]}
                  </text>
                </g>
              ))}

              {/* Delta connection symbol - Primary */}
              <polygon 
                points="50,150 110,150 80,200" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2"
              />
              <text x="80" y="185" fill="hsl(var(--primary))" fontSize="10" textAnchor="middle" fontWeight="bold">Δ</text>

              {/* Transformer core symbol */}
              <rect x="170" y="130" width="160" height="100" fill="hsl(var(--secondary) / 0.3)" stroke="hsl(var(--steel))" strokeWidth="2" rx="4" />
              
              {/* Primary windings */}
              {[0, 1, 2].map((i) => (
                <g key={`pri-winding-${i}`}>
                  <path
                    d={`M ${195 + i * 45} 145 
                        C ${205 + i * 45} 145, ${205 + i * 45} 155, ${195 + i * 45} 155
                        C ${185 + i * 45} 155, ${185 + i * 45} 165, ${195 + i * 45} 165
                        C ${205 + i * 45} 165, ${205 + i * 45} 175, ${195 + i * 45} 175
                        C ${185 + i * 45} 175, ${185 + i * 45} 185, ${195 + i * 45} 185`}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <line x1={50 + i * 30} y1="150" x2={195 + i * 45} y2="145" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              ))}

              {/* Secondary windings */}
              {[0, 1, 2].map((i) => (
                <g key={`sec-winding-${i}`}>
                  <path
                    d={`M ${195 + i * 45} 195 
                        C ${205 + i * 45} 195, ${205 + i * 45} 205, ${195 + i * 45} 205
                        C ${185 + i * 45} 205, ${185 + i * 45} 215, ${195 + i * 45} 215`}
                    fill="none"
                    stroke="hsl(var(--glow))"
                    strokeWidth="2"
                  />
                  <line x1={195 + i * 45} y1="215" x2={370 + i * 30} y2="260" stroke="hsl(var(--glow))" strokeWidth="1.5" strokeDasharray="4 2" />
                </g>
              ))}

              {/* Wye connection symbol - Secondary */}
              <line x1="400" y1="260" x2="370" y2="290" stroke="hsl(var(--glow))" strokeWidth="2" />
              <line x1="400" y1="260" x2="400" y2="290" stroke="hsl(var(--glow))" strokeWidth="2" />
              <line x1="400" y1="260" x2="430" y2="290" stroke="hsl(var(--glow))" strokeWidth="2" />
              <circle cx="400" cy="260" r="4" fill="hsl(var(--glow))" />
              <text x="400" y="255" fill="hsl(var(--glow))" fontSize="10" textAnchor="middle" fontWeight="bold">Y</text>

              {/* Secondary bus */}
              {[0, 1, 2].map((i) => (
                <g key={`secondary-${i}`}>
                  <line x1={370 + i * 30} y1="260" x2={370 + i * 30} y2="310" stroke="hsl(var(--glow))" strokeWidth="2" />
                  <text x={370 + i * 30} y="325" fill="hsl(var(--glow))" fontSize="8" textAnchor="middle" fontWeight="bold">
                    {["a", "b", "c"][i]}
                  </text>
                </g>
              ))}
              
              {/* Neutral */}
              <line x1="400" y1="290" x2="400" y2="310" stroke="hsl(var(--glow))" strokeWidth="2" />
              <text x="400" y="325" fill="hsl(var(--glow))" fontSize="8" textAnchor="middle">N</text>

              {/* Ground symbol */}
              <line x1="400" y1="310" x2="400" y2="320" stroke="hsl(var(--foreground))" strokeWidth="2" />
              <line x1="393" y1="320" x2="407" y2="320" stroke="hsl(var(--foreground))" strokeWidth="2" />
              <line x1="395" y1="324" x2="405" y2="324" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
              <line x1="397" y1="328" x2="403" y2="328" stroke="hsl(var(--foreground))" strokeWidth="1" />

              <text x="420" y="55" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
                SECONDARY
              </text>
              <text x="420" y="68" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">
                {config.secondaryVoltage || "---V"}
              </text>

              {/* Tap changer symbol */}
              {(hasLTC || hasManualTaps) && (
                <g>
                  <line x1="240" y1="145" x2="240" y2="125" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <circle cx="240" cy="120" r="5" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <line x1="235" y1="120" x2="245" y2="120" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <line x1="243" y1="117" x2="248" y2="120" stroke="hsl(var(--primary))" strokeWidth="1" />
                  <line x1="243" y1="123" x2="248" y2="120" stroke="hsl(var(--primary))" strokeWidth="1" />
                  <text x="255" y="115" fill="hsl(var(--muted-foreground))" fontSize="7">{hasLTC ? "LTC" : "NLTC"}</text>
                </g>
              )}

              {/* Ratio box */}
              <rect x="200" y="235" width="100" height="25" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="2" />
              <text x="250" y="252" fill="hsl(var(--foreground))" fontSize="9" textAnchor="middle" fontWeight="bold">
                RATIO: {config.primaryVoltage && config.secondaryVoltage 
                  ? `${(Number(config.primaryVoltage) / Number(config.secondaryVoltage.replace('V', ''))).toFixed(2)}:1`
                  : "TBD:1"}
              </text>
            </g>
          ) : (
            /* Single Phase Schematic */
            <g>
              {/* Primary side */}
              <text x="80" y="55" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
                PRIMARY
              </text>
              <text x="80" y="68" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">
                {config.primaryVoltage ? `${Number(config.primaryVoltage).toLocaleString()}V` : "---V"}
              </text>

              {/* Primary connections */}
              <line x1="60" y1="90" x2="60" y2="130" stroke="hsl(var(--primary))" strokeWidth="2" />
              <line x1="100" y1="90" x2="100" y2="130" stroke="hsl(var(--primary))" strokeWidth="2" />
              <text x="60" y="85" fill="hsl(var(--primary))" fontSize="8" textAnchor="middle" fontWeight="bold">H1</text>
              <text x="100" y="85" fill="hsl(var(--primary))" fontSize="8" textAnchor="middle" fontWeight="bold">H2</text>

              {/* Primary fuses */}
              <rect x="56" y="100" width="8" height="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <rect x="96" y="100" width="8" height="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />

              {/* Transformer core */}
              <rect x="150" y="100" width="200" height="150" fill="hsl(var(--secondary) / 0.3)" stroke="hsl(var(--steel))" strokeWidth="2" rx="4" />

              {/* Primary winding (more detailed coil) */}
              <path
                d="M 190 120 
                   C 210 120, 210 135, 190 135
                   C 170 135, 170 150, 190 150
                   C 210 150, 210 165, 190 165
                   C 170 165, 170 180, 190 180
                   C 210 180, 210 195, 190 195
                   C 170 195, 170 210, 190 210
                   C 210 210, 210 225, 190 225"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2.5"
              />

              {/* Connection lines to primary winding */}
              <line x1="60" y1="130" x2="190" y2="120" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="100" y1="130" x2="190" y2="225" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Core symbol (two parallel lines) */}
              <line x1="240" y1="115" x2="240" y2="235" stroke="hsl(var(--steel))" strokeWidth="3" />
              <line x1="250" y1="115" x2="250" y2="235" stroke="hsl(var(--steel))" strokeWidth="3" />

              {/* Secondary winding */}
              <path
                d="M 300 130 
                   C 320 130, 320 145, 300 145
                   C 280 145, 280 160, 300 160
                   C 320 160, 320 175, 300 175
                   C 280 175, 280 190, 300 190
                   C 320 190, 320 205, 300 205"
                fill="none"
                stroke="hsl(var(--glow))"
                strokeWidth="2.5"
              />

              {/* Secondary connections */}
              <line x1="300" y1="130" x2="400" y2="90" stroke="hsl(var(--glow))" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="300" y1="205" x2="440" y2="90" stroke="hsl(var(--glow))" strokeWidth="1.5" strokeDasharray="4 2" />

              <line x1="400" y1="90" x2="400" y2="270" stroke="hsl(var(--glow))" strokeWidth="2" />
              <line x1="440" y1="90" x2="440" y2="270" stroke="hsl(var(--glow))" strokeWidth="2" />
              <text x="400" y="285" fill="hsl(var(--glow))" fontSize="8" textAnchor="middle" fontWeight="bold">X1</text>
              <text x="440" y="285" fill="hsl(var(--glow))" fontSize="8" textAnchor="middle" fontWeight="bold">X2</text>

              <text x="420" y="55" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
                SECONDARY
              </text>
              <text x="420" y="68" fill="hsl(var(--muted-foreground))" fontSize="9" textAnchor="middle">
                {config.secondaryVoltage || "---V"}
              </text>

              {/* Tap changer symbol */}
              {(hasLTC || hasManualTaps) && (
                <g>
                  <line x1="190" y1="165" x2="165" y2="165" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <circle cx="160" cy="165" r="5" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <line x1="155" y1="165" x2="145" y2="160" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                  <text x="135" y="165" fill="hsl(var(--muted-foreground))" fontSize="7">{hasLTC ? "LTC" : "NLTC"}</text>
                </g>
              )}

              {/* Ratio box */}
              <rect x="200" y="270" width="100" height="25" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="2" />
              <text x="250" y="287" fill="hsl(var(--foreground))" fontSize="9" textAnchor="middle" fontWeight="bold">
                RATIO: {config.primaryVoltage && config.secondaryVoltage 
                  ? `${(Number(config.primaryVoltage) / Number(config.secondaryVoltage.replace('V', ''))).toFixed(2)}:1`
                  : "TBD:1"}
              </text>
            </g>
          )}

          {/* BIL notation */}
          <rect x="10" y="310" width="120" height="30" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="2" />
          <text x="70" y="328" fill="hsl(var(--foreground))" fontSize="8" textAnchor="middle">
            BIL: {config.bilLevel || "TBD"} kV
          </text>

          {/* Cooling notation */}
          <rect x="370" y="310" width="120" height="30" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="2" />
          <text x="430" y="328" fill="hsl(var(--foreground))" fontSize="8" textAnchor="middle">
            COOLING: {config.coolingType || "TBD"}
          </text>
        </svg>
      </div>

      {/* Physical Outline Drawing */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-primary uppercase tracking-wider mb-4">
          Physical Outline Drawing
        </h4>
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto bg-background/50 rounded"
          style={{ maxHeight: "400px" }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="physicalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="hsl(var(--primary) / 0.08)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="tankGradientPhys" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--steel))" />
              <stop offset="100%" stopColor="hsl(var(--steel) / 0.6)" />
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#physicalGrid)" />

          {/* Title */}
          <text x="300" y="25" fill="hsl(var(--primary))" fontSize="12" textAnchor="middle" fontWeight="bold">
            OUTLINE DIMENSIONS & WEIGHT - {config.kva || "TBD"} kVA TRANSFORMER
          </text>

          {/* FRONT VIEW */}
          <text x="150" y="50" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
            FRONT VIEW
          </text>

          {/* Main tank - front */}
          <rect x="60" y="100" width="180" height="200" fill="hsl(var(--secondary) / 0.2)" stroke="hsl(var(--steel))" strokeWidth="2" />
          
          {/* Tank ribs */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={`rib-f-${i}`} x1={75 + i * 25} y1="105" x2={75 + i * 25} y2="295" stroke="hsl(var(--steel) / 0.5)" strokeWidth="1" />
          ))}

          {/* HV Bushings on top */}
          {isThreePhase ? (
            [0, 1, 2].map((i) => (
              <g key={`hv-phys-${i}`}>
                <rect x={95 + i * 40} y="65" width="12" height="40" fill="hsl(var(--copper))" stroke="hsl(var(--copper))" strokeWidth="1" rx="2" />
                <circle cx={101 + i * 40} cy="60" r="6" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="1" />
              </g>
            ))
          ) : (
            [0, 1].map((i) => (
              <g key={`hv-phys-${i}`}>
                <rect x={110 + i * 60} y="65" width="14" height="40" fill="hsl(var(--copper))" stroke="hsl(var(--copper))" strokeWidth="1" rx="2" />
                <circle cx={117 + i * 60} cy="58" r="7" fill="hsl(var(--primary))" stroke="hsl(var(--foreground))" strokeWidth="1" />
              </g>
            ))
          )}

          {/* LV Bushings on bottom */}
          {isThreePhase ? (
            [0, 1, 2, 3].map((i) => (
              <g key={`lv-phys-${i}`}>
                <rect x={90 + i * 35} y="300" width="10" height="30" fill="hsl(var(--copper) / 0.8)" stroke="hsl(var(--copper))" strokeWidth="1" rx="2" />
                <circle cx={95 + i * 35} cy="335" r="5" fill="hsl(var(--glow))" stroke="hsl(var(--foreground))" strokeWidth="1" />
              </g>
            ))
          ) : (
            [0, 1].map((i) => (
              <g key={`lv-phys-${i}`}>
                <rect x={110 + i * 60} y="300" width="12" height="30" fill="hsl(var(--copper) / 0.8)" stroke="hsl(var(--copper))" strokeWidth="1" rx="2" />
                <circle cx={116 + i * 60} cy="335" r="6" fill="hsl(var(--glow))" stroke="hsl(var(--foreground))" strokeWidth="1" />
              </g>
            ))
          )}

          {/* Conservator - front */}
          <rect x="190" y="70" width="60" height="25" fill="url(#tankGradientPhys)" stroke="hsl(var(--steel))" strokeWidth="1.5" rx="3" />
          <line x1="200" y1="95" x2="200" y2="100" stroke="hsl(var(--steel))" strokeWidth="2" />

          {/* Lifting lugs */}
          <circle cx="75" cy="105" r="6" fill="none" stroke="hsl(var(--steel))" strokeWidth="2" />
          <circle cx="225" cy="105" r="6" fill="none" stroke="hsl(var(--steel))" strokeWidth="2" />

          {/* Cooling fans if applicable */}
          {hasForcedCooling && (
            <>
              <circle cx="35" cy="200" r="15" fill="hsl(var(--secondary))" stroke="hsl(var(--steel))" strokeWidth="1.5" />
              <circle cx="265" cy="200" r="15" fill="hsl(var(--secondary))" stroke="hsl(var(--steel))" strokeWidth="1.5" />
              <text x="35" y="220" fill="hsl(var(--muted-foreground))" fontSize="6" textAnchor="middle">FAN</text>
              <text x="265" y="220" fill="hsl(var(--muted-foreground))" fontSize="6" textAnchor="middle">FAN</text>
            </>
          )}

          {/* Tap changer */}
          {(hasLTC || hasManualTaps) && (
            <g>
              <rect x="240" y="120" width="25" height="50" fill="hsl(var(--secondary))" stroke="hsl(var(--steel))" strokeWidth="1.5" rx="2" />
              <text x="252" y="148" fill="hsl(var(--muted-foreground))" fontSize="6" textAnchor="middle">{hasLTC ? "LTC" : "NLTC"}</text>
            </g>
          )}

          {/* Width dimension line */}
          <g stroke="hsl(var(--primary))" strokeWidth="1">
            <line x1="60" y1="360" x2="240" y2="360" />
            <line x1="60" y1="355" x2="60" y2="365" />
            <line x1="240" y1="355" x2="240" y2="365" />
            <polygon points="60,360 70,357 70,363" fill="hsl(var(--primary))" />
            <polygon points="240,360 230,357 230,363" fill="hsl(var(--primary))" />
          </g>
          <text x="150" y="378" fill="hsl(var(--primary))" fontSize="10" textAnchor="middle" fontWeight="bold">
            W = {dims.width}" ({(dims.width * 2.54).toFixed(0)} cm)
          </text>

          {/* Height dimension line */}
          <g stroke="hsl(var(--glow))" strokeWidth="1">
            <line x1="20" y1="60" x2="20" y2="335" />
            <line x1="15" y1="60" x2="25" y2="60" />
            <line x1="15" y1="335" x2="25" y2="335" />
            <polygon points="20,60 17,70 23,70" fill="hsl(var(--glow))" />
            <polygon points="20,335 17,325 23,325" fill="hsl(var(--glow))" />
          </g>
          <text x="20" y="200" fill="hsl(var(--glow))" fontSize="10" textAnchor="middle" fontWeight="bold" transform="rotate(-90 20 200)">
            H = {dims.height}" ({(dims.height * 2.54).toFixed(0)} cm)
          </text>

          {/* SIDE VIEW */}
          <text x="450" y="50" fill="hsl(var(--foreground))" fontSize="10" textAnchor="middle" fontWeight="bold">
            SIDE VIEW
          </text>

          {/* Main tank - side */}
          <rect x="380" y="100" width="140" height="200" fill="hsl(var(--secondary) / 0.2)" stroke="hsl(var(--steel))" strokeWidth="2" />

          {/* Radiator fins - side */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={`rad-${i}`}>
              <rect x={390 + i * 25} y="110" width="3" height="180" fill="hsl(var(--steel) / 0.6)" stroke="hsl(var(--steel))" strokeWidth="0.5" />
            </g>
          ))}

          {/* Conservator - side */}
          <rect x="470" y="70" width="50" height="20" fill="url(#tankGradientPhys)" stroke="hsl(var(--steel))" strokeWidth="1.5" rx="2" />
          <line x1="475" y1="90" x2="475" y2="100" stroke="hsl(var(--steel))" strokeWidth="2" />

          {/* HV bushings - side view */}
          <rect x="420" y="65" width="10" height="40" fill="hsl(var(--copper))" stroke="hsl(var(--copper))" strokeWidth="1" rx="2" />
          <circle cx="425" cy="58" r="5" fill="hsl(var(--primary))" />

          {/* LV bushings - side view */}
          <rect x="420" y="300" width="8" height="30" fill="hsl(var(--copper) / 0.8)" stroke="hsl(var(--copper))" strokeWidth="1" rx="2" />
          <circle cx="424" cy="335" r="5" fill="hsl(var(--glow))" />

          {/* Drain valve */}
          <circle cx="450" cy="295" r="4" fill="none" stroke="hsl(var(--steel))" strokeWidth="1.5" />
          <text x="450" y="310" fill="hsl(var(--muted-foreground))" fontSize="5" textAnchor="middle">DRAIN</text>

          {/* Depth dimension line */}
          <g stroke="hsl(var(--copper))" strokeWidth="1">
            <line x1="380" y1="360" x2="520" y2="360" />
            <line x1="380" y1="355" x2="380" y2="365" />
            <line x1="520" y1="355" x2="520" y2="365" />
            <polygon points="380,360 390,357 390,363" fill="hsl(var(--copper))" />
            <polygon points="520,360 510,357 510,363" fill="hsl(var(--copper))" />
          </g>
          <text x="450" y="378" fill="hsl(var(--copper))" fontSize="10" textAnchor="middle" fontWeight="bold">
            D = {dims.depth}" ({(dims.depth * 2.54).toFixed(0)} cm)
          </text>

          {/* Weight and oil data box */}
          <rect x="300" y="95" width="75" height="85" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" rx="3" />
          <text x="337" y="110" fill="hsl(var(--primary))" fontSize="8" textAnchor="middle" fontWeight="bold">WEIGHT DATA</text>
          <line x1="305" y1="115" x2="370" y2="115" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <text x="310" y="128" fill="hsl(var(--muted-foreground))" fontSize="7">Total:</text>
          <text x="365" y="128" fill="hsl(var(--foreground))" fontSize="7" textAnchor="end" fontWeight="bold">{dims.weight.toLocaleString()} lbs</text>
          <text x="310" y="142" fill="hsl(var(--muted-foreground))" fontSize="7">Oil:</text>
          <text x="365" y="142" fill="hsl(var(--foreground))" fontSize="7" textAnchor="end">{dims.oilGallons} gal</text>
          <text x="310" y="156" fill="hsl(var(--muted-foreground))" fontSize="7">Core/Coil:</text>
          <text x="365" y="156" fill="hsl(var(--foreground))" fontSize="7" textAnchor="end">{Math.round(dims.weight * 0.6).toLocaleString()} lbs</text>
          <text x="310" y="170" fill="hsl(var(--muted-foreground))" fontSize="7">Tank:</text>
          <text x="365" y="170" fill="hsl(var(--foreground))" fontSize="7" textAnchor="end">{Math.round(dims.weight * 0.25).toLocaleString()} lbs</text>

          {/* Nameplate location marker */}
          <rect x="100" y="180" width="100" height="40" fill="hsl(var(--background) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 2" />
          <text x="150" y="195" fill="hsl(var(--muted-foreground))" fontSize="7" textAnchor="middle">NAMEPLATE</text>
          <text x="150" y="208" fill="hsl(var(--muted-foreground))" fontSize="7" textAnchor="middle">LOCATION</text>
        </svg>
      </div>

      {/* Original Equipment Drawing */}
      <div className="bg-secondary/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-primary uppercase tracking-wider mb-4">
          Equipment Assembly Drawing
        </h4>
        <svg
          viewBox="0 0 400 320"
          className="w-full h-auto"
          style={{ maxHeight: "300px" }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="specGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="hsl(var(--primary) / 0.08)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--steel))" />
              <stop offset="100%" stopColor="hsl(var(--steel) / 0.7)" />
            </linearGradient>
            <linearGradient id="oilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--saddle) / 0.3)" />
              <stop offset="100%" stopColor="hsl(var(--saddle) / 0.5)" />
            </linearGradient>
          </defs>
          <rect width="400" height="320" fill="url(#specGrid)" />

          {/* Main tank body */}
          <rect
            x="80"
            y="60"
            width="240"
            height="180"
            rx="4"
            fill="url(#oilGradient)"
            stroke="hsl(var(--steel))"
            strokeWidth="3"
          />

          {/* Tank ribs/corrugations for cooling */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={`rib-${i}`}
              d={`M ${85 + i * 40} 65 L ${85 + i * 40} 235`}
              stroke="hsl(var(--steel) / 0.4)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Conservator tank (oil expansion) */}
          <rect
            x="280"
            y="30"
            width="60"
            height="25"
            rx="3"
            fill="url(#tankGradient)"
            stroke="hsl(var(--steel))"
            strokeWidth="2"
          />
          <path
            d="M 290 55 L 290 60"
            stroke="hsl(var(--steel))"
            strokeWidth="2"
          />
          <text
            x="310"
            y="47"
            fill="hsl(var(--muted-foreground))"
            fontSize="8"
            textAnchor="middle"
          >
            CONSERVATOR
          </text>

          {/* HV Bushings (Primary) */}
          {isThreePhase ? (
            <>
              {[0, 1, 2].map((i) => (
                <g key={`hv-${i}`}>
                  <rect
                    x={120 + i * 50}
                    y="35"
                    width="12"
                    height="35"
                    rx="2"
                    fill="hsl(var(--copper))"
                    stroke="hsl(var(--copper))"
                    strokeWidth="1"
                  />
                  <circle
                    cx={126 + i * 50}
                    cy="30"
                    r="6"
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                  />
                  <text
                    x={126 + i * 50}
                    y="22"
                    fill="hsl(var(--primary))"
                    fontSize="8"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    H{i + 1}
                  </text>
                </g>
              ))}
            </>
          ) : (
            <>
              {[0, 1].map((i) => (
                <g key={`hv-${i}`}>
                  <rect
                    x={140 + i * 60}
                    y="35"
                    width="14"
                    height="35"
                    rx="2"
                    fill="hsl(var(--copper))"
                    stroke="hsl(var(--copper))"
                    strokeWidth="1"
                  />
                  <circle
                    cx={147 + i * 60}
                    cy="30"
                    r="7"
                    fill="hsl(var(--primary))"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                  />
                  <text
                    x={147 + i * 60}
                    y="20"
                    fill="hsl(var(--primary))"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    H{i + 1}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* LV Bushings (Secondary) */}
          {isThreePhase ? (
            <>
              {[0, 1, 2, 3].map((i) => (
                <g key={`lv-${i}`}>
                  <rect
                    x={110 + i * 45}
                    y="240"
                    width="10"
                    height="25"
                    rx="2"
                    fill="hsl(var(--copper) / 0.8)"
                    stroke="hsl(var(--copper))"
                    strokeWidth="1"
                  />
                  <circle
                    cx={115 + i * 45}
                    cy="270"
                    r="5"
                    fill="hsl(var(--glow))"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                  />
                  <text
                    x={115 + i * 45}
                    y="285"
                    fill="hsl(var(--glow))"
                    fontSize="8"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {i === 3 ? "N" : `X${i + 1}`}
                  </text>
                </g>
              ))}
            </>
          ) : (
            <>
              {[0, 1].map((i) => (
                <g key={`lv-${i}`}>
                  <rect
                    x={140 + i * 60}
                    y="240"
                    width="12"
                    height="25"
                    rx="2"
                    fill="hsl(var(--copper) / 0.8)"
                    stroke="hsl(var(--copper))"
                    strokeWidth="1"
                  />
                  <circle
                    cx={146 + i * 60}
                    cy="270"
                    r="6"
                    fill="hsl(var(--glow))"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                  />
                  <text
                    x={146 + i * 60}
                    y="285"
                    fill="hsl(var(--glow))"
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    X{i + 1}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* Cooling fans (if ONAF) */}
          {hasForcedCooling && (
            <>
              {[0, 1].map((i) => (
                <g key={`fan-${i}`}>
                  <circle
                    cx={45 + i * 310}
                    cy="150"
                    r="18"
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--steel))"
                    strokeWidth="2"
                  />
                  <path
                    d={`M ${45 + i * 310} 140 L ${45 + i * 310} 160 M ${35 + i * 310} 150 L ${55 + i * 310} 150`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <circle
                    cx={45 + i * 310}
                    cy="150"
                    r="5"
                    fill="hsl(var(--primary))"
                  />
                </g>
              ))}
              <text
                x="45"
                y="180"
                fill="hsl(var(--muted-foreground))"
                fontSize="7"
                textAnchor="middle"
              >
                FAN
              </text>
            </>
          )}

          {/* Tap changer (if applicable) */}
          {(hasLTC || hasManualTaps) && (
            <g>
              <rect
                x="320"
                y="90"
                width="30"
                height="60"
                rx="3"
                fill="hsl(var(--secondary))"
                stroke="hsl(var(--steel))"
                strokeWidth="2"
              />
              <text
                x="335"
                y="115"
                fill="hsl(var(--primary))"
                fontSize="7"
                textAnchor="middle"
                fontWeight="bold"
              >
                {hasLTC ? "LTC" : "TAP"}
              </text>
              <text
                x="335"
                y="130"
                fill="hsl(var(--muted-foreground))"
                fontSize="6"
                textAnchor="middle"
              >
                {hasLTC ? "AUTO" : "MANUAL"}
              </text>
              <rect
                x="327"
                y="135"
                width="16"
                height="10"
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
              <text
                x="335"
                y="143"
                fill="hsl(var(--glow))"
                fontSize="7"
                textAnchor="middle"
                fontWeight="bold"
              >
                N
              </text>
            </g>
          )}

          {/* Nameplate */}
          <rect
            x="130"
            y="100"
            width="140"
            height="80"
            rx="2"
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
          <text
            x="200"
            y="118"
            fill="hsl(var(--primary))"
            fontSize="10"
            textAnchor="middle"
            fontWeight="bold"
          >
            TEXAS TRAFO
          </text>
          <line
            x1="140"
            y1="124"
            x2="260"
            y2="124"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          <text
            x="200"
            y="138"
            fill="hsl(var(--foreground))"
            fontSize="12"
            textAnchor="middle"
            fontWeight="bold"
          >
            {config.kva ? `${config.kva} kVA` : "TBD kVA"}
          </text>
          <text
            x="200"
            y="152"
            fill="hsl(var(--muted-foreground))"
            fontSize="9"
            textAnchor="middle"
          >
            {config.primaryVoltage ? `${Number(config.primaryVoltage).toLocaleString()}V` : "---V"} / {config.secondaryVoltage || "---V"}
          </text>
          <text
            x="200"
            y="165"
            fill="hsl(var(--muted-foreground))"
            fontSize="8"
            textAnchor="middle"
          >
            {config.phase ? (isThreePhase ? "3Ø" : "1Ø") : "-Ø"} • {config.coolingType || "---"} • BIL {config.bilLevel || "--"}kV
          </text>

          {/* Ground symbol */}
          <g>
            <line
              x1="200"
              y1="240"
              x2="200"
              y2="255"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
            />
            <line
              x1="190"
              y1="255"
              x2="210"
              y2="255"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
            />
            <line
              x1="194"
              y1="260"
              x2="206"
              y2="260"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
            />
            <line
              x1="197"
              y1="265"
              x2="203"
              y2="265"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
            />
          </g>

          {/* Lifting lugs */}
          {[0, 1].map((i) => (
            <circle
              key={`lug-${i}`}
              cx={100 + i * 200}
              cy="65"
              r="6"
              fill="none"
              stroke="hsl(var(--steel))"
              strokeWidth="2"
            />
          ))}

          {/* Dimension lines */}
          <g stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="2 2">
            <line x1="80" y1="295" x2="320" y2="295" />
            <line x1="80" y1="290" x2="80" y2="300" />
            <line x1="320" y1="290" x2="320" y2="300" />
            <text
              x="200"
              y="308"
              fill="hsl(var(--muted-foreground))"
              fontSize="8"
              textAnchor="middle"
            >
              W: ~{dims.width}"
            </text>
          </g>

          {/* Labels */}
          <text
            x="200"
            y="15"
            fill="hsl(var(--primary))"
            fontSize="9"
            textAnchor="middle"
            fontWeight="bold"
          >
            PRIMARY ({config.primaryVoltage ? `${Number(config.primaryVoltage).toLocaleString()}V` : "---V"})
          </text>
          <text
            x="200"
            y="315"
            fill="hsl(var(--glow))"
            fontSize="9"
            textAnchor="middle"
            fontWeight="bold"
          >
            SECONDARY ({config.secondaryVoltage || "---V"})
          </text>
        </svg>
      </div>
    </div>
  );
};

export default TransformerDrawing;
