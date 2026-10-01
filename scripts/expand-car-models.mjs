import fs from 'fs'

const detailed = {
  Toyota: [
    'Camry', 'Corolla', 'Corolla Cross', 'Prius', 'Prius C', 'Prius V', 'Prius Prime', 'RAV4',
    'Highlander', 'Land Cruiser', 'Land Cruiser Prado', 'Yaris', 'Yaris Cross', 'C-HR', 'Aqua',
    'Vitz', 'Passo', 'Auris', 'Avensis', 'Hilux', 'Tacoma', 'Tundra', '4Runner', 'Sequoia',
    'Sienna', 'Avalon', 'Crown', 'Mark X', 'Harrier', 'Noah', 'Voxy', 'Alphard', 'Vellfire',
    'Estima', 'Wish', 'Premio', 'Allion', 'Isis', 'Raize', 'Rush', 'Fortuner', 'FJ Cruiser',
    'Celica', 'Supra', 'MR2', 'Matrix', 'Echo', 'Solara', 'bZ4X', 'Urban Cruiser', 'Proace',
    'Hiace', 'Dyna', 'IQ', 'Aygo', 'Verso', 'Picnic', 'Ipsum', 'Sienta', 'Porte', 'Spade',
    'Roomy', 'Tank', 'Corolla Fielder', 'Corolla Axio', 'Corolla Rumion', 'Succeed', 'Probox',
    'TownAce', 'LiteAce',
  ],
  'Mercedes-Benz': [
    'A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'S-Class', 'G-Class', 'GLA', 'GLB',
    'GLC', 'GLE', 'GLS', 'GLK', 'ML', 'R-Class', 'SL', 'SLC', 'SLK', 'CLK', 'CL', 'AMG GT',
    'Vito', 'Viano', 'V-Class', 'Sprinter', 'Citan', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'EQV',
    'Maybach S-Class', 'X-Class', 'GL', 'Metris', '190', 'W124', 'W210', 'C200', 'C220', 'C250',
    'C300', 'C350', 'E200', 'E220', 'E250', 'E300', 'E350', 'E400', 'S350', 'S400', 'S500',
    'S550', 'S600', 'G350', 'G500', 'G55', 'G63',
  ],
  BMW: [
    '116', '118', '120', '125', '128', '130', '135', 'M135i', '218', '220', '225', '228', '230',
    'M2', '316', '318', '320', '323', '325', '328', '330', '335', '340', 'M3', '420', '428',
    '430', '435', '440', 'M4', '520', '523', '525', '528', '530', '535', '540', '545', '550',
    'M5', '630', '640', '650', 'M6', '730', '740', '745', '750', '760', 'X1', 'X2', 'X3', 'X4',
    'X5', 'X6', 'X7', 'XM', 'Z3', 'Z4', 'i3', 'i4', 'i5', 'i7', 'iX', 'iX1', 'iX3',
    'ActiveHybrid 3', 'ActiveHybrid 5', 'ActiveHybrid 7', '1 Series', '2 Series', '3 Series',
    '4 Series', '5 Series', '6 Series', '7 Series', '8 Series',
  ],
  Honda: [
    'Civic', 'Accord', 'Fit', 'Jazz', 'CR-V', 'HR-V', 'Pilot', 'Odyssey', 'Insight', 'City',
    'Stream', 'Freed', 'Stepwgn', 'Vezel', 'Shuttle', 'Grace', 'Legend', 'NSX', 'S2000', 'CR-Z',
    'Element', 'Ridgeline', 'Passport', 'Crosstour', 'FR-V', 'Integra', 'Prelude', 'CRX',
    'N-BOX', 'N-WGN', 'N-ONE', 'e', 'ZR-V', 'WR-V', 'Elevate', 'BR-V', 'Mobilio', 'Brio',
  ],
  Hyundai: [
    'Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Accent', 'Kona', 'i10', 'i20', 'i30', 'i40',
    'ix35', 'ix55', 'Getz', 'Matrix', 'Coupe', 'Veloster', 'Genesis', 'Equus', 'Azera',
    'Grandeur', 'Palisade', 'Venue', 'Creta', 'Staria', 'H-1', 'Starex', 'Porter', 'Ioniq',
    'Ioniq 5', 'Ioniq 6', 'Nexo', 'Santa Cruz', 'Bayon', 'Alcazar', 'Atos', 'Terracan',
    'Galloper', 'Tiburon', 'Trajet', 'Veracruz', 'Santa Fe Sport', 'Kona Electric',
    'Elantra N', 'i30 N',
  ],
  Kia: [
    'Optima', 'K5', 'Sorento', 'Sportage', 'Rio', 'Cerato', 'Soul', 'Picanto', 'Ceed',
    'Proceed', 'XCeed', 'Stonic', 'Seltos', 'Niro', 'EV6', 'EV9', 'Carnival', 'Sedona',
    'Cadenza', 'K7', 'K8', 'K9', 'Stinger', 'Telluride', 'Sorento Hybrid', 'Sportage Hybrid',
    'Mohave', 'Borrego', 'Venga', 'Carens', 'Rondo', 'Magentis', 'Spectra', 'Sephia', 'Pride',
    'Morning', 'Ray', 'Soul EV', 'Niro EV',
  ],
  Lexus: [
    'IS200', 'IS250', 'IS300', 'IS350', 'IS500', 'IS-F', 'ES250', 'ES300', 'ES300h', 'ES350',
    'GS300', 'GS350', 'GS450h', 'GS-F', 'LS400', 'LS430', 'LS460', 'LS500', 'LS600h', 'RX270',
    'RX300', 'RX330', 'RX350', 'RX400h', 'RX450h', 'RX500h', 'NX200', 'NX200t', 'NX300',
    'NX300h', 'NX350', 'NX450h', 'GX460', 'GX550', 'LX470', 'LX570', 'LX600', 'UX200',
    'UX250h', 'UX300h', 'CT200h', 'RC200t', 'RC300', 'RC350', 'RC-F', 'LC500', 'LC500h',
    'LFA', 'RZ450e', 'TX350', 'TX500h',
  ],
  Ford: [
    'Fusion', 'Escape', 'Focus', 'Mustang', 'Explorer', 'Transit', 'Fiesta', 'Mondeo', 'Kuga',
    'Edge', 'Expedition', 'F-150', 'F-250', 'Ranger', 'EcoSport', 'Puma', 'Bronco',
    'Bronco Sport', 'Maverick', 'Taurus', 'Galaxy', 'S-Max', 'C-Max', 'B-Max', 'KA', 'Ka+',
    'Courier', 'Connect', 'Custom', 'Tourneo', 'Everest', 'Territory', 'Mustang Mach-E', 'GT',
    'Thunderbird', 'Crown Victoria', 'Flex', 'Freestyle', 'Five Hundred', 'Probe', 'Escort',
    'Sierra',
  ],
  Nissan: [
    'Altima', 'Sentra', 'Maxima', 'Rogue', 'X-Trail', 'Leaf', 'Qashqai', 'Juke', 'Pathfinder',
    'Murano', 'Armada', 'Patrol', 'Navara', 'Frontier', 'Titan', 'Note', 'Micra', 'March',
    'Tiida', 'Sunny', 'Teana', 'Skyline', 'GT-R', '370Z', '350Z', 'Fairlady', 'Serena',
    'Elgrand', 'Quest', 'NV200', 'NV350', 'Primera', 'Almera', 'Bluebird', 'Cefiro', 'Laurel',
    'Cima', 'Fuga', 'Ariya', 'Kicks', 'Versa', 'Cube', 'Livina', 'Xterra', 'Terrano', 'Safari',
  ],
  Chevrolet: [
    'Malibu', 'Cruze', 'Camaro', 'Tahoe', 'Equinox', 'Spark', 'Impala', 'Traverse', 'Trax',
    'Blazer', 'Suburban', 'Silverado', 'Colorado', 'Avalanche', 'Corvette', 'Captiva',
    'Orlando', 'Aveo', 'Sonic', 'Volt', 'Bolt', 'Bolt EUV', 'Trailblazer', 'Tracker', 'Niva',
    'Lacetti', 'Epica', 'Evanda', 'Matiz', 'Cobalt', 'Onix', 'Prisma', 'Spin', 'Montana', 'S10',
    'Express', 'Astro', 'Venture', 'Uplander', 'SSR', 'HHR',
  ],
  Audi: [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8',
    'TT', 'R8', 'e-tron', 'e-tron GT', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RS Q3', 'RS Q8',
    'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'SQ8', 'Allroad', '80', '90', '100',
    '200', 'V8', 'Cabriolet',
  ],
  Volkswagen: [
    'Golf', 'Golf Plus', 'Golf GTI', 'Golf R', 'Passat', 'Passat CC', 'CC', 'Tiguan', 'Polo',
    'Jetta', 'Arteon', 'Touareg', 'Touran', 'Sharan', 'Caddy', 'Transporter', 'Multivan',
    'Caravelle', 'Amarok', 'T-Roc', 'T-Cross', 'Taigo', 'ID.3', 'ID.4', 'ID.5', 'ID.7',
    'ID.Buzz', 'Scirocco', 'Beetle', 'New Beetle', 'Eos', 'Phaeton', 'Up', 'Lupo', 'Fox',
    'Bora', 'Vento', 'Santana', 'Tiguan Allspace',
  ],
  Porsche: [
    '911', '911 Carrera', '911 Turbo', '911 GT3', 'Cayenne', 'Cayenne Coupe', 'Macan',
    'Panamera', 'Taycan', 'Boxster', 'Cayman', '718 Boxster', '718 Cayman', '918 Spyder',
    'Carrera GT', '944', '928', '968', '924',
  ],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster', 'Semi'],
  Subaru: [
    'Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'Crosstrek', 'WRX', 'WRX STI', 'BRZ',
    'Ascent', 'Tribeca', 'Baja', 'Justy', 'Leone', 'SVX', 'Exiga', 'Levorg', 'Solterra',
    'Trezia',
  ],
  Jeep: [
    'Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Patriot',
    'Commander', 'Liberty', 'Wagoneer', 'Grand Wagoneer', 'Avenger', 'CJ', 'Willys',
  ],
}

const additional = JSON.parse(fs.readFileSync(new URL('./expand-car-models-extra.json', import.meta.url), 'utf8'))

function uniqSorted(arr) {
  return [...new Set(arr.map((s) => String(s).trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  )
}

for (const k of Object.keys(detailed)) detailed[k] = uniqSorted(detailed[k])
for (const k of Object.keys(additional)) additional[k] = uniqSorted(additional[k])

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const arr = (models) => '[' + models.map((m) => "'" + esc(m) + "'").join(', ') + ']'

let out = `export type CarBrandEntry = {
  brand: string
  logo: string
  models: string[]
}

/** Brands with local logos + curated models (used for TOP grid and model pickers) */
const detailedBrands: CarBrandEntry[] = [
`

for (const [brand, models] of Object.entries(detailed)) {
  const logo =
    '/brands/' +
    brand
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/'/g, '')
      .replace(/\s+/g, '-') +
    '.png'
  out += `  {
    brand: '${esc(brand)}',
    logo: '${logo}',
    models: ${arr(models)},
  },
`
}

out += `]

/** Full brand list with logical models; merged with detailed brands above. */
const additionalBrands: Record<string, string[]> = {
`

for (const [brand, models] of Object.entries(additional)) {
  const key = /^[A-Za-z_][A-Za-z0-9_]*$/.test(brand) ? brand : `'${esc(brand)}'`
  out += `  ${key}: ${arr(models)},
`
}

out += `}

/** Build a logo slug matching the downloaded file names in /public/brands. */
export function brandLogoSlug(brand: string): string {
  return brand
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/'/g, '')
    .replace(/\\s+/g, '-')
}

export const carBrands: CarBrandEntry[] = [
  ...detailedBrands,
  ...Object.entries(additionalBrands).map(([brand, models]) => ({
    brand,
    logo: \`/brands/\${brandLogoSlug(brand)}.png\`,
    models,
  })),
]

/** Top 10 brands shown as logo grid */
export const TOP_BRAND_NAMES = [
  'Toyota',
  'Mercedes-Benz',
  'BMW',
  'Honda',
  'Hyundai',
  'Ford',
  'Subaru',
  'Chevrolet',
  'Jeep',
  'Nissan',
] as const

export function findCarBrand(brand: string): CarBrandEntry | undefined {
  const normalized = brand.trim().toLowerCase()
  return carBrands.find((b) => b.brand.toLowerCase() === normalized)
}

export function carMatchesBrand(carBrand: string, filterBrand: string): boolean {
  if (!filterBrand) return true
  return carBrand.trim().toLowerCase() === filterBrand.trim().toLowerCase()
}

export function carMatchesModel(carModel: string, filterModel: string): boolean {
  if (!filterModel) return true
  return carModel.trim().toLowerCase() === filterModel.trim().toLowerCase()
}
`

fs.writeFileSync('data/car-brands.ts', out)
const all = { ...detailed, ...additional }
const counts = Object.values(all).map((a) => a.length)
console.log('brands', Object.keys(all).length)
console.log('total models', counts.reduce((a, b) => a + b, 0))
console.log('avg', (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1))
console.log('min/max', Math.min(...counts), Math.max(...counts))
