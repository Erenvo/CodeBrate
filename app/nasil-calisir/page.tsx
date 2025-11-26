// app/nasilCalisir/page.tsx
'use client';

import Link from 'next/link';

const steps = [
  {
    title: '1. Profilini Oluştur',
    description:
      'Yeteneklerini, deneyimlerini ve portföyünü birkaç dakikada ekle.',
    accent: 'bg-gray-700/50 text-indigo-300',
  },
  {
    title: '2. Projenizi Tanımlayın',
    description:
      'İhtiyacınızı açıkça yazın; yapay zekâ destekli brief ile eksikleri biz tamamlayalım.',
    accent: 'bg-gray-700/50 text-indigo-300',
  },
  {
    title: '3. Eşleş ve Başla',
    description:
      'Algoritmamız doğru yetenekleri önerir; tek tıkla görüşmeyi planla.',
    accent: 'bg-gray-700/50 text-indigo-300',
  },
  {
    title: '4. Teslim ve Geri Bildirim',
    description:
      'Süreç boyunca ilerlemeyi takip et; teslim sonrası puanlamayı unutma.',
    accent: 'bg-gray-700/50 text-indigo-300',
  },
];

export default function NasilCalisirPage() {
  return (
    <main className="min-h-screen bg-gray-900 py-20 text-gray-100">
      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-[32px] bg-gray-950 px-10 py-16 text-center shadow-2xl shadow-black/40">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Nasıl Çalışır
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            CodaBrate ile birkaç adımda doğru ekip
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Brief gir, algoritmamız sana en uygun yetenekleri önersin; tüm süreç tek platformda.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/projeler/olustur"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Proje Oluştur
            </Link>
            <Link
              href="/yetenekler"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Yetenekleri Keşfet
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-4 px-6 sm:grid-cols-2 lg:mx-auto lg:max-w-5xl">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-sm"
          >
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${step.accent}`}
            >
              {step.title.split('.')[0]}. Adım
            </span>
            <h3 className="mt-4 text-xl font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-gray-300">{step.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}