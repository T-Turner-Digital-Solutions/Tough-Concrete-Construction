interface CityMarker {
  name: string;
  x: number;
  y: number;
  hq?: boolean;
}

// Stylized (not survey-accurate) outline of Alabama and approximate relative
// positions for each service-area city, hand-placed from real lat/long so
// the layout reads correctly at a glance — this is a locator graphic, not a
// navigational map, so no external map provider/API key is required.
const CITIES: CityMarker[] = [
  { name: 'Huntsville', x: 215, y: 64 },
  { name: 'Anniston', x: 284, y: 157 },
  { name: 'Birmingham', x: 196, y: 169, hq: true },
  { name: 'Tuscaloosa', x: 125, y: 197 },
  { name: 'Selma', x: 175, y: 267 },
  { name: 'Montgomery', x: 241, y: 270 },
  { name: 'Dothan', x: 325, y: 371 },
  { name: 'Mobile', x: 82, y: 417 },
];

const ALABAMA_OUTLINE =
  'M40,40 L360,40 L355,250 L340,320 L330,400 L200,430 L150,430 L130,460 L90,460 L75,430 L60,350 L55,250 L50,150 L45,80 Z';

export function AlabamaServiceMap() {
  return (
    <svg viewBox="25 25 350 450" className="h-auto w-full" role="img" aria-label="Map of Tough Concrete Construction's Alabama service area">
      <path d={ALABAMA_OUTLINE} className="fill-steel-50 stroke-steel-300" strokeWidth={2.5} strokeLinejoin="round" />
      {CITIES.map((city) => (
        <g key={city.name}>
          <circle cx={city.x} cy={city.y} r={city.hq ? 9 : 5.5} className={city.hq ? 'fill-safety-500' : 'fill-steel-600'} stroke="white" strokeWidth={2} />
          {city.hq && <circle cx={city.x} cy={city.y} r={16} className="fill-none stroke-safety-500/40" strokeWidth={2} />}
          <text
            x={city.x}
            y={city.hq ? city.y - 22 : city.y - 12}
            textAnchor="middle"
            className={city.hq ? 'fill-concrete-950 text-[15px] font-bold' : 'fill-concrete-600 text-[12px] font-semibold'}
          >
            {city.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
