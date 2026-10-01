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
    models: ['4Runner', 'Allion', 'Alphard', 'Aqua', 'Auris', 'Avalon', 'Avensis', 'Aygo', 'bZ4X', 'C-HR', 'Camry', 'Celica', 'Corolla', 'Corolla Axio', 'Corolla Cross', 'Corolla Fielder', 'Corolla Rumion', 'Crown', 'Dyna', 'Echo', 'Estima', 'FJ Cruiser', 'Fortuner', 'Harrier', 'Hiace', 'Highlander', 'Hilux', 'Ipsum', 'IQ', 'Isis', 'Land Cruiser', 'Land Cruiser Prado', 'LiteAce', 'Mark X', 'Matrix', 'MR2', 'Noah', 'Passo', 'Picnic', 'Porte', 'Premio', 'Prius', 'Prius C', 'Prius Prime', 'Prius V', 'Proace', 'Probox', 'Raize', 'RAV4', 'Roomy', 'Rush', 'Sequoia', 'Sienna', 'Sienta', 'Solara', 'Spade', 'Succeed', 'Supra', 'Tacoma', 'Tank', 'TownAce', 'Tundra', 'Urban Cruiser', 'Vellfire', 'Verso', 'Vitz', 'Voxy', 'Wish', 'Yaris', 'Yaris Cross'],
  },
  {
    brand: 'Mercedes-Benz',
    logo: '/brands/mercedes-benz.png',
    models: ['190', 'A-Class', 'AMG GT', 'B-Class', 'C-Class', 'C200', 'C220', 'C250', 'C300', 'C350', 'Citan', 'CL', 'CLA', 'CLK', 'CLS', 'E-Class', 'E200', 'E220', 'E250', 'E300', 'E350', 'E400', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'EQV', 'G-Class', 'G55', 'G63', 'G350', 'G500', 'GL', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'Maybach S-Class', 'Metris', 'ML', 'R-Class', 'S-Class', 'S350', 'S400', 'S500', 'S550', 'S600', 'SL', 'SLC', 'SLK', 'Sprinter', 'V-Class', 'Viano', 'Vito', 'W124', 'W210', 'X-Class'],
  },
  {
    brand: 'BMW',
    logo: '/brands/bmw.png',
    models: ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', '116', '118', '120', '125', '128', '130', '135', '218', '220', '225', '228', '230', '316', '318', '320', '323', '325', '328', '330', '335', '340', '420', '428', '430', '435', '440', '520', '523', '525', '528', '530', '535', '540', '545', '550', '630', '640', '650', '730', '740', '745', '750', '760', 'ActiveHybrid 3', 'ActiveHybrid 5', 'ActiveHybrid 7', 'i3', 'i4', 'i5', 'i7', 'iX', 'iX1', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M6', 'M135i', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z3', 'Z4'],
  },
  {
    brand: 'Honda',
    logo: '/brands/honda.png',
    models: ['Accord', 'BR-V', 'Brio', 'City', 'Civic', 'CR-V', 'CR-Z', 'Crosstour', 'CRX', 'e', 'Element', 'Elevate', 'Fit', 'FR-V', 'Freed', 'Grace', 'HR-V', 'Insight', 'Integra', 'Jazz', 'Legend', 'Mobilio', 'N-BOX', 'N-ONE', 'N-WGN', 'NSX', 'Odyssey', 'Passport', 'Pilot', 'Prelude', 'Ridgeline', 'S2000', 'Shuttle', 'Stepwgn', 'Stream', 'Vezel', 'WR-V', 'ZR-V'],
  },
  {
    brand: 'Hyundai',
    logo: '/brands/hyundai.png',
    models: ['Accent', 'Alcazar', 'Atos', 'Azera', 'Bayon', 'Coupe', 'Creta', 'Elantra', 'Elantra N', 'Equus', 'Galloper', 'Genesis', 'Getz', 'Grandeur', 'H-1', 'i10', 'i20', 'i30', 'i30 N', 'i40', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix35', 'ix55', 'Kona', 'Kona Electric', 'Matrix', 'Nexo', 'Palisade', 'Porter', 'Santa Cruz', 'Santa Fe', 'Santa Fe Sport', 'Sonata', 'Starex', 'Staria', 'Terracan', 'Tiburon', 'Trajet', 'Tucson', 'Veloster', 'Venue', 'Veracruz'],
  },
  {
    brand: 'Kia',
    logo: '/brands/kia.png',
    models: ['Borrego', 'Cadenza', 'Carens', 'Carnival', 'Ceed', 'Cerato', 'EV6', 'EV9', 'K5', 'K7', 'K8', 'K9', 'Magentis', 'Mohave', 'Morning', 'Niro', 'Niro EV', 'Optima', 'Picanto', 'Pride', 'Proceed', 'Ray', 'Rio', 'Rondo', 'Sedona', 'Seltos', 'Sephia', 'Sorento', 'Sorento Hybrid', 'Soul', 'Soul EV', 'Spectra', 'Sportage', 'Sportage Hybrid', 'Stinger', 'Stonic', 'Telluride', 'Venga', 'XCeed'],
  },
  {
    brand: 'Lexus',
    logo: '/brands/lexus.png',
    models: ['CT200h', 'ES250', 'ES300', 'ES300h', 'ES350', 'GS-F', 'GS300', 'GS350', 'GS450h', 'GX460', 'GX550', 'IS-F', 'IS200', 'IS250', 'IS300', 'IS350', 'IS500', 'LC500', 'LC500h', 'LFA', 'LS400', 'LS430', 'LS460', 'LS500', 'LS600h', 'LX470', 'LX570', 'LX600', 'NX200', 'NX200t', 'NX300', 'NX300h', 'NX350', 'NX450h', 'RC-F', 'RC200t', 'RC300', 'RC350', 'RX270', 'RX300', 'RX330', 'RX350', 'RX400h', 'RX450h', 'RX500h', 'RZ450e', 'TX350', 'TX500h', 'UX200', 'UX250h', 'UX300h'],
  },
  {
    brand: 'Ford',
    logo: '/brands/ford.png',
    models: ['B-Max', 'Bronco', 'Bronco Sport', 'C-Max', 'Connect', 'Courier', 'Crown Victoria', 'Custom', 'EcoSport', 'Edge', 'Escape', 'Escort', 'Everest', 'Expedition', 'Explorer', 'F-150', 'F-250', 'Fiesta', 'Five Hundred', 'Flex', 'Focus', 'Freestyle', 'Fusion', 'Galaxy', 'GT', 'KA', 'Ka+', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Mustang Mach-E', 'Probe', 'Puma', 'Ranger', 'S-Max', 'Sierra', 'Taurus', 'Territory', 'Thunderbird', 'Tourneo', 'Transit'],
  },
  {
    brand: 'Nissan',
    logo: '/brands/nissan.png',
    models: ['350Z', '370Z', 'Almera', 'Altima', 'Ariya', 'Armada', 'Bluebird', 'Cefiro', 'Cima', 'Cube', 'Elgrand', 'Fairlady', 'Frontier', 'Fuga', 'GT-R', 'Juke', 'Kicks', 'Laurel', 'Leaf', 'Livina', 'March', 'Maxima', 'Micra', 'Murano', 'Navara', 'Note', 'NV200', 'NV350', 'Pathfinder', 'Patrol', 'Primera', 'Qashqai', 'Quest', 'Rogue', 'Safari', 'Sentra', 'Serena', 'Skyline', 'Sunny', 'Teana', 'Terrano', 'Tiida', 'Titan', 'Versa', 'X-Trail', 'Xterra'],
  },
  {
    brand: 'Chevrolet',
    logo: '/brands/chevrolet.png',
    models: ['Astro', 'Avalanche', 'Aveo', 'Blazer', 'Bolt', 'Bolt EUV', 'Camaro', 'Captiva', 'Cobalt', 'Colorado', 'Corvette', 'Cruze', 'Epica', 'Equinox', 'Evanda', 'Express', 'HHR', 'Impala', 'Lacetti', 'Malibu', 'Matiz', 'Montana', 'Niva', 'Onix', 'Orlando', 'Prisma', 'S10', 'Silverado', 'Sonic', 'Spark', 'Spin', 'SSR', 'Suburban', 'Tahoe', 'Tracker', 'Trailblazer', 'Traverse', 'Trax', 'Uplander', 'Venture', 'Volt'],
  },
  {
    brand: 'Audi',
    logo: '/brands/audi.png',
    models: ['80', '90', '100', '200', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Allroad', 'Cabriolet', 'e-tron', 'e-tron GT', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'R8', 'RS Q3', 'RS Q8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'SQ8', 'TT', 'V8'],
  },
  {
    brand: 'Volkswagen',
    logo: '/brands/volkswagen.png',
    models: ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'Caravelle', 'CC', 'Eos', 'Fox', 'Golf', 'Golf GTI', 'Golf Plus', 'Golf R', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'ID.Buzz', 'Jetta', 'Lupo', 'Multivan', 'New Beetle', 'Passat', 'Passat CC', 'Phaeton', 'Polo', 'Santana', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Taigo', 'Tiguan', 'Tiguan Allspace', 'Touareg', 'Touran', 'Transporter', 'Up', 'Vento'],
  },
  {
    brand: 'Porsche',
    logo: '/brands/porsche.png',
    models: ['718 Boxster', '718 Cayman', '911', '911 Carrera', '911 GT3', '911 Turbo', '918 Spyder', '924', '928', '944', '968', 'Boxster', 'Carrera GT', 'Cayenne', 'Cayenne Coupe', 'Cayman', 'Macan', 'Panamera', 'Taycan'],
  },
  {
    brand: 'Tesla',
    logo: '/brands/tesla.png',
    models: ['Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster', 'Semi'],
  },
  {
    brand: 'Subaru',
    logo: '/brands/subaru.png',
    models: ['Ascent', 'Baja', 'BRZ', 'Crosstrek', 'Exiga', 'Forester', 'Impreza', 'Justy', 'Legacy', 'Leone', 'Levorg', 'Outback', 'Solterra', 'SVX', 'Trezia', 'Tribeca', 'WRX', 'WRX STI', 'XV'],
  },
  {
    brand: 'Jeep',
    logo: '/brands/jeep.png',
    models: ['Avenger', 'Cherokee', 'CJ', 'Commander', 'Compass', 'Gladiator', 'Grand Cherokee', 'Grand Wagoneer', 'Liberty', 'Patriot', 'Renegade', 'Wagoneer', 'Willys', 'Wrangler'],
  },
]

/** Full brand list with logical models; merged with detailed brands above. */
const additionalBrands: Record<string, string[]> = {
  'Alfa Romeo': ['4C', '8C', '33', '75', '147', '155', '156', '159', '166', 'Brera', 'Giulia', 'Giulietta', 'GT', 'GTV', 'MiTo', 'Montreal', 'Spider', 'Stelvio', 'SZ', 'Tonale'],
  Cadillac: ['ATS', 'ATS-V', 'BLS', 'Celestiq', 'CT4', 'CT5', 'CT6', 'CTS', 'CTS-V', 'DeVille', 'Eldorado', 'ELR', 'Escalade', 'Escalade ESV', 'Lyriq', 'Seville', 'SRX', 'XT4', 'XT5', 'XT6', 'XTS'],
  Chrysler: ['200', '300', '300C', 'Aspen', 'Concorde', 'Crossfire', 'Grand Voyager', 'Imperial', 'LHS', 'Neon', 'Pacifica', 'PT Cruiser', 'Sebring', 'Town & Country', 'Voyager'],
  Citroen: ['Ami', 'Berlingo', 'C-Elysee', 'C1', 'C2', 'C3', 'C3 Aircross', 'C3 Picasso', 'C4', 'C4 Cactus', 'C4 Picasso', 'C4 SpaceTourer', 'C5', 'C5 Aircross', 'C5 X', 'C6', 'C8', 'DS3', 'e-C4', 'Jumper', 'Jumpy', 'Picasso', 'Saxo', 'XM', 'Xsara', 'ZX'],
  Daewoo: ['Damas', 'Espero', 'Evanda', 'Gentra', 'Kalos', 'Labo', 'Lanos', 'Leganza', 'Magnus', 'Matiz', 'Nexia', 'Nubira', 'Prince', 'Racer', 'Rezzo', 'Tacuma', 'Tico', 'Winstorm'],
  Daihatsu: ['Atrai', 'Boon', 'Cast', 'Charade', 'Copen', 'Cuore', 'Esse', 'Feroza', 'Hijet', 'Materia', 'Mira', 'Move', 'Naked', 'Opti', 'Rocky', 'Sirion', 'Tanto', 'Terios', 'Wake', 'YRV'],
  Dodge: ['Avenger', 'Caliber', 'Caravan', 'Challenger', 'Charger', 'Dakota', 'Dart', 'Durango', 'Grand Caravan', 'Hornet', 'Intrepid', 'Journey', 'Magnum', 'Neon', 'Nitro', 'Ram', 'Ram 1500', 'Ram 2500', 'Stratus', 'Viper'],
  Fiat: ['500', '500C', '500e', '500L', '500X', 'Albea', 'Barchetta', 'Bravo', 'Croma', 'Doblo', 'Ducato', 'Fiorino', 'Freemont', 'Fullback', 'Grande Punto', 'Linea', 'Multipla', 'Palio', 'Panda', 'Panda Cross', 'Punto', 'Qubo', 'Scudo', 'Sedici', 'Siena', 'Stilo', 'Tipo', 'Uno'],
  GMC: ['Acadia', 'Canyon', 'Denali', 'Envoy', 'Hummer EV', 'Jimmy', 'Safari', 'Savana', 'Sierra', 'Sierra HD', 'Sonoma', 'Terrain', 'Typhoon', 'Yukon', 'Yukon XL'],
  Hummer: ['EV Pickup', 'EV SUV', 'H1', 'H2', 'H3', 'H3T'],
  Isuzu: ['Amigo', 'Ascender', 'Axiom', 'Bighorn', 'D-Max', 'Fargo', 'Impulse', 'MU-X', 'NPR', 'NQR', 'Rodeo', 'Stylus', 'Trooper', 'VehiCROSS', 'Wizard'],
  Jaguar: ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'S-Type', 'X-Type', 'XE', 'XF', 'XF Sportbrake', 'XJ', 'XJ6', 'XJ8', 'XJ12', 'XJS', 'XK', 'XKR'],
  Lancia: ['Beta', 'Dedra', 'Delta', 'Fulvia', 'Kappa', 'Lybra', 'Musa', 'Phedra', 'Prisma', 'Stratos', 'Thema', 'Thesis', 'Ypsilon'],
  'Land Rover': ['Defender', 'Defender 90', 'Defender 110', 'Discovery', 'Discovery Sport', 'Freelander', 'Freelander 2', 'LR2', 'LR3', 'LR4', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar', 'Series III'],
  Mazda: ['Atenza', 'Axela', 'Bongo', 'BT-50', 'Carol', 'CX-3', 'CX-5', 'CX-7', 'CX-8', 'CX-9', 'CX-30', 'CX-50', 'CX-60', 'CX-90', 'Demio', 'Mazda2', 'Mazda3', 'Mazda5', 'Mazda6', 'MPV', 'MX-5', 'MX-30', 'Premacy', 'RX-7', 'RX-8', 'Tribute', 'Verisa'],
  Mercury: ['Cougar', 'Grand Marquis', 'Mariner', 'Milan', 'Montego', 'Mountaineer', 'Mystique', 'Sable', 'Tracer', 'Villager'],
  Mini: ['Aceman', 'Cabrio', 'Clubman', 'Cooper', 'Cooper S', 'Cooper SE', 'Countryman', 'Coupe', 'John Cooper Works', 'Paceman', 'Roadster'],
  Mitsubishi: ['3000GT', 'ASX', 'Attrage', 'Colt', 'Delica', 'Diamante', 'Eclipse', 'Eclipse Cross', 'Endeavor', 'Galant', 'Grandis', 'i-MiEV', 'L200', 'Lancer', 'Lancer Evolution', 'Mirage', 'Montero', 'Outlander', 'Outlander Sport', 'Pajero', 'Pajero Sport', 'Raider', 'RVR', 'Space Star', 'Space Wagon', 'Triton', 'Xpander'],
  Opel: ['Adam', 'Agila', 'Ampera', 'Antara', 'Astra', 'Calibra', 'Cascada', 'Combo', 'Corsa', 'Crossland', 'Frontera', 'Grandland', 'Insignia', 'Karl', 'Meriva', 'Mokka', 'Mokka X', 'Movano', 'Omega', 'Sintra', 'Speedster', 'Tigra', 'Vectra', 'Vivaro', 'Zafira', 'Zafira Tourer'],
  Peugeot: ['108', '206', '207', '208', '301', '308', '407', '408', '508', '607', '806', '807', '2008', '3008', '4008', '5008', 'Boxer', 'e-208', 'e-308', 'e-2008', 'e-3008', 'Expert', 'iOn', 'Partner', 'RCZ', 'Rifter', 'Traveller'],
  Renault: ['Alaskan', 'Arkana', 'Austral', 'Avantime', 'Captur', 'Clio', 'Duster', 'Espace', 'Fluence', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Latitude', 'Logan', 'Master', 'Megane', 'Modus', 'Rafale', 'Safrane', 'Sandero', 'Scenic', 'Symbol', 'Talisman', 'Trafic', 'Twingo', 'Vel Satis', 'Wind', 'Zoe'],
  Rover: ['25', '45', '75', '200', '400', '600', '800', 'Metro', 'Mini', 'SD1', 'Streetwise'],
  Saab: ['9-2X', '9-3', '9-5', '9-7X', '93', '96', '99', '900', '9000'],
  Seat: ['Alhambra', 'Altea', 'Arona', 'Arosa', 'Ateca', 'Cordoba', 'Cupra Born', 'Exeo', 'Ibiza', 'Inca', 'Leon', 'Mii', 'Tarraco', 'Toledo'],
  Skoda: ['Citigo', 'Enyaq', 'Fabia', 'Favorit', 'Felicia', 'Forman', 'Kamiq', 'Karoq', 'Kodiaq', 'Kushaq', 'Octavia', 'Praktik', 'Rapid', 'Roomster', 'Scala', 'Slavia', 'Superb', 'Yeti'],
  Suzuki: ['Alto', 'Baleno', 'Brezza', 'Carry', 'Celerio', 'Dzire', 'Equator', 'Ertiga', 'Every', 'Forenza', 'Fronx', 'Grand Vitara', 'Hustler', 'Ignis', 'Jimny', 'Kizashi', 'Liana', 'Reno', 'Samurai', 'Sidekick', 'Solio', 'Spacia', 'Splash', 'Swift', 'SX4', 'SX4 S-Cross', 'Vitara', 'Wagon R', 'XL7'],
  Volvo: ['240', '740', '760', '850', '940', '960', 'C30', 'C40', 'C70', 'EM90', 'EX30', 'EX90', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90'],
  VAZ: ['2101', '2102', '2103', '2104', '2105', '2106', '2107', '2108', '2109', '2110', '2111', '2112', '2113', '2114', '2115', '21099', 'Granta', 'Kalina', 'Largus', 'Niva', 'Niva Travel', 'Oka', 'Priora', 'Samara', 'Vesta', 'XRAY'],
  GAZ: ['21', '24', '3102', '3110', '31029', '31105', 'Gazelle', 'Gazelle Business', 'Gazelle Next', 'Sadko', 'Sobol', 'Sobol Next', 'Valdai', 'Volga'],
  Moskvich: ['3', '6', '400', '401', '402', '403', '407', '408', '412', '2140', '2141', 'Aleko', 'Svjatogor'],
  Infiniti: ['EX35', 'EX37', 'FX35', 'FX37', 'FX45', 'FX50', 'G25', 'G35', 'G37', 'I30', 'I35', 'JX35', 'M35', 'M37', 'M45', 'M56', 'Q45', 'Q50', 'Q70', 'QX30', 'QX50', 'QX55', 'QX60', 'QX70', 'QX80'],
  Pontiac: ['Aztek', 'Bonneville', 'Fiero', 'Firebird', 'G6', 'G8', 'Grand Am', 'Grand Prix', 'GTO', 'Montana', 'Solstice', 'Sunbird', 'Sunfire', 'Torrent', 'Trans Am', 'Vibe'],
  Scion: ['FR-S', 'iA', 'iM', 'iQ', 'tC', 'xA', 'xB', 'xD'],
  Oldsmobile: ['88', '98', 'Achieva', 'Alero', 'Aurora', 'Bravada', 'Cutlass', 'Intrigue', 'Silhouette', 'Toronado'],
  Lincoln: ['Aviator', 'Blackwood', 'Continental', 'Corsair', 'LS', 'MKC', 'MKS', 'MKT', 'MKX', 'MKZ', 'Nautilus', 'Navigator', 'Town Car', 'Zephyr'],
  Iveco: ['Daily', 'Eurocargo', 'EuroStar', 'Massif', 'S-Way', 'Stralis', 'Trakker'],
  Ssangyong: ['Actyon', 'Actyon Sports', 'Chairman', 'Korando', 'Kyron', 'Musso', 'Rexton', 'Rodius', 'Stavic', 'Tivoli', 'Torres', 'XLV'],
  Buick: ['Cascada', 'Century', 'Electra', 'Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse', 'LeSabre', 'Lucerne', 'Park Avenue', 'Rainier', 'Regal', 'Rendezvous', 'Riviera', 'Verano'],
  Acura: ['ADX', 'CDX', 'CL', 'ILX', 'Integra', 'MDX', 'NSX', 'Precision', 'RDX', 'RL', 'RLX', 'RSX', 'TL', 'TLX', 'TSX', 'ZDX'],
  Lamborghini: ['Aventador', 'Centenario', 'Countach', 'Diablo', 'Espada', 'Gallardo', 'Huracan', 'Jalpa', 'Murcielago', 'Revuelto', 'Sián', 'Temerario', 'Urus', 'Veneno'],
  Ferrari: ['12Cilindri', '296', '360', '458', '488', '550', '575', '599', '812', 'California', 'Enzo', 'F8', 'F12', 'F430', 'FF', 'GTC4Lusso', 'LaFerrari', 'Mondial', 'Portofino', 'Roma', 'SF90', 'Testarossa'],
  Maserati: ['3200 GT', 'Biturbo', 'Coupe', 'Ghibli', 'GranCabrio', 'GranTurismo', 'Grecale', 'Karif', 'Levante', 'MC20', 'Quattroporte', 'Shamal', 'Spyder'],
  'Aston Martin': ['Cygnet', 'DB9', 'DB11', 'DB12', 'DBS', 'DBX', 'DBX707', 'One-77', 'Rapide', 'V8 Vantage', 'Valkyrie', 'Vanquish', 'Vantage', 'Virage'],
  Saleen: ['Mustang', 'S1', 'S7', 'S281', 'S302'],
  Bentley: ['Arnage', 'Azure', 'Bentayga', 'Bentayga EWB', 'Brooklands', 'Continental', 'Continental Flying Spur', 'Continental GT', 'Flying Spur', 'Mulsanne', 'Turbo R'],
  'Rolls-Royce': ['Corniche', 'Cullinan', 'Dawn', 'Ghost', 'Park Ward', 'Phantom', 'Silver Seraph', 'Silver Shadow', 'Silver Spur', 'Spectre', 'Wraith'],
  Maybach: ['6', '57', '62', 'GLS 600', 'S-Class', 'S560', 'S650'],
  Chery: ['Amulet', 'Arrizo', 'Arrizo 5', 'Arrizo 7', 'Arrizo 8', 'Bonus', 'CrossEastar', 'Eastar', 'Fora', 'Fulwin', 'QQ', 'Tiggo', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 5', 'Tiggo 7', 'Tiggo 8', 'Tiggo 8 Pro', 'Very'],
  JAC: ['Hunter', 'iEV', 'iEV7S', 'J5', 'J6', 'Refine', 'Refine S', 'S3', 'S5', 'S7', 'Sehol', 'T6', 'T8'],
  BYD: ['Atto 3', 'Destroyer 05', 'Dolphin', 'E2', 'E6', 'F3', 'F6', 'Han', 'Qin', 'Qin Plus', 'Seagull', 'Seal', 'Seal U', 'Shark', 'Song', 'Song Plus', 'Tang', 'Yangwang U8', 'Yuan', 'Yuan Plus'],
  Roewe: ['350', '550', '750', '950', 'D7', 'ei6', 'i5', 'i6', 'Marvel X', 'RX3', 'RX5', 'RX8'],
  Geely: ['Atlas', 'Atlas Pro', 'Binrui', 'Boyue', 'Coolray', 'Emgrand', 'Emgrand 7', 'GC9', 'Geometry C', 'MK', 'Monjaro', 'Okavango', 'Preface', 'Tugella', 'Xingyue'],
  Changfeng: ['Cheetah', 'CS6', 'CS7', 'Feiteng', 'Liebao'],
  Tata: ['Ace', 'Altroz', 'Harrier', 'Hexa', 'Indica', 'Indigo', 'Nano', 'Nexon', 'Punch', 'Safari', 'Sumo', 'Tiago', 'Tigor'],
  Saturn: ['Aura', 'Ion', 'L-Series', 'Outlook', 'Relay', 'S-Series', 'Sky', 'Vue'],
  UAZ: ['452', '469', '3160', '3162', '3909', 'Buhanka', 'Cargo', 'Hunter', 'Patriot', 'Pickup', 'Profi'],
  ZAZ: ['968', 'Chance', 'Dana', 'Forza', 'Lanos', 'Sens', 'Slavuta', 'Tavria', 'Vida'],
  Hafei: ['Brio', 'Lobo', 'Princip', 'Saibao', 'Simbo', 'Zhongyi'],
  'Great Wall': ['C30', 'C50', 'Deer', 'Florid', 'Hover', 'Hover H3', 'Hover H5', 'Hover H6', 'Poer', 'Poer King Kong', 'Safe', 'Voleex', 'Wingle', 'Wingle 5', 'Wingle 7'],
  Foton: ['Aumark', 'Gratour', 'Sauvana', 'Thunder', 'Toano', 'Tunland', 'View'],
  Dongfeng: ['580', 'Aeolus', 'AX7', 'Fengon', 'H30', 'Mage', 'Nammi', 'Rich', 'S30', 'Shine'],
  Xingtai: ['254', '304', '404', '454', '554', '654'],
  Karsan: ['Atak', 'e-Atak', 'e-Jest', 'Jest', 'Star'],
  Changan: ['Alsvin', 'CS35', 'CS35 Plus', 'CS55', 'CS55 Plus', 'CS75', 'CS75 Plus', 'CS85', 'CS95', 'Eado', 'Hunter', 'Raeton', 'UNI-K', 'UNI-T', 'UNI-V'],
  Lifan: ['320', '520', '620', '720', 'Murman', 'Myway', 'Smily', 'Solano', 'X50', 'X60', 'X70'],
  MG: ['Cyberster', 'Extender', 'GS', 'HS', 'Marvel R', 'MG One', 'MG3', 'MG4', 'MG5', 'MG6', 'RX5', 'ZS'],
  Hyster: ['H2.0', 'H2.5', 'H3.0', 'H3.5', 'H4.0', 'H5.0', 'H5.5', 'H8.0'],
  Haval: ['Big Dog', 'Dargo', 'F7', 'F7x', 'H2', 'H5', 'H6', 'H6 GT', 'H7', 'H9', 'Jolion', 'M6', 'Raptor'],
  Niewiadow: ['Bocian', 'N126', 'N126NT', 'N126NTL', 'N133'],
  Fisker: ['Alaska', 'EMotion', 'Karma', 'Ocean', 'Pear'],
  Brilliance: ['BS4', 'BS6', 'FRV', 'FSV', 'H230', 'H320', 'H530', 'Jinbei', 'V3', 'V5'],
  CPI: ['Aragon', 'GTR', 'Oliver', 'Popcorn', 'SM'],
  'DM Telai': ['Chassis', 'Custom', 'Standard'],
  Lotus: ['Eletre', 'Elise', 'Elite', 'Emeya', 'Emira', 'Esprit', 'Europa', 'Evija', 'Evora', 'Exige'],
  FAW: ['Besturn', 'Besturn B50', 'Besturn B70', 'Besturn T77', 'Hongqi H5', 'Jiefang', 'Junpai', 'Oley', 'V2', 'V5', 'Vita'],
  Bugatti: ['Bolide', 'Centodieci', 'Chiron', 'Divo', 'EB110', 'La Voiture Noire', 'Mistral', 'Veyron'],
  Zxauto: ['Admiral', 'Grand Lion', 'Grand Tiger', 'Landmark', 'Terralord'],
  LTI: ['TX', 'TX1', 'TX2', 'TX4'],
  YTO: ['DF', 'LX904', 'MF504', 'X904', 'X1204'],
  Soueast: ['A5', 'DX3', 'DX7', 'Lioncel', 'V3', 'V5', 'V6'],
  Baic: ['Arcfox', 'BJ40', 'BJ80', 'D50', 'E150', 'EU5', 'Senova', 'X25', 'X35', 'X55', 'X65'],
  Lonking: ['CDM833', 'CDM856', 'CDM863', 'LG833', 'LG953'],
  McLaren: ['540C', '570S', '600LT', '650S', '675LT', '720S', '750S', '765LT', 'Artura', 'Elva', 'F1', 'GT', 'P1', 'Senna'],
  Proton: ['Exora', 'Gen-2', 'Iriz', 'Perdana', 'Persona', 'Preve', 'Saga', 'Satria', 'Suprima S', 'Wira', 'X50', 'X70', 'X90'],
  'Iran Khodro': ['Arisun', 'Dena', 'Pars', 'Peugeot 206', 'Peugeot 405', 'Runna', 'Samand', 'Soren', 'Tara'],
  Smart: ['#1', '#3', 'Crossblade', 'Forfour', 'Fortwo', 'Roadster', 'Roadster Coupe'],
  AMC: ['Ambassador', 'Concord', 'Eagle', 'Gremlin', 'Hornet', 'Javelin', 'Matador', 'Pacer', 'Spirit'],
  Dacia: ['1310', 'Bigster', 'Dokker', 'Duster', 'Jogger', 'Lodgy', 'Logan', 'Nova', 'Sandero', 'Solenza', 'Spring'],
  Arcfox: ['Alpha-S', 'Alpha-S5', 'Alpha-T', 'Kaola'],
  Zeekr: ['001', '007', '7X', '009', 'Mix', 'X'],
  Voyah: ['Courage', 'Dream', 'Free', 'Passion', 'Zhuiguang'],
  Hongqi: ['E-HS9', 'E-QM5', 'H5', 'H7', 'H9', 'HS5', 'HS7', 'L5', 'LS7'],
  Huawei: ['Aito M5', 'Aito M7', 'Aito M9', 'Luxeed S7', 'Stelato S9'],
  Lixiang: ['i8', 'L6', 'L7', 'L8', 'L9', 'Mega', 'One'],
  Xpeng: ['G3', 'G6', 'G9', 'Mona M03', 'P5', 'P7', 'P7i', 'X9'],
  Datsun: ['240Z', '280Z', '510', 'GO', 'mi-DO', 'on-DO', 'redi-GO', 'Sunny'],
  'Saic Motor': ['IM', 'Maxus', 'MG', 'Rising', 'Roewe'],
  Zukida: ['Custom', 'Standard'],
  Mitsuoka: ['Buddy', 'Galue', 'Himiko', 'Like-T3', 'Orochi', 'Roadster', 'Rock Star', 'Viewt'],
  Genesis: ['Electrified G80', 'Electrified GV70', 'G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
  'Yuanxin Energy\'s': ['Custom', 'EV', 'Standard'],
  Euler: ['Ballet Cat', 'Good Cat', 'GT', 'Lightning Cat', 'Punk Cat'],
  NIO: ['EC6', 'EC7', 'EL6', 'EL7', 'EP9', 'ES6', 'ES7', 'ES8', 'ET5', 'ET5T', 'ET7', 'ET9'],
  Linde: ['E14', 'E16', 'E20', 'H20', 'H25', 'H30', 'R14'],
  'Shade Xtreme': ['Custom', 'Sport', 'Standard'],
  Jetour: ['Dashing', 'T2', 'Traveller', 'X70', 'X70 Plus', 'X90', 'X90 Plus', 'X95'],
  Hiphi: ['A', 'X', 'Y', 'Z'],
  Aion: ['Hyper GT', 'Hyper SSR', 'LX', 'S', 'S Plus', 'V', 'Y', 'Y Plus'],
  'DS Automobiles': ['DS3', 'DS3 Crossback', 'DS4', 'DS4 Crossback', 'DS4 E-Tense', 'DS5', 'DS7', 'DS7 Crossback', 'DS9'],
  'Renault Samsung': ['QM3', 'QM5', 'QM6', 'SM3', 'SM5', 'SM6', 'SM7', 'XM3'],
  Neta: ['Aya', 'GT', 'S', 'U', 'V', 'X'],
  Exeed: ['LX', 'RX', 'Sterra ES', 'Sterra ET', 'TX', 'TXL', 'VX'],
  Skywell: ['BE11', 'ET5', 'ET7'],
  'Huawei Inside': ['Aito M5', 'Aito M7', 'Aito M9', 'Avatr 11'],
  Avatr: ['07', '11', '12'],
  Polestar: ['1', '2', '3', '4', '5', '6'],
  Dayun: ['Pika', 'Yuanhu', 'Yuehu'],
  Xiaomi: ['SU7', 'SU7 Max', 'SU7 Pro', 'SU7 Ultra', 'YU7'],
  Izh: ['2126 Oda', '2715', '2717', 'Combi', 'Jupiter', 'Planeta'],
  'Lynk & Co': ['01', '02', '03', '05', '06', '08', '09', 'Z10'],
  Gonow: ['Aoosed', 'GA200', 'GX6', 'Troy', 'Way'],
  Sena: ['Custom', 'Standard'],
  Forthing: ['Friday', 'Lingzhi', 'T5', 'T5 EVO', 'U-Tour', 'Yacht'],
  'IM Motors': ['L6', 'L7', 'LS6', 'LS7'],
  AIQAR: ['Custom', 'EV', 'Standard'],
  Vauxhall: ['Adam', 'Antara', 'Astra', 'Combo', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Meriva', 'Mokka', 'Vectra', 'Vivaro', 'Zafira'],
  Rivian: ['EDV', 'R1S', 'R1T', 'R2', 'R3', 'R3X'],
  MPM: ['Erelis', 'Errante', 'PS160'],
  OMODA: ['5', '7', 'C3', 'C5', 'C9', 'E5'],
  Mahindra: ['Alturas', 'BE 6e', 'Bolero', 'KUV100', 'Marazzo', 'Quanto', 'Scorpio', 'Scorpio-N', 'Thar', 'XEV 9e', 'XUV300', 'XUV500', 'XUV700', 'Xylo'],
  Leapmotor: ['B10', 'C01', 'C10', 'C11', 'C16', 'T03'],
  Aito: ['M5', 'M7', 'M8', 'M9'],
  Wuling: ['Air EV', 'Almaz', 'Bingo', 'Confero', 'Cortez', 'Formo', 'Hongguang', 'Hongguang Mini EV', 'Mini EV', 'Victory'],
  Maxus: ['D90', 'Deliver 9', 'Euniq', 'Euniq 5', 'Euniq 6', 'G10', 'G20', 'G50', 'Mifa 9', 'T60', 'T70', 'T90'],
  GWM: ['Cannon', 'Haval H6', 'Ora', 'Ora Good Cat', 'Poer', 'Tank', 'Tank 300', 'Tank 500', 'Wingle'],
  Wey: ['Coffee 01', 'Coffee 02', 'Lanshan', 'Tank 300', 'VV5', 'VV6', 'VV7'],
  Baojun: ['310', '360', '510', '530', 'E100', 'E200', 'KiWi EV', 'RM-5', 'RS-3', 'RS-5'],
  Baw: ['007', 'BJ212', 'BJ2022', 'Luba', 'Warrior', 'Yusheng'],
  Sunbeam: ['Alpine', 'Imp', 'Rapier', 'Talbot', 'Tiger'],
  Bertone: ['Freeclimber', 'GB110', 'Mantide', 'X1/9'],
  Lucid: ['Air', 'Air Grand Touring', 'Air Pure', 'Air Sapphire', 'Air Touring', 'Gravity'],
  GAC: ['Aion S', 'Aion Y', 'Emkoo', 'Emzoom', 'GA4', 'GA6', 'GA8', 'GS3', 'GS4', 'GS5', 'GS8', 'Trumpchi', 'Trumpchi M6', 'Trumpchi M8'],
  Vanderhall: ['Brawley', 'Carmel', 'Edison', 'Navarro', 'Oakberry', 'Venice'],
  Hycan: ['007', 'A06', 'V09', 'Z03'],
  Cupra: ['Ateca', 'Born', 'Formentor', 'Leon', 'Raval', 'Tavascan', 'Terramar'],
  Bestune: ['B50', 'B70', 'E01', 'NAT', 'T55', 'T77', 'T90', 'T99'],
  Kandi: ['Coco', 'EX3', 'K10', 'K23', 'K27'],
  VinFast: ['Fadil', 'Lux A2.0', 'Lux SA2.0', 'President', 'VF3', 'VF5', 'VF6', 'VF7', 'VF8', 'VF9'],
  Denza: ['D9', 'N7', 'N8', 'X', 'Z9'],
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
