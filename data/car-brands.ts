export type CarBrandEntry = {
  brand: string
  logo: string
  models: string[]
}

/** Brands with local logos + curated models (used for TOP grid and model pickers) */
const detailedBrands: CarBrandEntry[] = [
  {
    brand: 'Toyota',
    logo: '/brands/toyota.png',
    models: ['Camry', 'Corolla', 'Prius', 'RAV4', 'Highlander', 'Land Cruiser', 'Yaris', 'C-HR'],
  },
  {
    brand: 'Mercedes-Benz',
    logo: '/brands/mercedes-benz.png',
    models: ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'C300', 'ML'],
  },
  {
    brand: 'BMW',
    logo: '/brands/bmw.png',
    models: ['320', '325', '330', '520', '530', 'X3', 'X5', 'X6', 'M4'],
  },
  {
    brand: 'Honda',
    logo: '/brands/honda.png',
    models: ['Civic', 'Accord', 'Fit', 'CR-V', 'HR-V', 'Pilot', 'Odyssey'],
  },
  {
    brand: 'Hyundai',
    logo: '/brands/hyundai.png',
    models: ['Elantra', 'Sonata', 'Santa Fe', 'Tucson', 'Accent', 'Kona'],
  },
  {
    brand: 'Kia',
    logo: '/brands/kia.png',
    models: ['Optima', 'Sorento', 'Sportage', 'Rio', 'Cerato', 'Soul'],
  },
  {
    brand: 'Lexus',
    logo: '/brands/lexus.png',
    models: ['RX350', 'GX460', 'ES350', 'IS250', 'NX300', 'LX570'],
  },
  {
    brand: 'Ford',
    logo: '/brands/ford.png',
    models: ['Fusion', 'Escape', 'Focus', 'Mustang', 'Explorer', 'Transit'],
  },
  {
    brand: 'Nissan',
    logo: '/brands/nissan.png',
    models: ['Altima', 'Sentra', 'Maxima', 'Rogue', 'X-Trail', 'Leaf'],
  },
  {
    brand: 'Chevrolet',
    logo: '/brands/chevrolet.png',
    models: ['Malibu', 'Cruze', 'Camaro', 'Tahoe', 'Equinox', 'Spark'],
  },
  {
    brand: 'Audi',
    logo: '/brands/audi.png',
    models: ['A3', 'A4', 'A6', 'Q5', 'Q7', 'RS5', 'TT'],
  },
  {
    brand: 'Volkswagen',
    logo: '/brands/volkswagen.png',
    models: ['Golf', 'Passat', 'Tiguan', 'Polo', 'Jetta', 'GTI'],
  },
  {
    brand: 'Porsche',
    logo: '/brands/porsche.png',
    models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan', 'Boxster'],
  },
  {
    brand: 'Tesla',
    logo: '/brands/tesla.png',
    models: ['Model 3', 'Model S', 'Model X', 'Model Y'],
  },
  {
    brand: 'Subaru',
    logo: '/brands/subaru.png',
    models: ['Impreza', 'Legacy', 'Outback', 'Forester', 'XV', 'WRX'],
  },
  {
    brand: 'Jeep',
    logo: '/brands/jeep.png',
    models: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade'],
  },
]

/** Full brand list with logical models; merged with detailed brands above. */
const additionalBrands: Record<string, string[]> = {
  'Alfa Romeo': ['Giulia', 'Giulietta', 'Stelvio', '159', '156', '147', 'MiTo', 'Tonale', 'Brera'],
  Cadillac: ['Escalade', 'CTS', 'ATS', 'SRX', 'XT5', 'XT6', 'CT6', 'XTS', 'DeVille'],
  Chrysler: ['300C', '300', 'Pacifica', 'Town & Country', 'Sebring', 'PT Cruiser', 'Voyager'],
  Citroen: ['C1', 'C3', 'C4', 'C5', 'Berlingo', 'DS3', 'Xsara', 'Picasso', 'C-Elysee'],
  Daewoo: ['Nexia', 'Matiz', 'Lanos', 'Espero', 'Nubira', 'Leganza', 'Gentra'],
  Daihatsu: ['Terios', 'Sirion', 'Materia', 'Cuore', 'Charade', 'Rocky', 'Mira'],
  Dodge: ['Charger', 'Challenger', 'Ram', 'Durango', 'Journey', 'Caliber', 'Nitro', 'Avenger'],
  Fiat: ['500', 'Punto', 'Panda', 'Tipo', 'Doblo', 'Bravo', 'Linea', '500X', '500L'],
  GMC: ['Sierra', 'Yukon', 'Acadia', 'Terrain', 'Canyon', 'Savana', 'Envoy'],
  Hummer: ['H1', 'H2', 'H3'],
  Isuzu: ['D-Max', 'Trooper', 'Rodeo', 'MU-X', 'Ascender', 'VehiCROSS'],
  Jaguar: ['XF', 'XE', 'XJ', 'F-Pace', 'E-Pace', 'F-Type', 'S-Type', 'X-Type', 'I-Pace'],
  Lancia: ['Ypsilon', 'Delta', 'Musa', 'Thesis', 'Lybra', 'Phedra'],
  'Land Rover': [
    'Range Rover',
    'Range Rover Sport',
    'Range Rover Evoque',
    'Range Rover Velar',
    'Discovery',
    'Discovery Sport',
    'Defender',
    'Freelander',
  ],
  Mazda: ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'CX-30', 'MX-5', 'RX-8'],
  Mercury: ['Grand Marquis', 'Milan', 'Mariner', 'Sable', 'Mountaineer', 'Cougar'],
  Mini: ['Cooper', 'Countryman', 'Clubman', 'Paceman', 'Coupe', 'Cabrio'],
  Mitsubishi: [
    'Outlander',
    'Lancer',
    'Pajero',
    'ASX',
    'Montero',
    'Eclipse',
    'Colt',
    'L200',
    'Galant',
  ],
  Opel: ['Astra', 'Corsa', 'Insignia', 'Zafira', 'Vectra', 'Meriva', 'Mokka', 'Vivaro'],
  Peugeot: ['208', '308', '508', '2008', '3008', '5008', '206', '207', '407', 'Partner'],
  Renault: ['Megane', 'Clio', 'Logan', 'Duster', 'Captur', 'Laguna', 'Scenic', 'Kadjar', 'Sandero'],
  Rover: ['75', '45', '25', '200', '400', '600', 'Streetwise'],
  Saab: ['9-3', '9-5', '900', '9000', '9-2X', '9-7X'],
  Seat: ['Leon', 'Ibiza', 'Ateca', 'Alhambra', 'Cordoba', 'Toledo', 'Arona', 'Tarraco'],
  Skoda: ['Octavia', 'Fabia', 'Superb', 'Rapid', 'Kodiaq', 'Yeti', 'Karoq', 'Roomster', 'Scala'],
  Suzuki: ['Swift', 'Vitara', 'Grand Vitara', 'SX4', 'Jimny', 'Baleno', 'Alto', 'Ignis'],
  Volvo: ['XC90', 'XC60', 'XC40', 'S60', 'S80', 'S90', 'V70', 'V40', 'C30'],
  VAZ: ['2101', '2106', '2107', '2109', '2110', '2114', '2115', 'Niva', 'Priora', 'Kalina', 'Granta'],
  GAZ: ['Volga', '3110', '31105', '3102', 'Gazelle', 'Sobol'],
  Moskvich: ['412', '2140', '2141', 'Aleko', '3'],
  Infiniti: ['Q50', 'Q70', 'QX50', 'QX60', 'QX70', 'QX80', 'FX35', 'FX45', 'G35', 'G37', 'M37'],
  Pontiac: ['Firebird', 'GTO', 'Grand Am', 'Grand Prix', 'Vibe', 'G6', 'Trans Am', 'Bonneville'],
  Scion: ['tC', 'xB', 'xD', 'iQ', 'FR-S'],
  Oldsmobile: ['Alero', 'Cutlass', 'Aurora', 'Intrigue', 'Bravada', '88'],
  Lincoln: ['Navigator', 'MKZ', 'MKX', 'Town Car', 'Continental', 'MKC', 'MKS', 'Aviator'],
  Iveco: ['Daily', 'Eurocargo', 'Stralis', 'Trakker', 'Massif'],
  Ssangyong: ['Rexton', 'Actyon', 'Kyron', 'Korando', 'Musso', 'Tivoli', 'Rodius'],
  Buick: ['Enclave', 'Encore', 'LaCrosse', 'Regal', 'Verano', 'Lucerne', 'Century'],
  Acura: ['MDX', 'RDX', 'TL', 'TLX', 'TSX', 'RSX', 'ILX', 'ZDX', 'Integra'],
  Lamborghini: ['Aventador', 'Huracan', 'Gallardo', 'Urus', 'Murcielago', 'Diablo'],
  Ferrari: ['488', '458', 'F430', 'California', 'Portofino', '812', '599', 'F8', 'Roma'],
  Maserati: ['Ghibli', 'Quattroporte', 'Levante', 'GranTurismo', 'Grecale'],
  'Aston Martin': ['DB9', 'DB11', 'Vantage', 'Rapide', 'DBS', 'Vanquish', 'DBX'],
  Saleen: ['S7', 'S1', 'Mustang'],
  Bentley: ['Continental', 'Bentayga', 'Flying Spur', 'Mulsanne', 'Arnage'],
  'Rolls-Royce': ['Phantom', 'Ghost', 'Wraith', 'Cullinan', 'Dawn', 'Silver Shadow'],
  Maybach: ['57', '62', 'S-Class', '6'],
  Chery: ['Tiggo', 'Tiggo 7', 'Tiggo 8', 'Arrizo', 'QQ', 'Amulet', 'Fora'],
  JAC: ['S3', 'S5', 'J5', 'T6', 'iEV', 'Refine'],
  BYD: ['Han', 'Tang', 'Song', 'Qin', 'Yuan', 'Atto 3', 'Seal', 'Dolphin', 'F3'],
  Roewe: ['550', '350', '750', 'RX5', 'i5', 'RX3'],
  Geely: ['Emgrand', 'Coolray', 'Atlas', 'Tugella', 'Monjaro', 'MK', 'Okavango'],
  Changfeng: ['Liebao', 'Feiteng', 'Cheetah'],
  Tata: ['Nano', 'Indica', 'Indigo', 'Safari', 'Nexon', 'Harrier', 'Tiago'],
  Saturn: ['Ion', 'Vue', 'Aura', 'Outlook', 'Sky', 'L-Series'],
  UAZ: ['Patriot', 'Hunter', '469', 'Buhanka', 'Pickup'],
  ZAZ: ['Sens', 'Lanos', 'Chance', 'Vida', '968', 'Tavria'],
  Hafei: ['Simbo', 'Lobo', 'Princip', 'Brio'],
  'Great Wall': ['Hover', 'Wingle', 'Safe', 'Deer', 'Poer', 'Voleex'],
  Foton: ['Tunland', 'Sauvana', 'View', 'Aumark'],
  Dongfeng: ['AX7', 'S30', 'H30', '580', 'Rich', 'Fengon'],
  Xingtai: ['254', '304', '404', '454'],
  Karsan: ['Jest', 'Atak', 'Star', 'e-Jest'],
  Changan: ['CS35', 'CS55', 'CS75', 'Eado', 'Alsvin', 'UNI-T', 'UNI-K'],
  Lifan: ['X60', 'X50', 'Solano', 'Smily', '620', '320'],
  MG: ['MG3', 'MG5', 'MG6', 'ZS', 'HS', 'GS', 'Marvel R', 'MG4'],
  Hyster: ['H2.0', 'H2.5', 'H3.0', 'H5.0'],
  Haval: ['H6', 'H2', 'H9', 'F7', 'Jolion', 'Dargo', 'H5'],
  Niewiadow: ['N126', 'N133', 'Bocian'],
  Fisker: ['Karma', 'Ocean', 'EMotion'],
  Brilliance: ['V5', 'H530', 'H230', 'V3', 'FRV', 'FSV'],
  CPI: ['Aragon', 'Oliver', 'Popcorn', 'SM'],
  'DM Telai': ['Standard', 'Custom'],
  Lotus: ['Elise', 'Exige', 'Evora', 'Emira', 'Esprit', 'Eletre'],
  FAW: ['Besturn', 'V2', 'V5', 'Oley', 'Vita', 'Junpai'],
  Bugatti: ['Veyron', 'Chiron', 'Divo', 'Bolide', 'Mistral'],
  Zxauto: ['Grand Tiger', 'Landmark', 'Admiral', 'Terralord'],
  LTI: ['TX1', 'TX2', 'TX4'],
  YTO: ['X904', 'MF504', 'LX904'],
  Soueast: ['DX7', 'DX3', 'V3', 'V5', 'A5'],
  Baic: ['X25', 'X35', 'X55', 'BJ40', 'BJ80', 'EU5', 'Senova'],
  Lonking: ['CDM833', 'CDM856', 'LG833'],
  McLaren: ['720S', '570S', '650S', 'P1', 'Artura', 'GT', '765LT'],
  Proton: ['Saga', 'Persona', 'Wira', 'Gen-2', 'Preve', 'Exora', 'X70'],
  'Iran Khodro': ['Samand', 'Dena', 'Pars', 'Runna', 'Soren'],
  Smart: ['Fortwo', 'Forfour', 'Roadster', '#1', '#3'],
  AMC: ['Eagle', 'Gremlin', 'Javelin', 'Pacer', 'Hornet'],
  Dacia: ['Duster', 'Logan', 'Sandero', 'Lodgy', 'Dokker', 'Spring', 'Jogger'],
  Arcfox: ['Alpha-S', 'Alpha-T', 'Alpha-S5'],
  Zeekr: ['001', '009', 'X', '007'],
  Voyah: ['Free', 'Dream', 'Passion', 'Courage'],
  Hongqi: ['H5', 'H7', 'H9', 'HS5', 'HS7', 'E-HS9'],
  Huawei: ['Aito M5', 'Aito M7', 'Luxeed S7'],
  Lixiang: ['L7', 'L8', 'L9', 'One', 'Mega'],
  Xpeng: ['P7', 'P5', 'G3', 'G9', 'G6', 'X9'],
  Datsun: ['on-DO', 'mi-DO', 'GO', 'redi-GO'],
  'Saic Motor': ['MG', 'Roewe', 'Maxus'],
  Zukida: ['Standard', 'Custom'],
  Mitsuoka: ['Orochi', 'Viewt', 'Himiko', 'Roadster', 'Galue'],
  Genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80', 'GV60'],
  "Yuanxin Energy's": ['Standard', 'Custom'],
  Euler: ['Good Cat', 'Ballet Cat', 'Lightning Cat'],
  NIO: ['ES6', 'ES8', 'ET7', 'ET5', 'EC6', 'ES7'],
  Linde: ['H20', 'H25', 'H30', 'E20'],
  'Shade Xtreme': ['Standard', 'Custom'],
  Jetour: ['X70', 'X90', 'Dashing', 'T2', 'X95'],
  Hiphi: ['X', 'Z', 'Y'],
  Aion: ['S', 'Y', 'V', 'LX'],
  'DS Automobiles': ['DS3', 'DS4', 'DS5', 'DS7', 'DS9'],
  'Renault Samsung': ['SM3', 'SM5', 'SM6', 'SM7', 'QM6', 'QM3'],
  Neta: ['V', 'U', 'S', 'GT'],
  Exeed: ['TXL', 'VX', 'LX', 'RX'],
  Skywell: ['ET5', 'ET7'],
  'Huawei Inside': ['Aito M5', 'Aito M7', 'Avatr 11'],
  Avatr: ['11', '12'],
  Polestar: ['1', '2', '3', '4'],
  Dayun: ['Yuehu', 'Yuanhu'],
  Xiaomi: ['SU7', 'SU7 Ultra', 'YU7'],
  Izh: ['2126 Oda', '2717', 'Combi', 'Planeta'],
  'Lynk & Co': ['01', '02', '03', '05', '06', '09'],
  Gonow: ['Troy', 'GA200', 'Way'],
  Sena: ['Standard', 'Custom'],
  Forthing: ['T5', 'Yacht', 'Friday', 'U-Tour'],
  'IM Motors': ['L7', 'LS7', 'LS6'],
  AIQAR: ['Standard', 'Custom'],
  Vauxhall: ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Vectra', 'Zafira', 'Grandland'],
  Rivian: ['R1T', 'R1S', 'EDV', 'R2', 'R3'],
  MPM: ['PS160', 'Errante'],
  OMODA: ['C5', 'C3', '5', '7'],
  Mahindra: ['Scorpio', 'XUV500', 'XUV700', 'Thar', 'Bolero', 'KUV100', 'Marazzo'],
  Leapmotor: ['T03', 'C11', 'C01', 'C10'],
  Aito: ['M5', 'M7', 'M9'],
  Wuling: ['Hongguang', 'Mini EV', 'Almaz', 'Bingo', 'Victory'],
  Maxus: ['T60', 'D90', 'G10', 'Euniq', 'Deliver 9'],
  GWM: ['Wingle', 'Poer', 'Tank', 'Ora'],
  Wey: ['VV5', 'VV6', 'VV7', 'Coffee 01', 'Tank 300'],
  Baojun: ['510', '530', '310', 'E100', 'RS-5'],
  Baw: ['BJ212', 'Warrior', '007'],
  Sunbeam: ['Tiger', 'Alpine', 'Rapier'],
  Bertone: ['Freeclimber', 'X1/9'],
  Lucid: ['Air', 'Gravity'],
  GAC: ['GS3', 'GS4', 'GS8', 'GA6', 'Aion S', 'Emkoo', 'Trumpchi'],
  Vanderhall: ['Venice', 'Carmel', 'Navarro', 'Edison'],
  Hycan: ['007', 'Z03', 'A06'],
  Cupra: ['Leon', 'Formentor', 'Ateca', 'Born', 'Tavascan'],
  Bestune: ['T77', 'T99', 'B70', 'T55', 'NAT'],
  Kandi: ['K27', 'K23', 'EX3'],
  VinFast: ['VF3', 'VF5', 'VF6', 'VF7', 'VF8', 'VF9', 'Lux A2.0', 'Lux SA2.0'],
  Denza: ['D9', 'N7', 'N8', 'Z9'],
}

/** Build a logo slug matching the downloaded file names in /public/brands. */
export function brandLogoSlug(brand: string): string {
  return brand
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/'/g, '')
    .replace(/\s+/g, '-')
}

export const carBrands: CarBrandEntry[] = [
  ...detailedBrands,
  ...Object.entries(additionalBrands).map(([brand, models]) => ({
    brand,
    logo: `/brands/${brandLogoSlug(brand)}.png`,
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
