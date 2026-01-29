import { Star } from "lucide-react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import landTopo from "@/assets/world-land-110m.json";

type RawLocation = {
  name: string;
  lon: number; // -180..180
  lat: number; // -90..90
};

const WIDTH = 900;
const HEIGHT = 450;

const locations: RawLocation[] = [
  // North America - expanded
  { name: "New York", lon: -74.01, lat: 40.71 },
  { name: "Los Angeles", lon: -118.24, lat: 34.05 },
  { name: "Chicago", lon: -87.63, lat: 41.88 },
  { name: "Houston", lon: -95.37, lat: 29.76 },
  { name: "Phoenix", lon: -112.07, lat: 33.45 },
  { name: "Dallas", lon: -96.80, lat: 32.78 },
  { name: "Seattle", lon: -122.33, lat: 47.61 },
  { name: "Denver", lon: -104.99, lat: 39.74 },
  { name: "Atlanta", lon: -84.39, lat: 33.75 },
  { name: "Miami", lon: -80.19, lat: 25.76 },
  { name: "Toronto", lon: -79.38, lat: 43.65 },
  { name: "Vancouver", lon: -123.12, lat: 49.28 },
  { name: "Montreal", lon: -73.57, lat: 45.50 },
  { name: "Calgary", lon: -114.07, lat: 51.05 },
  { name: "Edmonton", lon: -113.49, lat: 53.55 },
  { name: "Ottawa", lon: -75.70, lat: 45.42 },
  { name: "Winnipeg", lon: -97.14, lat: 49.90 },
  { name: "Mexico City", lon: -99.13, lat: 19.43 },
  { name: "Monterrey", lon: -100.31, lat: 25.69 },
  { name: "Guadalajara", lon: -103.35, lat: 20.67 },
  { name: "Tijuana", lon: -117.04, lat: 32.51 },
  { name: "Puebla", lon: -98.21, lat: 19.04 },
  { name: "León", lon: -101.69, lat: 21.13 },
  { name: "Querétaro", lon: -100.39, lat: 20.59 },
  // International
  { name: "Brazil", lon: -51.93, lat: -14.24 },
  { name: "India", lon: 78.96, lat: 20.59 },
  { name: "China", lon: 104.2, lat: 35.86 },
  { name: "Japan", lon: 138.25, lat: 36.2 },
  { name: "UK", lon: -3.44, lat: 55.38 },
  { name: "Germany", lon: 10.45, lat: 51.17 },
  { name: "France", lon: 2.21, lat: 46.23 },
  { name: "Australia", lon: 133.78, lat: -25.27 },
  { name: "South Korea", lon: 127.77, lat: 35.91 },
  { name: "UAE", lon: 53.85, lat: 23.42 },
  { name: "Saudi Arabia", lon: 45.08, lat: 23.89 },
  { name: "South Africa", lon: 22.94, lat: -30.56 },
  { name: "Argentina", lon: -63.62, lat: -38.42 },
  { name: "Chile", lon: -71.54, lat: -35.68 },
  { name: "Indonesia", lon: 113.92, lat: -0.79 },
  { name: "Vietnam", lon: 108.28, lat: 14.06 },
  { name: "Thailand", lon: 100.99, lat: 15.87 },
  { name: "Philippines", lon: 121.77, lat: 12.88 },
  { name: "Malaysia", lon: 101.98, lat: 4.21 },
  { name: "Nigeria", lon: 8.68, lat: 9.08 },
  { name: "Egypt", lon: 30.80, lat: 26.82 },
  { name: "Turkey", lon: 35.24, lat: 38.96 },
  { name: "Poland", lon: 19.15, lat: 51.92 },
  { name: "Spain", lon: -3.75, lat: 40.46 },
];

const topoAny = landTopo as unknown as { objects: { land: unknown } };
const land = feature(topoAny as any, topoAny.objects.land as any) as any;

const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], land);
const path = geoPath(projection);
const graticule = geoGraticule10();

const GlobalNetworkMap = () => {
  return (
    <div className="w-[560px] p-4 bg-card border border-border rounded-xl shadow-lg">
      <h4 className="font-display text-lg text-foreground mb-3 text-center">
        Our Global Partner Network
      </h4>

      <div className="rounded-lg overflow-hidden border border-border/60">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="World map with partner locations marked"
        >
          {/* Ocean */}
          <rect
            x={0}
            y={0}
            width={WIDTH}
            height={HEIGHT}
            fill="hsl(var(--muted) / 0.35)"
          />

          {/* Graticule */}
          <path
            d={path(graticule) ?? ""}
            fill="none"
            stroke="hsl(var(--border) / 0.35)"
            strokeWidth={0.75}
          />

          {/* Land */}
          <path
            d={path(land) ?? ""}
            fill="hsl(var(--secondary) / 0.95)"
            stroke="hsl(var(--border) / 0.9)"
            strokeWidth={1}
          />

          {/* Markers */}
          {locations.map((loc) => {
            const p = projection([loc.lon, loc.lat]);
            if (!p) return null;
            const [x, y] = p;

            return (
              <g key={loc.name} transform={`translate(${x}, ${y})`}>
                {/* Pulse */}
                <circle r={6} fill="hsl(var(--primary) / 0.25)">
                  <animate
                    attributeName="r"
                    values="5;9;5"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.25;0.05;0.25"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Inner glow */}
                <circle r={2.5} fill="hsl(var(--primary) / 0.65)" />

                {/* Star */}
                <foreignObject x={-5} y={-5} width={10} height={10}>
                  <Star className="w-2.5 h-2.5 text-primary fill-primary" />
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-3">
        {locations.map((loc) => (
          <span
            key={loc.name}
            className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded flex items-center gap-0.5"
          >
            <Star className="w-2 h-2 text-primary fill-primary" />
            {loc.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GlobalNetworkMap;
