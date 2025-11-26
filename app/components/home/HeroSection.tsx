import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Project = {
  id: string
  title: string
  summary: string
  tags: string[]
  owner: string
}

interface HeroSectionProps {
  projects: Project[]
}

export default function HeroSection({ projects }: HeroSectionProps) {
  return (
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
              {projects.map((p) => (
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
  )
}