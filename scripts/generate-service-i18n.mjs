/**
 * Generates lib/service-catalog-messages.ts from embedded translations.
 * Run: node scripts/generate-service-i18n.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { items, categories } from './service-catalog-items.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Section titles
const sections = {
  mechanic: { ka: 'ძრავი და მექანიკა', en: 'Engine & mechanics', ru: 'Двигатель и механика' },
  transmission: { ka: 'ტრანსმისია', en: 'Transmission', ru: 'Трансмиссия' },
  suspension: { ka: 'სავალი ნაწილი', en: 'Suspension & chassis', ru: 'Подвеска и ходовая' },
  brakes: { ka: 'მუხრუჭები', en: 'Brakes', ru: 'Тормоза' },
  cooling: { ka: 'გაგრილება', en: 'Cooling system', ru: 'Система охлаждения' },
  fuel: { ka: 'საწვავის სისტემა', en: 'Fuel system', ru: 'Топливная система' },
  steering: { ka: 'საჭე და ბრუნვა', en: 'Steering & alignment', ru: 'Рулевое управление' },
  electric: { ka: 'ელექტრო სისტემა', en: 'Electrical systems', ru: 'Электрика' },
  climate: { ka: 'კონდიციონერი / გათბობა', en: 'Climate control', ru: 'Климат-контроль' },
  tires: { ka: 'საბურავები და დისკები', en: 'Tires & wheels', ru: 'Шины и диски' },
  bodywork: { ka: 'რკინის სამუშაოები', en: 'Body repair', ru: 'Кузовной ремонт' },
  painting: { ka: 'რეცხვა', en: 'Painting', ru: 'Покраска' },
  detailing: { ka: 'დეტეილინგი და წმენდა', en: 'Detailing & wash', ru: 'Детейлинг и мойка' },
  glass: { ka: 'მინები და ტონირება', en: 'Glass & tinting', ru: 'Стекла и тонировка' },
  parts: { ka: 'ავტონაწილები', en: 'Auto parts', ru: 'Автозапчасти' },
  diagnostics: { ka: 'დიაგნოსტიკა', en: 'Diagnostics', ru: 'Диагностика' },
  tuning: { ka: 'ტიუნინგი', en: 'Performance tuning', ru: 'Тюнинг' },
  evHybrid: { ka: 'ელექტრო / ჰიბრიდი', en: 'EV & hybrid', ru: 'Электро и гибрид' },
  mobile: { ka: 'მოძრავი სერვისები', en: 'Mobile services', ru: 'Выездные услуги' },
  towing: { ka: 'ევაკუაცია / გზაზე დახმარება', en: 'Towing & roadside', ru: 'Эвакуация и помощь' },
  accessories: { ka: 'აქსესუარები', en: 'Accessories', ru: 'Аксессуары' },
  security: { ka: 'უსაფრთხოება', en: 'Security & electronics', ru: 'Безопасность' },
  upholstery: { ka: 'სალონი / ავეჯი', en: 'Upholstery & interior', ru: 'Салон и обивка' },
  wrap: { ka: 'ვინილი / PPF', en: 'Wrap & PPF', ru: 'Оклейка и PPF' },
  locksmith: { ka: 'გასაღები / საკეტი', en: 'Locksmith', ru: 'Автоключи и замки' },
  insurance: { ka: 'დაზღვევა', en: 'Insurance', ru: 'Страхование' },
  legal: { ka: 'იურიდიული / რეგისტრაცია', en: 'Legal & registration', ru: 'Юридические услуги' },
  sales: { ka: 'გაყიდვა / იმპორტი', en: 'Sales & import', ru: 'Продажа и импорт' },
  rental: { ka: 'ქირაობა', en: 'Rental & lease', ru: 'Аренда и лизинг' },
  fleet: { ka: 'კომერციული ტრანსპორტი', en: 'Fleet & commercial', ru: 'Коммерческий транспорт' },
  specialty: { ka: 'სპეციალური სერვისები', en: 'Specialty services', ru: 'Специальные услуги' },
}

const outCategoryPath = path.join(root, 'lib', 'service-category-messages.ts')
const outCatalogPath = path.join(root, 'lib', 'service-catalog-messages.ts')
const kaCat = {}
const enCat = {}
const ruCat = {}
const kaSub = {}
const enSub = {}
const ruSub = {}

for (const [key, s] of Object.entries(sections)) {
  kaCat[`services.section.${key}`] = s.ka
  enCat[`services.section.${key}`] = s.en
  ruCat[`services.section.${key}`] = s.ru
}

for (const [key, c] of Object.entries(categories)) {
  kaCat[`services.cat.${key}`] = c.ka
  enCat[`services.cat.${key}`] = c.en
  ruCat[`services.cat.${key}`] = c.ru
}

for (const [id, arr] of Object.entries(items)) {
  kaSub[`services.sub.${id}`] = arr[0]
  kaSub[`services.sub.${id}Desc`] = arr[1]
  enSub[`services.sub.${id}`] = arr[2]
  enSub[`services.sub.${id}Desc`] = arr[3]
  ruSub[`services.sub.${id}`] = arr[4]
  ruSub[`services.sub.${id}Desc`] = arr[5]
}

fs.writeFileSync(
  outCategoryPath,
  `// Auto-generated — categories & sections only\nexport const serviceCategoryMessages = {\n  ka: ${JSON.stringify(kaCat, null, 2)},\n  en: ${JSON.stringify(enCat, null, 2)},\n  ru: ${JSON.stringify(ruCat, null, 2)},\n} as const\n`,
  'utf8'
)
fs.writeFileSync(
  outCatalogPath,
  `// Auto-generated — sub-items (lazy-loaded on /services)\nexport const serviceCatalogMessages = {\n  ka: ${JSON.stringify(kaSub, null, 2)},\n  en: ${JSON.stringify(enSub, null, 2)},\n  ru: ${JSON.stringify(ruSub, null, 2)},\n} as const\n`,
  'utf8'
)
console.log('Generated category keys:', Object.keys(kaCat).length)
console.log('Generated catalog keys:', Object.keys(kaSub).length)
