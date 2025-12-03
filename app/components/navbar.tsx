import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b-2 border-primary">
      <div className="flex justify-between items-center">
        <div className="container mx-auto px-4 py-3 flex items-center flex-1">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Karta Łodzianina"
              width={160}
              height={34}
              className="h-auto w-40"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 font-medium text-sm uppercase tracking-wide ml-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Pakiety
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Aktualności
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Wydarzenia
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Zniżki
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Punkty obsługi
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Zostań partnerem
            </Link>
            <Link href="/mapa" className="hover:text-primary transition-colors">
              Łódź na mapie
            </Link>
            <Link
              href="/uslugi"
              className="hover:text-primary transition-colors"
            >
              Usługi
            </Link>
          </nav>
        </div>

        <div className="flex items-center bg-primary py-3 pr-5 pl-5">
          <Link
            href="#"
            className="px-6 py-2 border-2 border-white text-white text-sm font-bold uppercase hover:bg-white hover:text-primary transition-all duration-300 whitespace-nowrap"
          >
            Mój panel
          </Link>
          <button className="lg:hidden text-2xl text-white ml-4">☰</button>
        </div>
      </div>
    </header>
  );
}
