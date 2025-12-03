// app/components/common/Footer.tsx
export default function Footer() {
    return (
      <footer className="border-t border-gray-800 bg-gray-950 text-gray-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">CodaBrate</p>
            <p className="mt-1 text-xs text-gray-500">
              Projeni paylaş, takımını bul. Üniversite topluluğun için dijital talent hub.
            </p>
            <p className="text-xs text-gray-400">
              CodaBrate@CodaBrate.com · 0555 555 55 55
            </p>
          </div>
  
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="/projeler" className="hover:text-white">
              Projeler
            </a>
            <a href="/yetenekler" className="hover:text-white">
              Yetenek Havuzu
            </a>
            <a href="/nasil-calisir" className="hover:text-white">
              Nasıl Çalışır
            </a>
            <a href="/(auth)/register" className="hover:text-white">
              Başla
            </a>
          </nav>
  
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} CodaBrate. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    );
  }