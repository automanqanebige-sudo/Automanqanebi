import AddCarForm from '@/components/AddCarForm'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Add Car - AUTOMANQANEBI.GE',
  description: 'List your car for sale on AUTOMANQANEBI.GE - Georgia\'s leading car marketplace',
}

export default function AddCarPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
              <Plus className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                მანქანის დამატება
              </h1>
              <p className="mt-1 text-muted-foreground">
                შეავსეთ ქვემოთ მოცემული ველები თქვენი მანქანის გასაყიდად
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <AddCarForm />
      </div>
    </main>
  )
}
