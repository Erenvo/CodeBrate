// app/page.tsx
import React from 'react'
import { ArrowRight, Search, User, Grid, MessageSquare } from 'lucide-react'
import Link from 'next/link' // <a> etiketleri <Link> ile değiştirildi

// Örnek proje verisi (tasarım dosyasından)
const sampleProjects = [
  {
    id: '1',
    title: 'Akıllı Ders Notu Sistemi',
    summary: 'Öğrenciler için otomatik not özetleme ve çalışma planı.',
    tags: ['Python', 'NLP'],
    owner: 'Bilkent',
  },
  {
    id: '2',
    title: 'Kampüs Etkinlik Haritası',
    summary: 'Üniversite etkinliklerini görsel olarak keşfet.',
    tags: ['React', 'Map'],
    owner: 'İTÜ',
  },
  {
    id: '3',
    title: 'Portfolyo Otomasyon Aracı',
    summary: 'GitHub reposunu CV formatına çeviren araç.',
    tags: ['Node', 'Frontend'],
    owner: 'ODTÜ',
  },
]

export default function LandingPage() {
  return (
    // <main> etiketi ile başlıyor, Navbar ve Footer layout'tan gelecek
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 pb-12 pt-12">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Doğru ekip, doğru fikirle buluşsun.
            </h2>
            <p className="mt-4 text-gray-400">
              Üniversite öğrencileri için projeni paylaş, yetenekleri filtrele,
              güvenli bir şekilde ekip kur. "Vitrin" ve "Kasa" ile fikirlerini
              koru.
            </p>

            <div className="mt-6 flex gap-3">
              <div className="relative flex-1">
                <input
                  aria-label="Ara"
                  className="w-full rounded-md border border-gray-700 bg-gray-900 px-4 py-3 pr-12 text-sm text-gray-200 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Proje veya yetenek ara (örn: React, NLP)"
                />
                <button className="absolute right-2 top-2/4 -translate-y-1/2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-indigo-600 text-white hover:opacity-90">
                  Ara
                </button>
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border border-gray-700 px-4 py-2 text-sm hover:bg-gray-800">
                Filtreler
              </button>
            </div>

            <div className="mt-6 flex gap-3 text-xs text-gray-400">
              <div className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2">
                🔒 Vitrin & Kasa
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2">
                ⏱️ Zaman Damgası
              </div>
              <div className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2">
                🌍 Üniversite Doğrulaması
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
              <h3 className="font-semibold text-white">Öne çıkan projeler</h3>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {sampleProjects.map((p) => (
                  <article key={p.id} className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-md bg-indigo-700 flex items-center justify-center text-white font-semibold">
                      {p.title
                        .split(' ')
                        .slice(0, 2)
                        .map((s) => s[0])
                        .join('')}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">
                        {p.title}
                      </h4>
                      <p className="text-xs text-gray-400">{p.summary}</p>
                      <div className="mt-2 flex gap-2">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Link
                  href="/projeler"
                  className="text-sm font-medium text-indigo-400 inline-flex items-center gap-2 hover:underline"
                >
                  Tüm projeleri gör <ArrowRight size={16} />
                </Link>
                <Link
                  href="/projeler/olustur"
                  className="text-sm inline-flex items-center gap-2 rounded-md border border-indigo-500 px-3 py-2 text-indigo-400 hover:bg-gray-700"
                >
                  Proje Oluştur
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="nasilcalisir"
        className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
      >
        <h3 className="text-2xl font-semibold text-white">Nasıl çalışır?</h3>
        <p className="mt-2 text-gray-400">
          Kayıt ol (üniversite e-postası) → Profil oluştur → Proje yayınla
          (Vitrin) → Başvuruları değerlendir → Kasa'yı aç.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-indigo-900 p-3 text-indigo-300 shrink-0">
                <Grid size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white">Vitrin & Kasa</h4>
                <p className="text-sm text-gray-400">
                  Proje özetini herkese açık paylaş, detayları yalnızca onaylı
                  kişilere göster.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-indigo-900 p-3 text-indigo-300 shrink-0">
                <User size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white">Üniversite Doğrulama</h4>
                <p className="text-sm text-gray-400">
                  Sadece @edu.tr e-postası ile kayıt. Güvenli topluluk.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-800 p-6 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-indigo-900 p-3 text-indigo-300 shrink-0">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white">Başvuru & İletişim</h4>
                <p className="text-sm text-gray-400">
                  Projeye başvur, onay sonrası iletişime geç.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section
        id="projeler"
        className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
      >
        <h3 className="text-2xl font-semibold text-white mb-6">Proje Pazarı</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-gray-700 bg-gray-800 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {p.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-400">
                    {p.owner} · {p.tags.join(' • ')}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-300">{p.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
                  İlgileniyorum
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TALENT POOL */}
      <section
        id="yetenekler"
        className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800"
      >
        <h3 className="text-2xl font-semibold text-white mb-6">Yetenek Havuzu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Örnek Yetenek Kartı 1 */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                EA
              </div>
              <div>
                <h4 className="font-semibold text-white">Eren A.</h4>
                <p className="text-xs text-gray-400">React • TypeScript • ML</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Proje fikirlerini geliştirmeye açığım. Haftada 8-10 saat
              ayırabilirim.
            </p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
                İletişime Geç
              </button>
              <button className="rounded-md border border-gray-700 px-3 py-1 text-sm hover:bg-gray-700">
                Profili Gör
              </button>
            </div>
          </div>
          {/* Örnek Yetenek Kartı 2 */}
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-pink-700 flex items-center justify-center text-white">
                YK
              </div>
              <div>
                <h4 className="font-semibold text-white">Y. Koray</h4>
                <p className="text-xs text-gray-400">UI/UX • Figma</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-300">
              Tasarım odaklı projelere açığım. Portfolio: behance.net/koray
            </p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-400 hover:bg-gray-700">
                İletişime Geç
              </button>
              <button className="rounded-md border border-gray-700 px-3 py-1 text-sm hover:bg-gray-700">
                Profili Gör
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-gray-800">
        <div className="rounded-2xl bg-indigo-700/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Takımını kurmaya hazır mısın?
            </h3>
            <p className="mt-2 text-gray-400">
              Hemen kaydol, profilini oluştur ve proje ilanını paylaş. Onay
              sonrası detayları kontrol et.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:opacity-90"
            >
              Kaydol
            </Link>
            <button className="rounded-md border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-800">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}