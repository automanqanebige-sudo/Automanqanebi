import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">გვერდი ვერ მოიძებნა</h1>
      <p className="mt-2 text-muted-foreground">მოთხოვნილი გვერდი არ არსებობს ან წაიშალა.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
      >
        მთავარი გვერდი
      </Link>
    </div>
  )
}
