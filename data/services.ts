import type { Service, ServiceCategory } from '@/types/car'

export const serviceCategories: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: 'tires', label: 'საბურავები', icon: '🔘' },
  { value: 'locksmith', label: 'კარის გაღება', icon: '🔑' },
  { value: 'electric', label: 'ელექტრიკი', icon: '⚡' },
  { value: 'chemical', label: 'ქიმწმენდა', icon: '🧴' },
  { value: 'towing', label: 'ევაკუატორი', icon: '🚛' },
  { value: 'importer', label: 'იმპორტიორი', icon: '🚢' },
  { value: 'mechanic', label: 'მექანიკოსი', icon: '🔧' },
  { value: 'carwash', label: 'ავტოდაბანვა', icon: '🚿' },
  { value: 'glass', label: 'შუშა / ტონირება', icon: '🪟' },
  { value: 'insurance', label: 'დაზღვევა', icon: '📋' },
  { value: 'diagnostics', label: 'დიაგნოსტიკა', icon: '🔍' },
  { value: 'detailing', label: 'დეტეილინგი', icon: '✨' },
  { value: 'tuning', label: 'ტიუნინგი', icon: '🏎️' },
  { value: 'other', label: 'სხვა', icon: '📦' },
]

export const sampleServices: Service[] = [
  {
    id: '1',
    name: 'რამაზი',
    category: 'mechanic',
    location: 'თბილისი',
    phone: '+995571132212',
    description: 'გამოცდილი მექანიკოსი 20 წლიანი გამოცდილებით',
  },
  {
    id: '2',
    name: 'SAGURAMO MOTORS',
    category: 'other',
    location: 'საგურამო',
    phone: '+995 598 231 333',
    description: 'ავტომობილების იმპორტი და გაყიდვა',
  },
  {
    id: '3',
    name: 'G&M აქსესუარები',
    category: 'tuning',
    location: 'ქუთაისი (online)',
    phone: '557783549',
    description: 'ავტო აქსესუარები და ტიუნინგი',
  },
  {
    id: '4',
    name: 'გასაღებების ხელოსანი — სპეც სერვისი',
    category: 'locksmith',
    location: 'თბილისი, მთელი ქალაქი',
    phone: '+995 555 00 11 22',
    description: 'მანქანის კარის გაღება 24/7',
  },
  {
    id: '5',
    name: 'ავტო პროგრამისტი — ECU სერვისი',
    category: 'diagnostics',
    location: 'თბილისი, ისანი',
    phone: '+995 555 33 44 55',
    description: 'ECU პროგრამირება და დიაგნოსტიკა',
  },
]

export const serviceSubCategories = {
  mechanic: [
    { name: 'ძრავის დიაგნოსტიკა', description: 'სრული კომპიუტერული შემოწმება' },
    { name: 'ძრავის რემონტი', description: 'ძრავის სრული აღდგენა' },
    { name: 'გადაცემათა კოლოფი', description: 'ავტომატიკა / მექანიკა' },
    { name: 'საჭე და სავალი ნაწილი', description: 'ამორტიზატორები, სტაბილიზატორები' },
  ],
  detailing: [
    { name: 'პრემიუმ პოლირება', description: 'სარკის ეფექტი' },
    { name: 'ქიმწმენდა', description: 'სალონის ღრმა წმენდა' },
    { name: 'კერამიკული დაცვა', description: 'ლაქის დაცვა' },
  ],
  electric: [
    { name: 'აკუმულატორი', description: 'შემოწმება და შეცვლა' },
    { name: 'სენსორები', description: 'ელექტრონული სისტემები' },
    { name: 'კონდიციონერი', description: 'დატენვა და შეკეთება' },
  ],
  other: [
    { name: 'დაშლა / აწყობა', description: 'ინტერიერი + ექსტერიერი' },
    { name: 'რკინის სამუშაოები', description: 'დარტყმის აღდგენა' },
    { name: 'ევაკუატორი', description: 'მანქანის გადაყვანა' },
    { name: 'ტექ. დათვალიერება', description: 'ინსპექცია' },
  ],
}
